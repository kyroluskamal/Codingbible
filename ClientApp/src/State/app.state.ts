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
import { SlugMap_Category_reducer, SlugMap_CourseCategory_reducer, SlugMap_Courses_reducer, SlugMap_Lessons_reducer, SlugMap_Posts_reducer, SlugMap_Sections_reducer } from "./SlugMap/SlugMap.reducer";

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
    SlugMap_Categories: SlugMap_CategoriesState;
    SlugMap_CourseCategories: SlugMap_CourseCategoriesState;
    SlugMap_Courses: SlugMap_CourseState;
    SlugMap_Lesson: SlugMap_LessonState;
    SlugMap_Post: SlugMap_PostState;
    SlugMap_Section: SlugMap_SectionState;
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
export interface SlugMap_CourseState extends EntityState<SlugMap_Courses>
{
    ValidationErrors: ModelStateErrors[];
}
export interface SlugMap_PostState extends EntityState<SlugMap_Posts>
{
    ValidationErrors: ModelStateErrors[];
}
export interface SlugMap_CategoriesState extends EntityState<SlugMap_Category>
{
    ValidationErrors: ModelStateErrors[];
}
export interface SlugMap_CourseCategoriesState extends EntityState<SlugMap_CourseCategory>
{
    ValidationErrors: ModelStateErrors[];
}
export interface SlugMap_SectionState extends EntityState<SlugMap_Sections>
{
    ValidationErrors: ModelStateErrors[];
}
export interface SlugMap_LessonState extends EntityState<SlugMap_Lessons>
{
    ValidationErrors: ModelStateErrors[];
}
export interface MenuState extends EntityState<Menu>
{
    ValidationErrors: ModelStateErrors[];
    AdditionState: boolean;
    UpdateState: boolean;
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
    menu: MenuReducer,
    SlugMap_Categories: SlugMap_Category_reducer,
    SlugMap_CourseCategories: SlugMap_CourseCategory_reducer,
    SlugMap_Courses: SlugMap_Courses_reducer,
    SlugMap_Lesson: SlugMap_Lessons_reducer,
    SlugMap_Post: SlugMap_Posts_reducer,
    SlugMap_Section: SlugMap_Sections_reducer,
};
