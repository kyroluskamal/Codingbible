import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { Attachments } from "src/models.model";

export const Add_ATTACHMENT = createAction(actionNames.AttactmentActions.ADD_ATTACHMENT,
    props<{ files: File[]; tempAttachments: Attachments[]; }>());
export const Add_ATTACHMENT_Success = createAction(actionNames.AttactmentActions.ADD_ATTACHMENT_Success,
    props<{ attachments: Attachments[]; }>());

export const UpdateATTACHMENTS = createAction(actionNames.AttactmentActions.UPDATE_ATTACHMENT,
    props<Attachments>());
export const UpdateATTACHMENTS_Sucess = createAction(actionNames.AttactmentActions.UPDATE_ATTACHMENT_Success,
    props<{ attachment: Update<Attachments>; }>());
export const RemoveATTACHMENTS = createAction(actionNames.AttactmentActions.REMOVE_ATTACHMENT,
    props<{ id: number; }>());
export const RemoveATTACHMENTS_Success = createAction(actionNames.AttactmentActions.REMOVE_ATTACHMENT_Success,
    props<{ id: number; }>());

export const LoadATTACHMENTSs = createAction(actionNames.AttactmentActions.LOAD_ALL_ATTACHMENTS);
export const LoadATTACHMENTSsSuccess = createAction(actionNames.AttactmentActions.LOAD_ALL_ATTACHMENTS_SUCCESS,
    props<{ payload: Attachments[]; }>());
export const SelectAttachment = createAction(actionNames.AttactmentActions.SelectAttachment,
    props<{ selectedFile: Attachments | null; }>());
export const UpdateTempAttachment = createAction(actionNames.AttactmentActions.UpdateTempAttachment,
    props<{ tempAttachment: Attachments[]; }>());
export const checkSelectedFile = createAction(actionNames.AttactmentActions.checkSelectedFile,
    props<{ selectedFile: Attachments | null; }>());
