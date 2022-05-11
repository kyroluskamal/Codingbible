import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CourseSectionsState } from "../app.state";
import { AddCourseSections_Failed, AddCourseSections_Success, dummyAction, GetCourseSectionsById_Failed, GetCourseSectionsById_Success, LoadCourseSectionssSuccess, RemoveCourseSections_Failed, RemoveCourseSections_Success, SetValidationErrors, UpdateCourseSections_Failed, UpdateCourseSections_Sucess } from "./CourseSections.actions";
import * as adapter from "./CourseSections.adapter";

export const initialState: CourseSectionsState = adapter.CourseSectionsAdapter.getInitialState({
    ValidationErrors: [],
});
// Creating reducer                        
export const CourseSectionsReducer = createReducer(
    initialState,
    on(AddCourseSections_Success, (state, CourseSections) => adapter.CourseSectionsAdapter.addOne(CourseSections, state)),
    on(AddCourseSections_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetCourseSectionsById_Success, (state, CourseSections) => 
    {
        return {
            ...state,
            CurrentCourseSectionsById: CourseSections
        };
    }),
    on(GetCourseSectionsById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCourseSections_Sucess, (state, res) => adapter.CourseSectionsAdapter.updateOne(res.CourseSections, state)),
    on(RemoveCourseSections_Success, (state, { id }) => adapter.CourseSectionsAdapter.removeOne(id, state)),
    on(RemoveCourseSections_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCourseSections_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadCourseSectionssSuccess, (state, { payload }) =>
    {
        state = adapter.CourseSectionsAdapter.removeAll({ ...state });
        return adapter.CourseSectionsAdapter.addMany(payload, state);
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
    return CourseSectionsReducer(state, action);
}


export const selectCourseSectionsState = createFeatureSelector<CourseSectionsState>('courseSections');

export const selectCourseSectionsByID = (id: number) => createSelector(
    selectCourseSectionsState,
    (state) => state.entities[id]
);
export const selectCourseSectionsIds = createSelector(selectCourseSectionsState, adapter.selectAllCourseSections);
export const selectCourseSectionsEntities = createSelector(selectCourseSectionsState, adapter.selectCourseSectionEntities);
export const selectAllCourseSectionss = createSelector(selectCourseSectionsState, adapter.selectAllCourseSections);
export const selectCourseSectionsCount = createSelector(selectCourseSectionsState, adapter.CourseSectionsCount);
export const select_CourseSections_ValidationErrors = createSelector(
    selectCourseSectionsState,
    (state) => state.ValidationErrors!
);


