import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Category, Post } from "src/models.model";
import { AuthReducer } from "./AuthState/auth.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { PostReducer } from "./PostState/post.reducer";

export interface AppState 
{
    design: DesignState;
    post: PostState;
    auth: AuthState;
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
export interface CategoryState extends EntityState<Category>
{
    ValidationErrors: ModelStateErrors[];
    CurrentCategoryById: Category;
    CurrentCategoryBySlug: Category;
}


export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer,
    post: PostReducer,
    design: DesignReducer
};
