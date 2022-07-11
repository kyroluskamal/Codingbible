import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { CoursesController } from "src/Helpers/apiconstants";
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { Section } from "src/models.model";
import { SectionsService } from "src/Services/sections.service";
import
{
    AdditionIsComplete, AddSection, AddSection_Failed,
    AddSection_Success, ChangeStatus, ChangeStatus_Failed, ChangeStatus_Success,
    dummyAction, GetSectionsByCourseId, GetSectionsByCourseId_Failed,
    GetSectionsByCourseId_Success, LoadSections, LoadSectionsFail,
    LoadSectionsSuccess, RemoveSection, RemoveSection_Failed,
    RemoveSection_Success, SetValidationErrors, UpdateIsCompleted,
    UpdateSection, UpdateSectionOrder, UpdateSectionOrder_Sucess,
    UpdateSection_Failed, UpdateSection_Sucess
} from "./sections.actions";
import { selectAllSections } from "./sections.reducer";


@Injectable({
    providedIn: 'root'
})
export class SectionsEffects
{

    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private activatedRoute: ActivatedRoute,
        private SectionService: SectionsService, private store: Store,
        private router: Router, private spinner: SpinnerService) { }

    GetAllSections$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadSections),
            withLatestFrom(this.store.select(selectAllSections)),
            switchMap(([action, Sections]) =>
            {
                if (Sections.length == 0)
                    return this.SectionService.GetAll(CoursesController.GetSections).pipe(
                        map((r) =>
                        {
                            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                            return LoadSectionsSuccess({ payload: r });
                        }),
                        catchError((e) => of(LoadSectionsFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                    );
                return of(dummyAction());
            })
        )
    );
    GetSectionsByCourseId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GetSectionsByCourseId),
            switchMap((action) =>
            {
                return this.SectionService.GetSectionsByCourseId(action.courseId).pipe(
                    map((r) =>
                    {
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        this.spinner.removeSpinner();
                        return GetSectionsByCourseId_Success({ payload: r });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        return of(GetSectionsByCourseId_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    AddSection$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddSection),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.SectionService.Add(CoursesController.AddSection, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Section'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        this.store.dispatch(AddSection_Success(r));
                        return AdditionIsComplete({ status: true });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        this.store.dispatch(AddSection_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                        return of(AdditionIsComplete({ status: false }));
                    })
                );
            })
        )
    );
    UpdateSection$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateSection),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.SectionService.Update(CoursesController.UpdateSection, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Section'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        this.store.dispatch(UpdateSection_Sucess({ Section: r.data as Section }));
                        return UpdateIsCompleted({ status: true });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        this.store.dispatch(UpdateSection_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                        return of(UpdateIsCompleted({ status: false }));
                    })
                );
            })
        )
    );
    RemovePost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveSection),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.SectionService.Delete(CoursesController.DeleteSection, action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Delete('Section'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        this.store.dispatch(RemoveSection_Success({ id: action.id, otherSlug: action.otherSlug }));
                        return UpdateIsCompleted({ status: true });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Section'));
                        this.store.dispatch(RemoveSection_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                        return of(UpdateIsCompleted({ status: false }));
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
                return this.SectionService.ChangeStatus(action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Section status'));
                        let x: Update<Section> = {
                            id: action.id,
                            changes: r.data as Section
                        };
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return ChangeStatus_Success({ Section: x });
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
    UpdateSectionOrder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateSectionOrder),
            mergeMap((action) =>
            {
                return this.SectionService.UpdateSectionOrder(action.payload).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Section order'));
                        this.store.dispatch(UpdateSectionOrder_Sucess({ payload: r.data as Section[] }));
                        return UpdateIsCompleted({ status: true });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Update('Section order'));
                        return of(UpdateIsCompleted({ status: false }));
                    })
                );
            })
        )
    );
}

