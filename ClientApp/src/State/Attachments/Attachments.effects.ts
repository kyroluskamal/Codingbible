import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { Attachments } from "src/models.model";
import { MediaService } from "src/Services/media.service";
import { RemoveCATEGORY_Success } from "../CategoriesState/Category.actions";
import { dummyAction } from "../PostState/post.actions";
import { Add_ATTACHMENT, Add_ATTACHMENT_Success, LoadATTACHMENTSs, LoadATTACHMENTSsSuccess, RemoveATTACHMENTS, SelectAttachment, UpdateATTACHMENTS, UpdateATTACHMENTS_Sucess } from "./Attachments.actions";
import { selectAllAttachment } from "./Attachments.reducer";

@Injectable({
    providedIn: 'root'
})
export class AttachmentsEffects
{
    constructor(private actions$: Actions, private MediaService: MediaService,
        private spinner: SpinnerService, private store: Store) { }

    loadAllAttachmnets = createEffect(() =>
    {
        this.spinner.InsideContainerSpinner();
        return this.actions$.pipe(
            ofType(LoadATTACHMENTSs),
            withLatestFrom(this.store.select(selectAllAttachment)),
            switchMap(([action, attachments]) =>
            {
                return this.MediaService.GetAll().pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        return LoadATTACHMENTSsSuccess({ payload: r });
                    }),
                    catchError((e) => of(dummyAction()))
                );
            }
            )
        );
    });
    AddAttachment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(Add_ATTACHMENT),
            switchMap((action) =>
            {
                return this.MediaService.SendImages(action.files).pipe(
                    map((r) =>
                    {
                        return Add_ATTACHMENT_Success({ attachments: r });
                    }),
                    catchError((e) =>
                    {
                        return of(dummyAction());
                    })
                );
            })
        )
    );
    RemoveAttachment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveATTACHMENTS),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.MediaService.Delete(action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.store.dispatch(SelectAttachment({ selectedFile: null }));
                        return LoadATTACHMENTSs();
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        return of(dummyAction());
                    })
                );
            })
        )
    );
    UpdatePost$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateATTACHMENTS),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.MediaService.UpdateAttactment(action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        let x: Update<Attachments> = {
                            id: action.id,
                            changes: action
                        };
                        return UpdateATTACHMENTS_Sucess({ attachment: x });
                    }),
                    catchError((e) =>
                    {
                        return of(dummyAction());
                    })
                );
            })
        )
    );
}