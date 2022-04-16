import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { AttachmentsState } from "../app.state";
import { Add_ATTACHMENT_Success, checkSelectedFile, LoadATTACHMENTSsSuccess, RemoveATTACHMENTS_Success, SelectAttachment, UpdateATTACHMENTS_Sucess, UpdateTempAttachment } from "./Attachments.actions";
import { AttachmentAdapter, AttachmentsCount, selectAllAttachments, selectAttachment_Entities, selectAttachment_Ids } from "./Attachments.adapter";

export const initialState: AttachmentsState = AttachmentAdapter.getInitialState({
    SelectedFile: null,
    tempAttachments: [],
});

export const AttachmentsReducer = createReducer(
    initialState,
    on(Add_ATTACHMENT_Success, (state, res) => AttachmentAdapter.addMany(res.attachments, state)),
    on(UpdateATTACHMENTS_Sucess, (state, res) => AttachmentAdapter.updateOne(res.attachment, state)),
    on(RemoveATTACHMENTS_Success, (state, { id }) => AttachmentAdapter.removeOne(id, state)),
    on(LoadATTACHMENTSsSuccess, (state, { payload }) =>
    {
        state = AttachmentAdapter.removeAll({ ...state });
        return AttachmentAdapter.addMany(payload, state);
    }),
    on(checkSelectedFile, (state, res) =>
    {
        return {
            ...state,
            SelectedFile: res.selectedFile
        };
    }),
    on(UpdateTempAttachment, (state, res) => AttachmentAdapter.addMany(res.tempAttachment, state)),
);
export const selectAttachmentState = createFeatureSelector<AttachmentsState>('attachment');

export const SelectSelected_Attachment = createSelector(
    selectAttachmentState,
    (state) => state.SelectedFile
);
export const SelectTempAttachment = createSelector(
    selectAttachmentState,
    (state) => state.tempAttachments
);
export const selectAttachmentIds = createSelector(selectAttachmentState, selectAttachment_Ids);
export const selectAttachmentEntities = createSelector(selectAttachmentState, selectAttachment_Entities);
export const selectAllAttachment = createSelector(selectAttachmentState, selectAllAttachments);
export const selectAttachmentsCount = createSelector(selectAttachmentState, AttachmentsCount);
