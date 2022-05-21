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
import { Section } from "src/models.model";
import { SectionsService } from "src/Services/sections.service";
import { AddSection, AddSection_Failed, AddSection_Success, dummyAction, LoadSections, LoadSectionsFail, LoadSectionsSuccess, RemoveSection, RemoveSection_Failed, RemoveSection_Success, SetValidationErrors, UpdateSection, UpdateSection_Failed, UpdateSection_Sucess } from "./sections.actions";
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
    AddSection$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddSection),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.SectionService.Add(CoursesController.AddSection, action).pipe(
                    map((r) =>
                    {
                        console.log("From effec", r);
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Section'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return AddSection_Success(r);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Section'));
                        return of(AddSection_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
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
                        console.log(r);
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Section'));
                        let x: Update<Section> = {
                            id: action.id,
                            changes: r.data as Section
                        };
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return UpdateSection_Sucess({ Section: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));
                        return of(UpdateSection_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
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
                        return RemoveSection_Success({ id: action.id });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Section'));
                        return of(RemoveSection_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
}