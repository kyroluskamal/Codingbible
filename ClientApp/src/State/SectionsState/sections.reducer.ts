import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { SectionsState } from "../app.state";
import { AddSection_Failed, AddSection_Success, ChangeStatus_Failed, ChangeStatus_Success, dummyAction, GetSectionById_Failed, GetSectionById_Success, LoadSectionsSuccess, RemoveSection_Failed, RemoveSection_Success, SetValidationErrors, UpdateSection_Failed, UpdateSection_Sucess } from "./sections.actions";

import * as adapter from "./sections.adapter";

export const initialState: SectionsState = adapter.SectionsAdapter.getInitialState({
    ValidationErrors: [],
});
// Creating reducer                        
export const SectionsReducer = createReducer(
    initialState,
    on(AddSection_Success, (state, Sections) => adapter.SectionsAdapter.addOne(Sections, state)),
    on(AddSection_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetSectionById_Success, (state, Sections) => 
    {
        return {
            ...state,
            CurrentSectionsById: Sections
        };
    }),
    on(GetSectionById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateSection_Sucess, (state, res) => adapter.SectionsAdapter.updateOne(res.Section, state)),
    on(RemoveSection_Success, (state, { id }) => adapter.SectionsAdapter.removeOne(id, state)),
    on(RemoveSection_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(ChangeStatus_Success, (state, res) => adapter.SectionsAdapter.updateOne(res.Course, { ...state })),
    on(ChangeStatus_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateSection_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadSectionsSuccess, (state, { payload }) =>
    {
        state = adapter.SectionsAdapter.removeAll({ ...state });
        return adapter.SectionsAdapter.addMany(payload, state);
    }),
    on(SetValidationErrors, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
);

export function prticleReducer(state: any, action: Action)
{
    return SectionsReducer(state, action);
}


export const selectSectionsState = createFeatureSelector<SectionsState>('sections');

export const selectSectionsByID = (id: number) => createSelector(
    selectSectionsState,
    (state) => state.entities[id]
);
export const selectSectionsIds = createSelector(selectSectionsState, adapter.selectSectionsIds);
export const selectSectionsEntities = createSelector(selectSectionsState, adapter.selectSectionsEntities);
export const selectAllSections = createSelector(selectSectionsState, adapter.selectAllSections);
export const selectSectionsCount = createSelector(selectSectionsState, adapter.SectionsCount);
export const select_Sections_ValidationErrors = createSelector(
    selectSectionsState,
    (state) => state.ValidationErrors!
);


