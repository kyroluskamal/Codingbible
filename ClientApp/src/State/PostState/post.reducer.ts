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
    on(AddPOST_Success, (state, post) =>
    {
        if (post.otherSlug)
        {
            state = adapter.PostAdapter.map(x =>
            {
                let newPost = { ...x };
                if (x.slug === post.otherSlug)
                {
                    newPost.otherSlug = post.slug;
                }
                return newPost;
            }, state);
        }
        return adapter.PostAdapter.addOne(post, state);
    }),
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
    on(UpdatePOST_Sucess, (state, res) =>
    {
        state = adapter.PostAdapter.map((x) =>
        {
            let newPost = { ...x };
            if (res.POST.isArabic)
            {
                if (x.slug.localeCompare(res.POST.otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    newPost.otherSlug = res.POST.slug;
                }
            } else
            {
                if (x.slug === res.POST.otherSlug)
                {
                    newPost.otherSlug = res.POST.slug;
                }
            }
            return newPost;
        }, state);

        return adapter.PostAdapter.upsertOne(res.POST, state);
    }),
    on(RemovePOST_Success, (state, { id, otherSlug }) =>
    {
        let otherPost: Post = new Post();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === otherSlug)
                {
                    otherPost = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherPost = state.entities[key]!;
                }
            }
        }
        let copyOfOtherPost: Post = { ...otherPost };
        copyOfOtherPost.otherSlug = null;
        if (otherPost.id != 0)
        {
            state = adapter.PostAdapter.upsertOne(copyOfOtherPost, state);
            return adapter.PostAdapter.removeOne(id, state);
        } else
            return adapter.PostAdapter.removeOne(id, state);
    }),
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
export const selectPostBySlug = (Slug: string) => createSelector(
    selectPostState,
    (state) =>
    {
        for (let key in state.entities)
        {
            if (state.entities[key]?.slug === Slug)
            {
                return state.entities[key];
            }
        }
        return new Post();
    }
);

