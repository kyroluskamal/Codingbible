import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Attachments, Category, Course, CourseCategory, Lesson, Post, Section } from "src/models.model";
import { AttachmentsReducer } from "./Attachments/Attachments.reducer";
import { AuthReducer } from "./AuthState/auth.reducer";
import { CategoryReducer } from "./CategoriesState/Category.reducer";
import { CourseCategoryReducer } from "./CourseCategoryState/CourseCategory.reducer";
import { CourseSectionsReducer } from "./CourseSectionsState/CourseSections.reducer";
import { CourseReducer } from "./CourseState/course.reducer";
import { DesignReducer } from "./DesignState/design.reducer";
import { LessonsReducer } from "./LessonsState/Lessons.reducer";
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
    courseSections: CourseSectionsState;
    lessons: LessonsState;
    sections: SectionsState;
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
    ValidationErrors: ModelStateErrors[];
    SelectedFile: Attachments | null;
    tempAttachments: Attachments[];
}
export interface CourseState extends EntityState<Course>
{
    ValidationErrors: ModelStateErrors[];
}
export interface CourseCategoryState extends EntityState<CourseCategory>
{
    ValidationErrors: ModelStateErrors[];
}
export interface CourseSectionsState extends EntityState<Section>
{
    ValidationErrors: ModelStateErrors[];
}
export interface LessonsState extends EntityState<Lesson>
{
    ValidationErrors: ModelStateErrors[];
}
export interface SectionsState extends EntityState<Section>
{
    ValidationErrors: ModelStateErrors[];
}

export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer,
    post: PostReducer,
    design: DesignReducer,
    category: CategoryReducer,
    attachment: AttachmentsReducer,
    course: CourseReducer,
    courseCategory: CourseCategoryReducer,
    courseSections: CourseSectionsReducer,
    lessons: LessonsReducer,
    sections: SectionsReducer
};
