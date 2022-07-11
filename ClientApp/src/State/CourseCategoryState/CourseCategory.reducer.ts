import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CourseCategory } from "src/models.model";
import { TreeDataStructureService } from "src/Services/tree-data-structure.service";
import { CourseCategoryState } from "../app.state";
import { AddCourseCategory_Failed, AddCourseCategory_Success, dummyAction, GetCourseCategoryById_Failed, GetCourseCategoryById_Success, GetCourseCategoryBy_Slug_Failed, LoadCourseCategorysSuccess, RemoveCourseCategory_Failed, RemoveCourseCategory_Success, SetValidationErrors, UpdateCourseCategory_Failed, UpdateCourseCategory_Sucess } from "./CourseCategory.actions";
import * as adapter from "./CourseCategory.adapter";
import { GetCourseCategoryBy_Slug_Success } from "./CourseCategory.actions";

export const initialState: CourseCategoryState = adapter.CourseCategoryAdapter.getInitialState({
    ValidationErrors: [],
});
// Creating reducer                        
export const CourseCategoryReducer = createReducer(
    initialState,
    on(AddCourseCategory_Success, (state, CourseCategory) => adapter.CourseCategoryAdapter.addOne(CourseCategory, state)),
    on(AddCourseCategory_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetCourseCategoryById_Success, (state, CourseCategory) => 
    {
        return {
            ...state,
            CurrentCourseCategoryById: CourseCategory
        };
    }),
    on(GetCourseCategoryById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCourseCategory_Sucess, (state, res) =>
    {
        let otherCourseCategory: CourseCategory = new CourseCategory();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === res.CourseCategory.otherSlug)
                {
                    otherCourseCategory = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(res.CourseCategory.otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherCourseCategory = state.entities[key]!;
                }
            }
        }
        let copyOfOtherCourseCategory: CourseCategory = { ...otherCourseCategory };
        copyOfOtherCourseCategory.otherSlug = res.CourseCategory.slug;
        if (otherCourseCategory)
        {
            return adapter.CourseCategoryAdapter.upsertMany([copyOfOtherCourseCategory, res.CourseCategory], state);
        } else
        {
            return adapter.CourseCategoryAdapter.upsertOne(res.CourseCategory, state);
        }
    }),
    on(RemoveCourseCategory_Success, (state, { id, otherSlug }) => 
    {
        let otherCourseCategory: CourseCategory = new CourseCategory();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === otherSlug)
                {
                    otherCourseCategory = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherCourseCategory = state.entities[key]!;
                }
            }
        }
        let copyOfOtherCourseCategory: CourseCategory = { ...otherCourseCategory };
        copyOfOtherCourseCategory.otherSlug = null;
        if (otherCourseCategory)
        {
            return adapter.CourseCategoryAdapter.removeOne(id, state) && adapter.CourseCategoryAdapter.upsertOne(copyOfOtherCourseCategory, state);
        } else
            return adapter.CourseCategoryAdapter.removeOne(id, state);
    }),
    on(RemoveCourseCategory_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCourseCategory_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadCourseCategorysSuccess, (state, { payload }) =>
    {
        let TreeDataStructure = new TreeDataStructureService<CourseCategory>();
        TreeDataStructure.setData(payload);
        let finalPayload = TreeDataStructure.finalFlatenArray();
        state = adapter.CourseCategoryAdapter.removeAll({ ...state });
        return adapter.CourseCategoryAdapter.addMany(finalPayload, state);
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
    on(GetCourseCategoryBy_Slug_Success, (state, res) => adapter.CourseCategoryAdapter.upsertOne(res, state)),
    on(GetCourseCategoryBy_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    })
);

export function prticleReducer(state: any, action: Action)
{
    return CourseCategoryReducer(state, action);
}


export const selectCourseCategoryState = createFeatureSelector<CourseCategoryState>('courseCategory');

export const selectCourseCategoryByID = (id: number) => createSelector(
    selectCourseCategoryState,
    (state) => state.entities[id]
);
export const selectCourseCategoryBySlug = (Slug: string) => createSelector(
    selectCourseCategoryState,
    (state) =>
    {
        for (let key in state.entities)
        {
            if (!state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === Slug)
                {
                    return state.entities[key];
                }
            if (state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(Slug, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    return state.entities[key];
                }
            }
        }
        return undefined;
    }
);
export const selectCourseCategoryIds = createSelector(selectCourseCategoryState, adapter.selectCourseCategoryIds);
export const selectCourseCategoryEntities = createSelector(selectCourseCategoryState, adapter.selectCourseCategoryEntities);
export const selectAllCourseCategorys = createSelector(selectCourseCategoryState, adapter.selectAllCourseCategorys);
export const selectCourseCategorysCount = createSelector(selectCourseCategoryState, adapter.CourseCategorysCount);
export const select_CourseCategorys_ValidationErrors = createSelector(
    selectCourseCategoryState,
    (state) => state.ValidationErrors!
);


