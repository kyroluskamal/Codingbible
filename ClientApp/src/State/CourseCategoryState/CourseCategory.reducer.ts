import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CourseCategoryState } from "../app.state";
import { AddCourseCategory_Failed, AddCourseCategory_Success, dummyAction, GetCourseCategoryById_Failed, GetCourseCategoryById_Success, LoadCourseCategorysSuccess, RemoveCourseCategory_Failed, RemoveCourseCategory_Success, SetValidationErrors, UpdateCourseCategory_Failed, UpdateCourseCategory_Sucess } from "./CourseCategory.actions";
import * as adapter from "./CourseCategory.adapter";

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
    on(UpdateCourseCategory_Sucess, (state, res) => adapter.CourseCategoryAdapter.updateOne(res.CourseCategory, state)),
    on(RemoveCourseCategory_Success, (state, { id }) => adapter.CourseCategoryAdapter.removeOne(id, state)),
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
        state = adapter.CourseCategoryAdapter.removeAll({ ...state });
        return adapter.CourseCategoryAdapter.addMany(payload, state);
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
    return CourseCategoryReducer(state, action);
}


export const selectCourseCategoryState = createFeatureSelector<CourseCategoryState>('courseCategory');

export const selectCourseCategoryByID = (id: number) => createSelector(
    selectCourseCategoryState,
    (state) => state.entities[id]
);
export const selectCourseCategoryIds = createSelector(selectCourseCategoryState, adapter.selectCourseCategoryIds);
export const selectCourseCategoryEntities = createSelector(selectCourseCategoryState, adapter.selectCourseCategoryEntities);
export const selectAllCourseCategorys = createSelector(selectCourseCategoryState, adapter.selectAllCourseCategorys);
export const selectCourseCategorysCount = createSelector(selectCourseCategoryState, adapter.CourseCategorysCount);
export const select_CourseCategorys_ValidationErrors = createSelector(
    selectCourseCategoryState,
    (state) => state.ValidationErrors!
);


