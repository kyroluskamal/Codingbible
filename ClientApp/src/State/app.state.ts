import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Post } from "src/models.model";
import { AuthReducer } from "./AuthState/auth.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { PostReducer } from "./PostState/post.reducer";

export interface AppState extends PostStateForModule, DesignStateForModule, AuthStateForModule
{

}
export interface DesignState
{
    pinned: boolean;
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
/********************************************************
 * For importing in modules
 */
export interface DesignStateForModule
{
    design: DesignState;
}
export interface PostStateForModule
{
    post: PostState;
}
export interface AuthStateForModule
{
    auth: AuthState;
}
export const AuthReducers: ActionReducerMap<AuthStateForModule> = {
    auth: AuthReducer,
};
export const PostReducers: ActionReducerMap<PostStateForModule> = {
    post: PostReducer,
};
export const DesignReducers: ActionReducerMap<DesignStateForModule> = {
    design: DesignReducer
};

export const AppReducers: ActionReducerMap<AppState> = {
    ...PostReducers, ...DesignReducers, ...AuthReducers
};
