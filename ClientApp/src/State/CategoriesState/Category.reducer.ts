import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Category } from "src/models.model";
import { CategoryState } from "../app.state";
import { dummyAction } from "../PostState/post.actions";
import { AddCATEGORY_Failed, AddCATEGORY_Success, GetCategoryById_Failed, GetCategoryById_Success, LoadCATEGORYsSuccess, RemoveCATEGORY_Failed, RemoveCATEGORY_Success, UpdateCATEGORY_Failed, UpdateCATEGORY_Sucess } from "./Category.actions";
import { CategoryAdapter, categorysCount, selectAllcategorys, selectCategory_Entities, selectCategory_Ids } from "./Category.adapter";

export const initialState: CategoryState = CategoryAdapter.getInitialState({
    ValidationErrors: [],
    CurrentCategoryById: new Category(),
    CurrentCategoryBySlug: new Category()
});
// Creating reducer                        
export const CategoryReducer = createReducer(
    initialState,
    on(AddCATEGORY_Success, (state, category) => CategoryAdapter.addOne(category, state)),
    on(AddCATEGORY_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetCategoryById_Success, (state, category) => 
    {
        return {
            ...state,
            CurrentCategoryById: category
        };
    }),
    on(GetCategoryById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCATEGORY_Sucess, (state, res) => CategoryAdapter.updateOne(res.CATEGORY, state)),
    on(RemoveCATEGORY_Success, (state, { id }) => CategoryAdapter.removeOne(id, state)),
    on(RemoveCATEGORY_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCATEGORY_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadCATEGORYsSuccess, (state, { payload }) =>
    {
        state = CategoryAdapter.removeAll({ ...state });
        return CategoryAdapter.addMany(payload, state);
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
    return CategoryReducer(state, action);
}


export const selectCategoryState = createFeatureSelector<CategoryState>('category');

export const selectCategoryByID = createSelector(
    selectCategoryState,
    (state) => state.CurrentCategoryById
);
export const selectCategoryIds = createSelector(selectCategoryState, selectCategory_Ids);
export const selectCategoryEntities = createSelector(selectCategoryState, selectCategory_Entities);
export const selectAllCategorys = createSelector(selectCategoryState, selectAllcategorys);
export const selectCategorysCount = createSelector(selectCategoryState, categorysCount);
export const select_Category_ValidationErrors = createSelector(
    selectCategoryState,
    (state) => state.ValidationErrors!
);