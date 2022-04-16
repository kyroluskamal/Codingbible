import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Attachments } from "src/models.model";

function sortByDate(a: Attachments, b: Attachments): number
{
    if (b.createdDate < a.createdDate)
    {
        return -1;
    } else if (b.createdDate > a.createdDate)
    {
        return 1;
    } else
    {

        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    }
}

export const AttachmentAdapter: EntityAdapter<Attachments> = createEntityAdapter<Attachments>({
    sortComparer: sortByDate
});

export const {
    selectIds: selectAttachment_Ids,
    selectEntities: selectAttachment_Entities,
    selectAll: selectAllAttachments,
    selectTotal: AttachmentsCount
} = AttachmentAdapter.getSelectors(); 