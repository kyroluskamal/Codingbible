import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Course } from "src/models.model";

export const dummyAction = createAction("Dont call server");
export const AddCourse = createAction(actionNames.CourseActions.ADD_COURSE,
    props<Course>());
export const AddCourse_Success = createAction(actionNames.CourseActions.ADD_COURSE_Success,
    props<Course>());
export const AddCourse_Failed = createAction(actionNames.CourseActions.ADD_COURSE_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const ChangeStatus = createAction(actionNames.CourseActions.ChangeStatus,
    props<Course>());
export const ChangeStatus_Success = createAction(actionNames.CourseActions.ChangeStatus_Success,
    props<{ Course: Update<Course>; currentCourseById: Course; }>());
export const ChangeStatus_Failed = createAction(actionNames.CourseActions.ChangeStatus_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetCourseById = createAction(actionNames.CourseActions.GetCourseById,
    props<{ id: number; }>());
export const GetCourseById_Success = createAction(actionNames.CourseActions.GetCourseById_Success,
    props<Course>());
export const GetCourseById_Failed = createAction(actionNames.CourseActions.GetCourseById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateCourse = createAction(actionNames.CourseActions.UPDATE_COURSE,
    props<Course>());
export const UpdateCourse_Sucess = createAction(actionNames.CourseActions.UPDATE_COURSE_Success,
    props<{ Course: Update<Course>; }>());
export const UpdateCourse_Failed = createAction(actionNames.CourseActions.UPDATE_COURSE_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveCourse = createAction(actionNames.CourseActions.REMOVE_COURSE,
    props<{ id: number; url: string; }>());
export const RemoveCourse_Success = createAction(actionNames.CourseActions.REMOVE_COURSE_Success,
    props<{ id: number; }>());
export const RemoveCourse_Failed = createAction(actionNames.CourseActions.REMOVE_COURSE_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadCourses = createAction(actionNames.CourseActions.LOAD_ALL_COURSES);
export const LoadCoursesSuccess = createAction(actionNames.CourseActions.LOAD_ALL_COURSES_SUCCESS,
    props<{ payload: Course[]; }>());
export const SetValidationErrors = createAction(actionNames.CourseActions.Set_ValidationErrors,
    props<{ validationErrors: ModelStateErrors[]; }>());
export const LoadCoursesFail = createAction(actionNames.CourseActions.LOAD_ALL_COURSES_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());