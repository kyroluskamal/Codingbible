import { EntityState } from "@ngrx/entity";
import { ActionReducerMap } from "@ngrx/store";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser, Attachments, Category, Course, CourseCategory, Lesson, Menu, Post, Section, SlugMap_Category, SlugMap_CourseCategory, SlugMap_Courses, SlugMap_Lessons, SlugMap_Posts, SlugMap_Sections } from "src/models.model";
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
    AdditionState: boolean;
    UpdateState: boolean;
    CurrentSelectedLesson: Lesson | null;
}
export interface SectionsState extends EntityState<Section>
{
    ValidationErrors: ModelStateErrors[];
    AdditionState: boolean;
    UpdateState: boolean;
}
export interface SlugMap_Course extends EntityState<SlugMap_Courses> { }
export interface SlugMap_Post extends EntityState<SlugMap_Posts> { }
export interface SlugMap_Categories extends EntityState<SlugMap_Category> { }
export interface SlugMap_CourseCategories extends EntityState<SlugMap_CourseCategory> { }
export interface SlugMap_Section extends EntityState<SlugMap_Sections> { }
export interface SlugMap_Lesson extends EntityState<SlugMap_Lessons> { }
export interface MenuState extends EntityState<Menu>
{
    ValidationErrors: ModelStateErrors[];
}
export interface LangState
{
    isArabic: boolean;
}
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
    menu: MenuReducer
};
