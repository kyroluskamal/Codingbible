import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { CoursesController } from "src/Helpers/apiconstants";
import { NotificationMessage, PostType, sweetAlert } from "src/Helpers/constants";
import { DashboardRoutes } from "src/Helpers/router-constants";
import { Course } from "src/models.model";
import { CourseService } from "src/Services/course.service";
import { AddCourse, AddCourse_Failed, AddCourse_Success, ChangeStatus, ChangeStatus_Failed, ChangeStatus_Success, dummyAction, LoadCourses, LoadCoursesFail, LoadCoursesSuccess, RemoveCourse, RemoveCourse_Failed, RemoveCourse_Success, SetValidationErrors, UpdateCourse, UpdateCourse_Failed, UpdateCourse_Sucess } from "./course.actions";
import { selectAllCourses } from "./course.reducer";

@Injectable({
    providedIn: 'root'
})
export class CoursesEffects
{

    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private activatedRoute: ActivatedRoute,
        private CourseService: CourseService, private store: Store,
        private router: Router, private spinner: SpinnerService) { }

    GetAllCourses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadCourses),
            withLatestFrom(this.store.select(selectAllCourses)),
            switchMap(([action, Courses]) =>
            {
                if (Courses.length == 0)
                    return this.CourseService.GetAll(CoursesController.GetAllCourses).pipe(
                        map((r) =>
                        {
                            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                            return LoadCoursesSuccess({ payload: r });
                        }),
                        catchError((e) => of(LoadCoursesFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                    );
                return of(dummyAction());
            })
        )
    );
    AddCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddCourse),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.CourseService.Add(CoursesController.AddCourse, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Course'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { action: PostType.Edit, step: `step${1}`, courseId: r.id } });
                        return AddCourse_Success(r);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));
                        return of(AddCourse_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    UpdateCourse$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateCourse),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.CourseService.Update(CoursesController.UpdateCourse, action).pipe(
                    map((r) =>
                    {
                        console.log(r);
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Course'));
                        let x: Update<Course> = {
                            id: action.id,
                            changes: r.data as Course
                        };
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return UpdateCourse_Sucess({ Course: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));
                        return of(UpdateCourse_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    RemovePost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveCourse),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.CourseService.Delete(CoursesController.DeleteCourse, action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Delete('Course'));
                        this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home]);
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return RemoveCourse_Success({ id: action.id });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Course'));
                        return of(RemoveCourse_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
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
                return this.CourseService.ChangeStatus(action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Course status'));
                        let x: Update<Course> = {
                            id: action.id,
                            changes: action
                        };
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return ChangeStatus_Success({ Course: x, currentCourseById: action });
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