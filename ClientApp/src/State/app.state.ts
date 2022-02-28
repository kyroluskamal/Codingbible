import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Post } from "src/models.model";
import { AuthReducer } from "./AuthState/auth.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { PostReducer } from "./PostState/post.reducer";

export interface AppState
{
    auth: AuthState;
    post: PostState;
    design: DesignState;
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
}
export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer,
    post: PostReducer,
    design: DesignReducer
};