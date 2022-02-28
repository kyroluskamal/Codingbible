import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { PostState } from "../app.state";
import * as postActions from './post.actions';
import * as adpater from "./post.adapter";
import { ModelStateErrors } from "src/Interfaces/interfaces";

export const initialState: PostState = adpater.PostAdapter.getInitialState({
    ValidationErrors: []
});
// Creating reducer                        
export const PostReducer = createReducer(
    initialState,
    on(postActions.AddPOST_Success, (state, post) => 
    {
        console.log(post);

        return adpater.PostAdapter.addOne(post, state);
    }),
    on(postActions.AddPOST_Failed, (state, res) =>
    {
        console.log(res);

        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(postActions.AddPOSTs, (state, { payload }) => adpater.PostAdapter.addMany(payload.POSTs, state)),
    on(postActions.UpdatePOST, (state, { payload }) => adpater.PostAdapter.updateOne(payload.POST, state)),
    on(postActions.UpdatePOSTs, (state, { payload }) => adpater.PostAdapter.updateMany(payload.POSTs, state)),
    on(postActions.RemovePOST, (state, { payload }) => adpater.PostAdapter.removeOne(payload.id, state)),
    on(postActions.RemovePOSTs, (state, { payload }) => adpater.PostAdapter.removeMany(payload.ids, state)),
    on(postActions.ClearPOSTs, (state) => adpater.PostAdapter.removeAll({ ...state })),
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
    on(postActions.SelectPOST, (state, { payload }) => Object.assign({ ...state, selectedArticleId: payload.POSTId })),
);

export function prticleReducer(state: any, action: Action)
{
    return PostReducer(state, action);
}

// Creating selectors

export const selectPostState = createFeatureSelector<PostState>('post');

export const selectPostIds = createSelector(selectPostState, adpater.selectPostIds);
export const selectPostEntities = createSelector(selectPostState, adpater.selectPostEntities);
export const selectAllposts = createSelector(selectPostState, adpater.selectAllposts);
export const selectPostsCount = createSelector(selectPostState, adpater.postsCount);
export const select_Post_ValidationErrors = createSelector(
    selectPostState,
    (state) => state.ValidationErrors!
);

