import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Section } from "src/models.model";

export const dummyAction = createAction("Dont call server");
export const AddCourseSections = createAction(actionNames.CourseSectionsActions.ADD_CourseSections,
    props<Section>());
export const AddCourseSections_Success = createAction(actionNames.CourseSectionsActions.ADD_CourseSections_Success,
    props<Section>());
export const AddCourseSections_Failed = createAction(actionNames.CourseSectionsActions.ADD_CourseSections_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetCourseSectionsById = createAction(actionNames.CourseSectionsActions.GetCourseSectionById,
    props<{ id: number; }>());
export const GetCourseSectionsById_Success = createAction(actionNames.CourseSectionsActions.GetCourseSectionById_Success,
    props<Section>());
export const GetCourseSectionsById_Failed = createAction(actionNames.CourseSectionsActions.GetCourseSectionById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateCourseSections = createAction(actionNames.CourseSectionsActions.UPDATE_CourseSections,
    props<Section>());
export const UpdateCourseSections_Sucess = createAction(actionNames.CourseSectionsActions.UPDATE_CourseSections_Success,
    props<{ CourseSections: Update<Section>; }>());
export const UpdateCourseSections_Failed = createAction(actionNames.CourseSectionsActions.UPDATE_CourseSections_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveCourseSections = createAction(actionNames.CourseSectionsActions.REMOVE_CourseSections,
    props<{ id: number; url: string; }>());
export const RemoveCourseSections_Success = createAction(actionNames.CourseSectionsActions.REMOVE_CourseSections_Success,
    props<{ id: number; }>());
export const RemoveCourseSections_Failed = createAction(actionNames.CourseSectionsActions.REMOVE_CourseSections_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadCourseSectionss = createAction(actionNames.CourseSectionsActions.LOAD_ALL_CourseSections);
export const LoadCourseSectionssSuccess = createAction(actionNames.CourseSectionsActions.LOAD_ALL_CourseSections_SUCCESS,
    props<{ payload: Section[]; }>());
export const SetValidationErrors = createAction(actionNames.CourseSectionsActions.Set_ValidationErrors,
    props<{ validationErrors: ModelStateErrors[]; }>());
export const LoadCourseSectionssFail = createAction(actionNames.CourseSectionsActions.LOAD_ALL_CourseSections_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());