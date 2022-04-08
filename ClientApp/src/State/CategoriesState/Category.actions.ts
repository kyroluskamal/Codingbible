import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Category } from "src/models.model";

export const AddCATEGORY = createAction(actionNames.categoryActions.ADD_CATEGORY,
    props<Category>());
export const AddCATEGORY_Success = createAction(actionNames.categoryActions.ADD_CATEGORY_Success,
    props<Category>());
export const AddCATEGORY_Failed = createAction(actionNames.categoryActions.ADD_CATEGORY_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());

export const GetCategoryById = createAction(actionNames.categoryActions.GetCategoryById,
    props<{ id: number; }>());
export const GetCategoryById_Success = createAction(actionNames.categoryActions.GetCategoryById_Success,
    props<Category>());
export const GetCategoryById_Failed = createAction(actionNames.categoryActions.GetCategoryById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateCATEGORY = createAction(actionNames.categoryActions.UPDATE_CATEGORY,
    props<Category>());
export const UpdateCATEGORY_Sucess = createAction(actionNames.categoryActions.UPDATE_CATEGORY_Success,
    props<{ CATEGORY: Update<Category>; }>());
export const UpdateCATEGORY_Failed = createAction(actionNames.categoryActions.UPDATE_CATEGORY_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveCATEGORY = createAction(actionNames.categoryActions.REMOVE_CATEGORY,
    props<{ id: number; url: string; }>());
export const RemoveCATEGORY_Success = createAction(actionNames.categoryActions.REMOVE_CATEGORY_Success,
    props<{ id: number; }>());
export const RemoveCATEGORY_Failed = createAction(actionNames.categoryActions.REMOVE_CATEGORY_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadCATEGORYs = createAction(actionNames.categoryActions.LOAD_ALL_CATEGORIES);
export const LoadCATEGORYsSuccess = createAction(actionNames.categoryActions.LOAD_ALL_CATEGORIES_SUCCESS,
    props<{ payload: Category[]; }>());
export const LoadCATEGORYsFail = createAction(actionNames.categoryActions.LOAD_ALL_CATEGORIES_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());