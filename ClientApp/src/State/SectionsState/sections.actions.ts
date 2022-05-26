import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Section } from "src/models.model";

export const dummyAction = createAction("Dont call server");
export const AddSection = createAction(actionNames.SectionActions.ADD_Section,
    props<Section>());
export const AddSection_Success = createAction(actionNames.SectionActions.ADD_Section_Success,
    props<Section>());
export const AddSection_Failed = createAction(actionNames.SectionActions.ADD_Section_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetSectionById = createAction(actionNames.SectionActions.GetSectionById,
    props<{ id: number; }>());
export const GetSectionById_Success = createAction(actionNames.SectionActions.GetSectionById_Success,
    props<Section>());
export const GetSectionById_Failed = createAction(actionNames.SectionActions.GetSectionById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const ChangeStatus = createAction(actionNames.SectionActions.ChangeStatus,
    props<Section>());
export const ChangeStatus_Success = createAction(actionNames.SectionActions.ChangeStatus_Success,
    props<{ Course: Update<Section>; }>());
export const ChangeStatus_Failed = createAction(actionNames.SectionActions.ChangeStatus_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateSection = createAction(actionNames.SectionActions.UPDATE_Section,
    props<Section>());
export const UpdateSection_Sucess = createAction(actionNames.SectionActions.UPDATE_Section_Success,
    props<{ Section: Update<Section>; }>());
export const UpdateSection_Failed = createAction(actionNames.SectionActions.UPDATE_Section_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveSection = createAction(actionNames.SectionActions.REMOVE_Section,
    props<{ id: number; url: string; }>());
export const RemoveSection_Success = createAction(actionNames.SectionActions.REMOVE_Section_Success,
    props<{ id: number; }>());
export const RemoveSection_Failed = createAction(actionNames.SectionActions.REMOVE_Section_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadSections = createAction(actionNames.SectionActions.LOAD_ALL_Sections);
export const LoadSectionsSuccess = createAction(actionNames.SectionActions.LOAD_ALL_Sections_SUCCESS,
    props<{ payload: Section[]; }>());
export const SetValidationErrors = createAction(actionNames.SectionActions.Set_ValidationErrors,
    props<{ validationErrors: ModelStateErrors[]; }>());
export const LoadSectionsFail = createAction(actionNames.SectionActions.LOAD_ALL_Sections_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());