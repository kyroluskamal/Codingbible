import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Post } from "src/models.model";
import { PostState } from "../app.state";
import { AddPOST_Failed, AddPOST_Success, ChangeStatus_Failed, ChangeStatus_Success, dummyAction, GetPostById_Failed, GetPostById_Success, LoadPOSTsSuccess, RemovePOST_Failed, RemovePOST_Success, SetValidationErrors, UpdatePOST_Failed, UpdatePOST_Sucess } from "./post.actions";
import * as adapter from "./post.adapter";

export const initialState: PostState = adapter.PostAdapter.getInitialState({
    ValidationErrors: [],
    CurrentPostById: new Post(),
    CurrentPostBySlug: new Post()
});
// Creating reducer                        
export const PostReducer = createReducer(
    initialState,
    on(AddPOST_Success, (state, post) => adapter.PostAdapter.addOne(post, state)),
    on(AddPOST_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetPostById_Success, (state, post) => 
    {
        return {
            ...state,
            CurrentPostById: post
        };
    }),
    on(GetPostById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdatePOST_Sucess, (state, res) => adapter.PostAdapter.updateOne(res.POST, state)),
    on(RemovePOST_Success, (state, { id }) => adapter.PostAdapter.removeOne(id, state)),
    on(RemovePOST_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(ChangeStatus_Success, (state, res) => adapter.PostAdapter.updateOne(res.POST, { ...state, CurrentPostById: res.currentPostById })),
    on(ChangeStatus_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdatePOST_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadPOSTsSuccess, (state, { payload }) =>
    {
        state = adapter.PostAdapter.removeAll({ ...state });
        return adapter.PostAdapter.addMany(payload, state);
    }),
    on(SetValidationErrors, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(dummyAction, (state) =>
    {
        return {
            ...state,
            initialState
        };
    }),
);

export function prticleReducer(state: any, action: Action)
{
    return PostReducer(state, action);
}


export const selectPostState = createFeatureSelector<PostState>('post');

export const selectPostByID = (id: number) => createSelector(
    selectPostState,
    (state) => state.entities[id]
);
export const selectPostIds = createSelector(selectPostState, adapter.selectPostIds);
export const selectPostEntities = createSelector(selectPostState, adapter.selectPostEntities);
export const selectAllposts = createSelector(selectPostState, adapter.selectAllposts);
export const selectPostsCount = createSelector(selectPostState, adapter.postsCount);
export const select_Post_ValidationErrors = createSelector(
    selectPostState,
    (state) => state.ValidationErrors!
);

