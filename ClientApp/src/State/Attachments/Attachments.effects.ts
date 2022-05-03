import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of, switchMap, withLatestFrom } from "rxjs";
import { NotificationsService } from "src/CommonServices/notifications.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { Attachments } from "src/models.model";
import { MediaService } from "src/Services/media.service";
import { RemoveCATEGORY_Success } from "../CategoriesState/Category.actions";
import { dummyAction } from "../PostState/post.actions";
import { Add_ATTACHMENT, Add_ATTACHMENT_Success, checkSelectedFile, LoadATTACHMENTSs, LoadATTACHMENTSsSuccess, RemoveATTACHMENTS, RemoveATTACHMENTS_Success, SelectAttachment, UpdateATTACHMENTS, UpdateATTACHMENTS_Sucess } from "./Attachments.actions";
import { selectAllAttachment, SelectSelected_Attachment, SelectTempAttachment } from "./Attachments.reducer";

@Injectable({
    providedIn: 'root'
})
export class AttachmentsEffects
{
    constructor(private actions$: Actions, private MediaService: MediaService,
        private Notification: NotificationsService,
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
            withLatestFrom(this.store.select(SelectSelected_Attachment)),
            exhaustMap(([action, selectedFile]) =>
            {
                return this.MediaService.SendImages(action.files).pipe(
                    map((r) =>
                    {
                        action.tempAttachments.forEach(e =>
                        {
                            let index = r.findIndex(x => x.fileName == e.fileName);
                            let temp: Attachments[] = [];
                            temp.push(r[index]);
                            withLatestFrom(this.store.select(SelectSelected_Attachment));
                            this.store.dispatch(RemoveATTACHMENTS_Success({ id: e.id }));
                            this.store.dispatch(Add_ATTACHMENT_Success({ attachments: temp }));

                            this.store.dispatch(SelectAttachment({ selectedFile: r[index] }));

                        });
                        return dummyAction();
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
                        this.Notification.Success_Swal(NotificationMessage.Success.Update("Data successfully updated"), false);
                        this.store.dispatch(SelectAttachment({ selectedFile: action }));
                        return UpdateATTACHMENTS_Sucess({ attachment: x });
                    }),
                    catchError((e) =>
                    {
                        this.Notification.Error_Swal("Error", sweetAlert.ButtonText.OK, NotificationMessage.Error.Update("Failed to update data"));

                        return of(dummyAction());
                    })
                );
            })
        )
    );
    selectFle = createEffect(() =>
        this.actions$.pipe(
            ofType(SelectAttachment),
            withLatestFrom(this.store.select(SelectSelected_Attachment)),
            switchMap(([action, selectedFile]) =>
            {
                if (action.selectedFile?.fileName != selectedFile?.fileName)
                    return of(checkSelectedFile({ selectedFile: action.selectedFile }));
                else
                    return of(checkSelectedFile({ selectedFile: null }));
            }
            )
        )
    );
}