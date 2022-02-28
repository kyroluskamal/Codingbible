import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Post } from "src/models.model";

export const PostAdapter: EntityAdapter<Post> = createEntityAdapter<Post>({
    sortComparer: false
});

export const {
    selectIds: selectPostIds,
    selectEntities: selectPostEntities,
    selectAll: selectAllposts,
    selectTotal: postsCount
} = PostAdapter.getSelectors(); 