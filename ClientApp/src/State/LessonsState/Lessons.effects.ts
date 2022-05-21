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
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { Lesson } from "src/models.model";
import { LessonsService } from "src/Services/lessons.service";
import { AddLesson, AddLesson_Failed, AddLesson_Success, dummyAction, LoadLessons, LoadLessonsFail, LoadLessonsSuccess, RemoveLesson, RemoveLesson_Failed, RemoveLesson_Success, SetValidationErrors, UpdateLesson, UpdateLesson_Failed, UpdateLesson_Sucess } from "./Lessons.actions";
import { selectAllLessons } from "./Lessons.reducer";


@Injectable({
    providedIn: 'root'
})
export class LessonsEffects
{

    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private activatedRoute: ActivatedRoute,
        private LessonService: LessonsService, private store: Store,
        private router: Router, private spinner: SpinnerService) { }

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
    RemovePost$ = createEffect(() =>
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
}