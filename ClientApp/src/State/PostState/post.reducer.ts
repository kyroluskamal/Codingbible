import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Post } from "src/models.model";
import { PostState } from "../app.state";
import * as postActions from './post.actions';
import * as adpater from "./post.adapter";

export const initialState: PostState = adpater.PostAdapter.getInitialState({
    ValidationErrors: [],
    CurrentPostById: new Post(),
    CurrentPostBySlug: new Post()
});
// Creating reducer                        
export const PostReducer = createReducer(
    initialState,
    on(postActions.AddPOST_Success, (state, post) => adpater.PostAdapter.addOne(post, state)),
    on(postActions.AddPOST_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(postActions.GetPostById_Success, (state, post) => 
    {
        return {
            ...state,
            CurrentPostById: post
        };
    }),
    on(postActions.GetPostById_Failed, (state, res) =>
    {
        console.log(res);

        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(postActions.UpdatePOST_Sucess, (state, res) => adpater.PostAdapter.updateOne(res.POST, state)),
    on(postActions.RemovePOST_Success, (state, { id }) => adpater.PostAdapter.removeOne(id, state)),
    on(postActions.RemovePOST_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(postActions.UpdatePOST_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(postActions.LoadPOSTsSuccess, (state, { payload }) =>
    {
        state = adpater.PostAdapter.removeAll({ ...state });
        return adpater.PostAdapter.addMany(payload, state);
    }),
    on(postActions.dummyAction, (state) =>
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

// Creating selectors

export const selectPostState = createFeatureSelector<PostState>('post');

export const selectPostByID = createSelector(
    selectPostState,
    (state) => state.CurrentPostById
);
export const selectPostIds = createSelector(selectPostState, adpater.selectPostIds);
export const selectPostEntities = createSelector(selectPostState, adpater.selectPostEntities);
export const selectAllposts = createSelector(selectPostState, adpater.selectAllposts);
export const selectPostsCount = createSelector(selectPostState, adpater.postsCount);
export const select_Post_ValidationErrors = createSelector(
    selectPostState,
    (state) => state.ValidationErrors!
);

