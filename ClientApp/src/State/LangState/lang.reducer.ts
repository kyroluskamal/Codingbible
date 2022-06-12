import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { LangState } from "../app.state";
import { SET_LANGUAGE } from "./lang.acitons";

export const initialState: LangState = {
    isArabic: false
};

export const LangReducer = createReducer(
    initialState,
    on(SET_LANGUAGE, (state, res) =>
    {
        return { ...state, isArabic: res.isArabic };
    })
);
export const selectLangState = createFeatureSelector<LangState>('lang');

export const selectLang = createSelector(
    selectLangState,
    (state) => state?.isArabic
);