import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import
{
    SlugMap_Category, SlugMap_CourseCategory,
    SlugMap_Courses, SlugMap_Lessons, SlugMap_Posts, SlugMap_Sections
} from "src/models.model";

export const Get_SlugMap_Categories_By_Slug = createAction(actionNames.SlugMap.Get_SlugMap_Categories_By_Slug,
    props<{ slug: string; }>());
export const Get_SlugMap_CourseCategories_By_Slug = createAction(actionNames.SlugMap.Get_SlugMap_CourseCategories_By_Slug,
    props<{ slug: string; }>());
export const Get_SlugMap_Courses_By_Slug = createAction(actionNames.SlugMap.Get_SlugMap_Courses_By_Slug,
    props<{ slug: string; }>());
export const Get_SlugMap_Lessons_By_Slug = createAction(actionNames.SlugMap.Get_SlugMap_Lessons_By_Slug,
    props<{ slug: string; }>());
export const Get_SlugMap_Posts_By_Slug = createAction(actionNames.SlugMap.Get_SlugMap_Posts_By_Slug,
    props<{ slug: string; }>());
export const Get_SlugMap_Sections_By_Slug = createAction(actionNames.SlugMap.Get_SlugMap_Sections_By_Slug,
    props<{ slug: string; }>());

export const Get_SlugMap_Categories_By_Slug_Failed = createAction(actionNames.SlugMap.Get_SlugMap_Categories_By_Slug_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_SlugMap_CourseCategories_By_Slug_Failed = createAction(actionNames.SlugMap.Get_SlugMap_CourseCategories_By_Slug_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_SlugMap_Courses_By_Slug_Failed = createAction(actionNames.SlugMap.Get_SlugMap_Courses_By_Slug_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_SlugMap_Lessons_By_Slug_Failed = createAction(actionNames.SlugMap.Get_SlugMap_Lessons_By_Slug_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_SlugMap_Posts_By_Slug_Failed = createAction(actionNames.SlugMap.Get_SlugMap_Posts_By_Slug_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_SlugMap_Sections_By_Slug_Failed = createAction(actionNames.SlugMap.Get_SlugMap_Sections_By_Slug_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());

export const Get_SlugMap_Categories_By_Slug_Success = createAction(actionNames.SlugMap.Get_SlugMap_Categories_By_Slug_Success,
    props<SlugMap_Category>());
export const Get_SlugMap_CourseCategories_By_Slug_Success = createAction(actionNames.SlugMap.Get_SlugMap_CourseCategories_By_Slug_Success,
    props<SlugMap_CourseCategory>());
export const Get_SlugMap_Courses_By_Slug_Success = createAction(actionNames.SlugMap.Get_SlugMap_Courses_By_Slug_Success,
    props<SlugMap_Courses>());
export const Get_SlugMap_Lessons_By_Slug_Success = createAction(actionNames.SlugMap.Get_SlugMap_Lessons_By_Slug_Success,
    props<SlugMap_Lessons>());
export const Get_SlugMap_Posts_By_Slug_Success = createAction(actionNames.SlugMap.Get_SlugMap_Posts_By_Slug_Success,
    props<SlugMap_Posts>());
export const Get_SlugMap_Sections_By_Slug_Success = createAction(actionNames.SlugMap.Get_SlugMap_Sections_By_Slug_Success,
    props<SlugMap_Sections>());

export const Get_All_SlugMap_Courses = createAction(actionNames.SlugMap.Get_All_SlugMap_Courses);
export const Get_All_SlugMap_Sections = createAction(actionNames.SlugMap.Get_All_SlugMap_Sections);
export const Get_All_SlugMap_Lessons = createAction(actionNames.SlugMap.Get_All_SlugMap_Lessons);
export const Get_All_SlugMap_Categories = createAction(actionNames.SlugMap.Get_All_SlugMap_Categories);
export const Get_All_SlugMap_CourseCategories = createAction(actionNames.SlugMap.Get_All_SlugMap_CourseCategories);
export const Get_All_SlugMap_Posts = createAction(actionNames.SlugMap.Get_All_SlugMap_Posts);

export const Get_All_SlugMap_Courses_Failed = createAction(actionNames.SlugMap.Get_All_SlugMap_Courses_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_All_SlugMap_Sections_Failed = createAction(actionNames.SlugMap.Get_All_SlugMap_Sections_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_All_SlugMap_Lessons_Failed = createAction(actionNames.SlugMap.Get_All_SlugMap_Lessons_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_All_SlugMap_Categories_Failed = createAction(actionNames.SlugMap.Get_All_SlugMap_Categories_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_All_SlugMap_CourseCategories_Failed = createAction(actionNames.SlugMap.Get_All_SlugMap_CourseCategories_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const Get_All_SlugMap_Posts_Failed = createAction(actionNames.SlugMap.Get_All_SlugMap_Posts_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());

export const Get_All_SlugMap_Courses_Success = createAction(actionNames.SlugMap.Get_All_SlugMap_Courses_Success,
    props<{ payload: SlugMap_Courses[]; }>());
export const Get_All_SlugMap_Sections_Success = createAction(actionNames.SlugMap.Get_All_SlugMap_Sections_Success,
    props<{ payload: SlugMap_Sections[]; }>());
export const Get_All_SlugMap_Lessons_Success = createAction(actionNames.SlugMap.Get_All_SlugMap_Lessons_Success,
    props<{ payload: SlugMap_Lessons[]; }>());
export const Get_All_SlugMap_Categories_Success = createAction(actionNames.SlugMap.Get_All_SlugMap_Categories_Success,
    props<{ payload: SlugMap_Category[]; }>());
export const Get_All_SlugMap_CourseCategories_Success = createAction(actionNames.SlugMap.Get_All_SlugMap_CourseCategories_Success,
    props<{ payload: SlugMap_CourseCategory[]; }>());
export const Get_All_SlugMap_Posts_Success = createAction(actionNames.SlugMap.Get_All_SlugMap_Posts_Success,
    props<{ payload: SlugMap_Posts[]; }>());