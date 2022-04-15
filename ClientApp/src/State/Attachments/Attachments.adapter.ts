import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Attachments } from "src/models.model";

export const AttachmentAdapter: EntityAdapter<Attachments> = createEntityAdapter<Attachments>({
    sortComparer: false
});

export const {
    selectIds: selectAttachment_Ids,
    selectEntities: selectAttachment_Entities,
    selectAll: selectAllAttachments,
    selectTotal: AttachmentsCount
} = AttachmentAdapter.getSelectors(); 