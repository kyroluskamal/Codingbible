import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Section } from "src/models.model";
import { SectionsState } from "../app.state";
import { AdditionIsComplete, AddSection_Failed, AddSection_Success, ChangeStatus_Failed, ChangeStatus_Success, GetSectionById_Failed, GetSectionById_Success, GetSectionsByCourseId_Failed, GetSectionsByCourseId_Success, LoadSectionsSuccess, RemoveSection_Failed, RemoveSection_Success, SetValidationErrors, UpdateIsCompleted, UpdateSectionOrder_Failed, UpdateSectionOrder_Sucess, UpdateSection_Failed, UpdateSection_Sucess } from "./sections.actions";

import * as adapter from "./sections.adapter";

export const initialState: SectionsState = adapter.SectionsAdapter.getInitialState({
    ValidationErrors: [],
    AdditionState: false,
    UpdateState: false,
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
    on(UpdateSection_Sucess, (state, res) =>
    {
        let otherSection: Section = new Section();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === res.Section.otherSlug)
                {
                    otherSection = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(res.Section.otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherSection = state.entities[key]!;
                }
            }
        }
        let copyOfOtherSection: Section = { ...otherSection };
        console.log(copyOfOtherSection);
        copyOfOtherSection.otherSlug = res.Section.slug;
        if (otherSection)
        {
            return adapter.SectionsAdapter.upsertMany([copyOfOtherSection, res.Section], state);
        } else
        {
            return adapter.SectionsAdapter.upsertOne(res.Section, state);
        }
    }),
    on(RemoveSection_Success, (state, { id, otherSlug }) =>
    {
        let otherSection: Section = new Section();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === otherSlug)
                {
                    otherSection = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherSection = state.entities[key]!;
                }
            }
        }
        let copyOfOtherSection: Section = { ...otherSection };
        copyOfOtherSection.otherSlug = null;
        if (otherSection)
        {
            return adapter.SectionsAdapter.removeOne(id, state) && adapter.SectionsAdapter.upsertOne(copyOfOtherSection, state);
        } else
            return adapter.SectionsAdapter.removeOne(id, state);
    }),
    on(RemoveSection_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(ChangeStatus_Success, (state, res) => adapter.SectionsAdapter.updateOne(res.Section, { ...state })),
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
    on(AdditionIsComplete, (state, res) =>
    {
        return {
            ...state,
            AdditionState: res.status
        };
    }),
    on(UpdateIsCompleted, (state, res) =>
    {
        return {
            ...state,
            UpdateState: res.status
        };
    }),
    on(GetSectionsByCourseId_Success, (state, res) =>
    {
        return adapter.SectionsAdapter.upsertMany(res.payload, state);
    }),
    on(GetSectionsByCourseId_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateSectionOrder_Sucess, (state, res) => adapter.SectionsAdapter.upsertMany(res.payload, state)),
    on(UpdateSectionOrder_Failed, (state, res) =>
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
export const Select_AdditionState = createSelector(selectSectionsState, (state) => state.AdditionState);
export const Select_UpdateState = createSelector(selectSectionsState, (state) => state.UpdateState);
export const Select_Sections_ByCourseId = (courseId: number) =>
    createSelector(selectSectionsState,
        (state) =>
        {
            let sections: Section[] = [];
            for (let key in state.entities)
            {
                if (state.entities[key])
                    if (state.entities[key]?.courseId === courseId)
                    {
                        sections.push(state.entities[key]!);
                    }
            }
            return sections;
        });
