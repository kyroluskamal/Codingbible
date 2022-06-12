import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Menu } from "src/models.model";

export const AddMenu = createAction(actionNames.MenuActions.ADD_Menu,
    props<Menu>());
export const AddMenu_Success = createAction(actionNames.MenuActions.ADD_Menu_Success,
    props<Menu>());
export const AddMenu_Failed = createAction(actionNames.MenuActions.ADD_Menu_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetMenuById = createAction(actionNames.MenuActions.GetMenuById,
    props<{ id: number; }>());
export const GetMenuById_Success = createAction(actionNames.MenuActions.GetMenuById_Success,
    props<Menu>());
export const GetMenuById_Failed = createAction(actionNames.MenuActions.GetMenuById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetMenuByLocationName = createAction(actionNames.MenuActions.GetMenuByLocationName,
    props<{ LocationName: string; }>());
export const GetMenuByLocationName_Success = createAction(actionNames.MenuActions.GetMenuByLocationName_Success,
    props<Menu>());
export const GetMenuByLocationName_Failed = createAction(actionNames.MenuActions.GetMenuByLocationName_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdateMenu = createAction(actionNames.MenuActions.UPDATE_Menu,
    props<Menu>());
export const UpdateMenu_Sucess = createAction(actionNames.MenuActions.UPDATE_Menu_Success,
    props<{ Menu: Menu; }>());
export const UpdateMenu_Failed = createAction(actionNames.MenuActions.UPDATE_Menu_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveMenu = createAction(actionNames.MenuActions.REMOVE_Menu,
    props<{ id: number; }>());
export const RemoveMenu_Success = createAction(actionNames.MenuActions.REMOVE_Menu_Success,
    props<{ id: number; }>());
export const RemoveMenu_Failed = createAction(actionNames.MenuActions.REMOVE_Menu_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemoveMenuItem = createAction(actionNames.MenuActions.RemoveMenuItem,
    props<{ id: number; }>());
export const RemoveMenuItem_Success = createAction(actionNames.MenuActions.RemoveMenuItem_Success,
    props<Menu>());
export const RemoveMenuItem_Failed = createAction(actionNames.MenuActions.RemoveMenuItem_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadMenus = createAction(actionNames.MenuActions.LOAD_ALL_Menus);
export const LoadMenusSuccess = createAction(actionNames.MenuActions.LOAD_ALL_Menus_SUCCESS,
    props<{ payload: Menu[]; }>());
export const LoadMenusFail = createAction(actionNames.MenuActions.LOAD_ALL_Menus_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const SetMenuValidationErrors = createAction(actionNames.MenuActions.Set_ValidationErrors,
    props<{ validationErrors: ModelStateErrors[]; }>());