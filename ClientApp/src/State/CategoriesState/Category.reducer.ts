import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Category } from "src/models.model";
import { TreeDataStructureService } from "src/Services/tree-data-structure.service";
import { CategoryState } from "../app.state";
import { dummyAction } from "../PostState/post.actions";
import { AddCATEGORY_Failed, AddCATEGORY_Success, GetCategoryById_Failed, GetCategoryById_Success, LoadCATEGORYsSuccess, RemoveCATEGORY_Failed, RemoveCATEGORY_Success, SetValidationErrors, UpdateCATEGORY_Failed, UpdateCATEGORY_Sucess } from "./Category.actions";
import { CategoryAdapter, categorysCount, selectAllcategorys, selectCategory_Entities, selectCategory_Ids } from "./Category.adapter";

export const initialState: CategoryState = CategoryAdapter.getInitialState({
    ValidationErrors: [],
    CurrentCategoryById: new Category(),
    CurrentCategoryBySlug: new Category()
});
// Creating reducer                        
export const CategoryReducer = createReducer(
    initialState,
    on(AddCATEGORY_Success, (state, category) =>
    {
        if (category.otherSlug)
        {
            state = CategoryAdapter.map(x =>
            {
                let newCategory = { ...x };
                if (x.slug === category.otherSlug)
                {
                    newCategory.otherSlug = category.slug;
                }
                return newCategory;
            }, state);
        }
        return CategoryAdapter.addOne(category, state);
    }),
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
    on(UpdateCATEGORY_Sucess, (state, res) =>
    {
        state = CategoryAdapter.map((x) =>
        {
            let newCategory = { ...x };
            if (res.CATEGORY.isArabic)
            {
                if (x.slug.localeCompare(res.CATEGORY.otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    newCategory.otherSlug = res.CATEGORY.slug;
                }
            } else
            {
                if (x.slug === res.CATEGORY.otherSlug)
                {
                    newCategory.otherSlug = res.CATEGORY.slug;
                }
            }
            return newCategory;
        }, state);

        return CategoryAdapter.upsertOne(res.CATEGORY, state);
    }),
    on(RemoveCATEGORY_Success, (state, { id, otherSlug }) =>
    {
        let otherCategory: Category = new Category();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === otherSlug)
                {
                    otherCategory = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherCategory = state.entities[key]!;
                }
            }
        }
        let copyOfOtherCategory: Category = { ...otherCategory };
        copyOfOtherCategory.otherSlug = null;
        if (otherCategory.id = 0)
        {
            state = CategoryAdapter.upsertOne(copyOfOtherCategory, state);
            return CategoryAdapter.removeOne(id, state);
        } else
            return CategoryAdapter.removeOne(id, state);
    }),
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
        let TreeDataStructure = new TreeDataStructureService<Category>();
        TreeDataStructure.setData(payload);
        let finalPayload = TreeDataStructure.finalFlatenArray();
        state = CategoryAdapter.removeAll({ ...state });
        return CategoryAdapter.addMany(finalPayload, state);
    }),
    on(SetValidationErrors, (state, res) =>
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