import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { CourseCategory } from "src/models.model";

export const dummyAction = createAction("Dont call server");
export const AddCourseCategory = createAction(actionNames.CourseCategoryActions.ADD_COURSECATEGORY,
    props<CourseCategory>());
export const AddCourseCategory_Success = createAction(actionNames.CourseCategoryActions.ADD_COURSECATEGORY_Success,
    props<CourseCategory>());
export const AddCourseCategory_Failed = createAction(actionNames.CourseCategoryActions.ADD_COURSECATEGORY_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetCourseCategoryById = createAction(actionNames.CourseCategoryActions.GetCourseCategoryById,
    props<{ id: number; }>());
export const GetCourseCategoryById_Success = createAction(actionNames.CourseCategoryActions.GetCourseCategoryById_Success,
    props<CourseCategory>());
export const GetCourseCategoryById_Failed = createAction(actionNames.CourseCategoryActions.GetCourseCategoryById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateCourseCategory = createAction(actionNames.CourseCategoryActions.UPDATE_COURSECATEGORY,
    props<CourseCategory>());
export const UpdateCourseCategory_Sucess = createAction(actionNames.CourseCategoryActions.UPDATE_COURSECATEGORY_Success,
    props<{ CourseCategory: Update<CourseCategory>; }>());
export const UpdateCourseCategory_Failed = createAction(actionNames.CourseCategoryActions.UPDATE_COURSECATEGORY_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveCourseCategory = createAction(actionNames.CourseCategoryActions.REMOVE_COURSECATEGORY,
    props<{ id: number; url: string; }>());
export const RemoveCourseCategory_Success = createAction(actionNames.CourseCategoryActions.REMOVE_COURSECATEGORY_Success,
    props<{ id: number; }>());
export const RemoveCourseCategory_Failed = createAction(actionNames.CourseCategoryActions.REMOVE_COURSECATEGORY_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadCourseCategorys = createAction(actionNames.CourseCategoryActions.LOAD_ALL_COURSECATEGORIES);
export const LoadCourseCategorysSuccess = createAction(actionNames.CourseCategoryActions.LOAD_ALL_COURSECATEGORIES_SUCCESS,
    props<{ payload: CourseCategory[]; }>());
export const SetValidationErrors = createAction(actionNames.CourseCategoryActions.Set_ValidationErrors,
    props<{ validationErrors: ModelStateErrors[]; }>());
export const LoadCourseCategorysFail = createAction(actionNames.CourseCategoryActions.LOAD_ALL_COURSECATEGORIES_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());