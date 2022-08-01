import { HttpErrorResponse } from "@angular/common/http";
import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Attachments, Category, Course, CourseCategory, Lesson, Menu, Post, Section } from "src/models.model";
import { AttachmentsReducer } from "./Attachments/Attachments.reducer";
import { AuthReducer } from "./AuthState/auth.reducer";
import { CategoryReducer } from "./CategoriesState/Category.reducer";
import { CourseCategoryReducer } from "./CourseCategoryState/CourseCategory.reducer";
import { CourseReducer } from "./CourseState/course.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { LangReducer } from "./LangState/lang.reducer";
import { LessonsReducer } from "./LessonsState/Lessons.reducer";
import { MenuReducer } from "./Menu/menu.reducer";
import { PostReducer } from "./PostState/post.reducer";
import { SectionsReducer } from "./SectionsState/sections.reducer";

export interface AppState 
{
    design: DesignState;
    post: PostState;
    auth: AuthState;
    category: CategoryState;
    attachment: AttachmentsState;
    course: CourseState;
    courseCategory: CourseCategoryState;
    lessons: LessonsState;
    sections: SectionsState;
    lang: LangState;
    menu: MenuState;
}
export interface DesignState
{
    pinned: boolean;
}
export interface AuthState extends ValidationErrors
{
    user: ApplicationUser | null;
    loginError: string | null;
    roles: string[];
    InProgress: boolean;
    isLoggedIn: boolean;
    refershTokenExpire: string;
    isLoggedInChecked: boolean;
}

export interface PostState extends EntityState<Post>, ValidationErrors
{
    CurrentPostById: Post;
    CurrentPostBySlug: Post;
}
export interface CategoryState extends EntityState<Category>, ValidationErrors
{
    CurrentCategoryById: Category;
    CurrentCategoryBySlug: Category;
}
export interface AttachmentsState extends EntityState<Attachments>, ValidationErrors
{
    SelectedFile: Attachments | null;
    tempAttachments: Attachments[];
}
export interface CourseState extends EntityState<Course>, ValidationErrors
{
    error: HttpErrorResponse | null;
}
export interface CourseCategoryState extends EntityState<CourseCategory>, ValidationErrors
{
    error: HttpErrorResponse | null;
}
export interface CourseSectionsState extends EntityState<Section>, ValidationErrors
{
}
export interface LessonsState extends EntityState<Lesson>, ValidationErrors, AdditionUpdate
{
    CurrentSelectedLesson: Lesson | null;
}
export interface SectionsState extends EntityState<Section>, ValidationErrors, AdditionUpdate
{
}
export interface MenuState extends EntityState<Menu>, ValidationErrors, AdditionUpdate { }

export interface LangState
{
    isArabic: boolean;
}
interface ValidationErrors { ValidationErrors: ModelStateErrors[]; }
interface AdditionUpdate { AdditionState: boolean; UpdateState: boolean; }

export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer,
    post: PostReducer,
    design: DesignReducer,
    category: CategoryReducer,
    attachment: AttachmentsReducer,
    course: CourseReducer,
    courseCategory: CourseCategoryReducer,
    lessons: LessonsReducer,
    sections: SectionsReducer,
    lang: LangReducer,
    menu: MenuReducer,
};
