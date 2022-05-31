import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { NotificationsService } from "src/CommonServices/notifications.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { CoursesController } from "src/Helpers/apiconstants";
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { DashboardRoutes } from "src/Helpers/router-constants";
import { Lesson } from "src/models.model";
import { LessonsService } from "src/Services/lessons.service";
import { AddLesson, AddLesson_Failed, AddLesson_Success, ChangeStatus, ChangeStatus_Failed, ChangeStatus_Success, dummyAction, GetLessonById, GetLessonById_Failed, GetLessonById_Success, GetLessonsByCourseId, GetLessonsByCourseId_Failed, GetLessonsByCourseId_Success, LoadLessons, LoadLessonsFail, LoadLessonsSuccess, RemoveLesson, RemoveLesson_Failed, RemoveLesson_Success, SetValidationErrors, UpdateLesson, UpdateLesson_Failed, UpdateLesson_Sucess } from "./Lessons.actions";
import { selectAllLessons } from "./Lessons.reducer";


@Injectable({
    providedIn: 'root'
})
export class LessonsEffects
{

    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private LessonService: LessonsService, private store: Store,
        private router: Router, private notifications: NotificationsService,
        private spinner: SpinnerService) { }

    GetAllLessons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadLessons),
            withLatestFrom(this.store.select(selectAllLessons)),
            switchMap(([action, Lessons]) =>
            {
                if (Lessons.length == 0)
                    return this.LessonService.GetAll(CoursesController.GetLessons).pipe(
                        map((r) =>
                        {
                            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                            return LoadLessonsSuccess({ payload: r });
                        }),
                        catchError((e) => of(LoadLessonsFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                    );
                return of(dummyAction());
            })
        )
    );
    GetLessonsById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GetLessonById),
            switchMap((action) =>
            {
                return this.LessonService.GetById(CoursesController.GetLessonById, action.id).pipe(
                    map((r) =>
                    {
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return GetLessonById_Success(r);
                    }),
                    catchError((e) =>
                    {
                        if (e.error)
                            if (e.error.status.toLowerCase() == "notfound")
                            {
                                this.notifications.Error_Swal(sweetAlert.Title.Error,
                                    sweetAlert.ButtonText.OK, `<h4>${e.error.message}</h4>`);
                                this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home,
                                    DashboardRoutes.Courses.Lessons.Home]);
                            }
                        return of(GetLessonById_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    }
                    )
                );
            })
        )
    );
    GetLessonsByCourseId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GetLessonsByCourseId),
            switchMap((action) =>
            {
                return this.LessonService.GetLessonsByCourseId(action.courseId).pipe(
                    map((r) =>
                    {
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return GetLessonsByCourseId_Success({ payload: r });
                    }),
                    catchError((e) => of(GetLessonsByCourseId_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                );
            })
        )
    );
    AddLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddLesson),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.LessonService.Add(CoursesController.AddLesson, action).pipe(
                    map((r) =>
                    {
                        console.log("From effec", r);
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Lesson'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.EditPost], { queryParams: { id: r.id } });
                        return AddLesson_Success(r);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Lesson'));
                        return of(AddLesson_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    UpdateLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateLesson),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.LessonService.Update(CoursesController.UpdateLesson, action).pipe(
                    map((r) =>
                    {
                        console.log(r);
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Lesson'));
                        let x: Update<Lesson> = {
                            id: action.id,
                            changes: r.data as Lesson
                        };
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return UpdateLesson_Sucess({ Lesson: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));
                        return of(UpdateLesson_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    RemoveLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveLesson),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.LessonService.Delete(CoursesController.DeleteLesson, action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Delete('Lesson'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        if (action.url === DashboardRoutes.Courses.Lessons.EditLesson)
                            this.router.navigate(['', DashboardRoutes.Home]);
                        return RemoveLesson_Success({ id: action.id });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Lesson'));
                        return of(RemoveLesson_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    changeStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ChangeStatus),
            switchMap((action) =>
            {
                return this.LessonService.ChangeStatus(action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Section status'));
                        let x: Update<Lesson> = {
                            id: action.id,
                            changes: r.data as Lesson
                        };
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return ChangeStatus_Success({ Lesson: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Update('Course status'));
                        return of(ChangeStatus_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
}