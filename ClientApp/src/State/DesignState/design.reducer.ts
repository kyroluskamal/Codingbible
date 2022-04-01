import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { DesignState } from "../app.state";
import { PinnedMenu } from './design.actions';
export const initialState: DesignState = {
    pinned: false
};

export const DesignReducer = createReducer(
    initialState,
    on(PinnedMenu, (state, { pinned }) =>
    {
        return { ...state, pinned: pinned };
    })
);
export const selectDesignState = createFeatureSelector<DesignState>('design');

export const selectPinned = createSelector(
    selectDesignState,
    (state) => state?.pinned
);
