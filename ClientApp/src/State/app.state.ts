import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { EntityState } from "@ngrx/entity";
import { ActionReducerMap, createFeatureSelector, createSelector } from "@ngrx/store";
import { CookieNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Post } from "src/models.model";
import { AuthReducer, GetCookie } from "./AuthState/auth.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { postsCount, selectAllposts, selectPostEntities, selectPostIds } from "./PostState/post.adapter";
import { PostReducer } from "./PostState/post.reducer";

export interface AppState extends PostStateForHome
{
    design: DesignState;
}
export interface DesignState
{
    pinned: boolean;
}
export interface PostStateForHome
{
    post: PostState;
    auth: AuthState;
}

export interface AuthState
{
    user: ApplicationUser | null;
    loginError: string | null;
    roles: string[];
    InProgress: boolean;
    ValidationErrors: ModelStateErrors[];
    isLoggedIn: boolean;
    refershTokenExpire: string;
    isLoggedInChecked: boolean;
}

export interface PostState extends EntityState<Post>
{
    ValidationErrors: ModelStateErrors[];
    CurrentPostById: Post;
    CurrentPostBySlug: Post;
}

export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer,
    post: PostReducer,
    design: DesignReducer
};
export const PostReducers: ActionReducerMap<PostStateForHome> = {
    post: PostReducer,
    auth: AuthReducer,
};
