import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { MenuState } from "../app.state";
import { dummyAction } from "../PostState/post.actions";
import { AddMenu_Failed, AddMenu_Success, GetMenuById_Failed, GetMenuById_Success, GetMenuByLocationName_Failed, GetMenuByLocationName_Success, LoadMenusSuccess, RemoveMenuItem, RemoveMenuItem_Failed, RemoveMenuItem_Success, RemoveMenu_Failed, RemoveMenu_Success, SetMenuValidationErrors, UpdateMenu_Failed, UpdateMenu_Sucess } from "./menu.actions";
import { MenuAdapter, MenusCount, selectAllMenus, selectMenu_Entities, selectMenu_Ids } from "./menu.adapter";

export const initialState: MenuState = MenuAdapter.getInitialState({
    ValidationErrors: []
});
// Creating reducer                        
export const MenuReducer = createReducer(
    initialState,
    on(AddMenu_Success, (state, Menu) => MenuAdapter.addOne(Menu, state)),
    on(AddMenu_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetMenuById_Success, (state, Menu) => MenuAdapter.upsertOne(Menu, state)),
    on(GetMenuById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateMenu_Sucess, (state, res) => MenuAdapter.upsertOne(res.Menu, state)),
    on(RemoveMenu_Success, (state, { id }) => MenuAdapter.removeOne(id, state)),
    on(RemoveMenu_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateMenu_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadMenusSuccess, (state, { payload }) => MenuAdapter.upsertMany(payload, state)),
    on(SetMenuValidationErrors, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetMenuByLocationName_Success, (state, res) => MenuAdapter.upsertOne(res, state)),
    on(GetMenuByLocationName_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(RemoveMenuItem_Success, (state, res) => MenuAdapter.upsertOne(res, state)),
    on(RemoveMenuItem_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(dummyAction, (state) =>
    {
        return {
            ...state,
            initialState
        };
    }),
);

export function prticleReducer(state: any, action: Action)
{
    return MenuReducer(state, action);
}


export const selectMenuState = createFeatureSelector<MenuState>('menu');

export const selectMenuByID = (id: number) => createSelector(
    selectMenuState,
    (state) => state.entities[id]
);
export const selectMenuIds = createSelector(selectMenuState, selectMenu_Ids);
export const selectMenuEntities = createSelector(selectMenuState, selectMenu_Entities);
export const selectAll_Menus = createSelector(selectMenuState, selectAllMenus);
export const selectMenusCount = createSelector(selectMenuState, MenusCount);
export const select_Menu_ValidationErrors = createSelector(
    selectMenuState,
    (state) => state.ValidationErrors!
);