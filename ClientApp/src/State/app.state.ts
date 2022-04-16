import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Attachments, Category, Post } from "src/models.model";
import { AttachmentsReducer } from "./Attachments/Attachments.reducer";
import { AuthReducer } from "./AuthState/auth.reducer";
import { CategoryReducer } from "./CategoriesState/Category.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { PostReducer } from "./PostState/post.reducer";

export interface AppState 
{
    design: DesignState;
    post: PostState;
    auth: AuthState;
    category: CategoryState;
    attachment: AttachmentsState;
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
export interface AttachmentsState extends EntityState<Attachments>
{
    SelectedFile: Attachments | null;
    tempAttachments: Attachments[];
}


export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer,
    post: PostReducer,
    design: DesignReducer,
    category: CategoryReducer,
    attachment: AttachmentsReducer
};
