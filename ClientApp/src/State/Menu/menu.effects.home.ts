import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from 'rxjs';
import { MenuService } from "src/Services/menu.service";
import
    {
        GetMenuByLocationName, GetMenuByLocationName_Failed,
        GetMenuByLocationName_Success
    } from "./menu.actions";

@Injectable({
    providedIn: 'root'
})
export class MenuEffectHome
{
    constructor(private Actions$: Actions,
        private menuService: MenuService,
    )
    {
    }
    GetMenuByLocationName$ = createEffect(() =>
        this.Actions$.pipe(
            ofType(GetMenuByLocationName),
            switchMap((action) =>
            {
                return this.menuService.GetMenuByLocationName(action.LocationName).pipe(
                    map((r) =>
                    {
                        return GetMenuByLocationName_Success(r);
                    }),
                    catchError((e) => of(GetMenuByLocationName_Failed({ error: e, validationErrors: [] })))
                );
            })
        )
    );
}