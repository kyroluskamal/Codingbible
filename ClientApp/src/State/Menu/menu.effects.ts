import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of, switchMap, withLatestFrom } from 'rxjs';
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { MenusController } from "src/Helpers/apiconstants";
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { Menu } from "src/models.model";
import { MenuService } from "src/Services/menu.service";
import { AddMenu, AddMenu_Failed, AddMenu_Success, GetMenuByLocationName, GetMenuByLocationName_Failed, GetMenuByLocationName_Success, LoadMenus, LoadMenusFail, LoadMenusSuccess, RemoveMenu, RemoveMenuItem, RemoveMenuItem_Failed, RemoveMenuItem_Success, RemoveMenu_Failed, RemoveMenu_Success, SetMenuValidationErrors, UpdateMenu, UpdateMenu_Failed, UpdateMenu_Sucess } from "./menu.actions";
import { selectAll_Menus } from "./menu.reducer";

@Injectable({
    providedIn: 'root'
})
export class MenuEffects
{

    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private MenuService: MenuService, private store: Store,
        private spinner: SpinnerService)
    {
    }

    AddMenu$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddMenu),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.MenuService.Add(MenusController.AddMenu, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Menu'));
                        this.store.dispatch(SetMenuValidationErrors({ validationErrors: [] }));
                        return AddMenu_Success(r);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Menu'));
                        return of(AddMenu_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    UpdateMenu$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateMenu),
            exhaustMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.MenuService.Update(MenusController.UpdateMenu, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Menu'));
                        this.store.dispatch(SetMenuValidationErrors({ validationErrors: [] }));
                        let x: Update<Menu> = {
                            id: action.id,
                            changes: r.data as Menu
                        };
                        return UpdateMenu_Sucess({ Menu: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Menu'));
                        return of(UpdateMenu_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );

    GetMenus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadMenus),
            withLatestFrom(this.store.select(selectAll_Menus)),
            switchMap(([action, menus]) =>
            {
                return this.MenuService.GetAll(MenusController.GetMenus).pipe(
                    map((r) =>
                    {
                        this.store.dispatch(SetMenuValidationErrors({ validationErrors: [] }));
                        return LoadMenusSuccess({ payload: r });
                    }),
                    catchError((e) => of(LoadMenusFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                );
            })
        )
    );
    RemoveMenu$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveMenu),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.MenuService.Delete(MenusController.DeleteMenu, action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                        this.store.dispatch(SetMenuValidationErrors({ validationErrors: [] }));
                        return RemoveMenu_Success({ id: action.id });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Menu'));
                        return of(RemoveMenu_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    GetMenuByLocationName$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GetMenuByLocationName),
            switchMap((action) =>
            {
                return this.MenuService.GetMenuByLocationName(action.LocationName).pipe(
                    map((r) =>
                    {
                        return GetMenuByLocationName_Success(r);
                    }),
                    catchError((e) => of(GetMenuByLocationName_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                );
            })
        )
    );
    DeleteMenuItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveMenuItem),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.MenuService.DeleteMenuItem(action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                        return RemoveMenuItem_Success(r.data);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Menu Item'));
                        return of(RemoveMenuItem_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
}