import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Lesson } from "src/models.model";

export const dummyAction = createAction("Dont call server");
export const AddLesson = createAction(actionNames.LessonActions.ADD_Lesson,
    props<Lesson>());
export const AddLesson_Success = createAction(actionNames.LessonActions.ADD_Lesson_Success,
    props<Lesson>());
export const AddLesson_Failed = createAction(actionNames.LessonActions.ADD_Lesson_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const ChangeStatus = createAction(actionNames.LessonActions.ChangeStatus,
    props<Lesson>());
export const ChangeStatus_Success = createAction(actionNames.LessonActions.ChangeStatus_Success,
    props<{ Lesson: Update<Lesson>; }>());
export const ChangeStatus_Failed = createAction(actionNames.LessonActions.ChangeStatus_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetLessonById = createAction(actionNames.LessonActions.GetLessonById,
    props<{ id: number; }>());
export const GetLessonById_Success = createAction(actionNames.LessonActions.GetLessonById_Success,
    props<Lesson>());
export const GetLessonById_Failed = createAction(actionNames.LessonActions.GetLessonById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetLessonsByCourseId = createAction(actionNames.LessonActions.GetLessonsByCourseId,
    props<{ courseId: number; sectionId: number; }>());
export const GetLessonsByCourseId_Success = createAction(actionNames.LessonActions.GetLessonsByCourseId_Success,
    props<{ payload: Lesson[]; }>());
export const GetLessonsByCourseId_Failed = createAction(actionNames.LessonActions.GetLessonsByCourseId_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateLesson = createAction(actionNames.LessonActions.UPDATE_Lesson,
    props<Lesson>());
export const UpdateLesson_Sucess = createAction(actionNames.LessonActions.UPDATE_Lesson_Success,
    props<{ Lesson: Update<Lesson>; }>());
export const UpdateLesson_Failed = createAction(actionNames.LessonActions.UPDATE_Lesson_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveLesson = createAction(actionNames.LessonActions.REMOVE_Lesson,
    props<{ id: number; url: string; }>());
export const RemoveLesson_Success = createAction(actionNames.LessonActions.REMOVE_Lesson_Success,
    props<{ id: number; }>());
export const RemoveLesson_Failed = createAction(actionNames.LessonActions.REMOVE_Lesson_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadLessons = createAction(actionNames.LessonActions.LOAD_ALL_Lessons);
export const LoadLessonsSuccess = createAction(actionNames.LessonActions.LOAD_ALL_Lessons_SUCCESS,
    props<{ payload: Lesson[]; }>());
export const SetValidationErrors = createAction(actionNames.LessonActions.Set_ValidationErrors,
    props<{ validationErrors: ModelStateErrors[]; }>());
export const SetCurrentSelectedLesson = createAction(actionNames.LessonActions.SetCurrentSelectedLesson,
    props<Lesson>());
export const LoadLessonsFail = createAction(actionNames.LessonActions.LOAD_ALL_Lessons_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LessonAdditionIsComplete = createAction(actionNames.LessonActions.AdditionIsCompleted,
    props<{ status: boolean; }>());
export const LessonUpdateIsCompleted = createAction(actionNames.LessonActions.UpdateIsCompleted,
    props<{ status: boolean; }>());