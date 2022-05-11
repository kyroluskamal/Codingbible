import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { LessonsState } from "../app.state";
import
{
    AddLesson_Failed, AddLesson_Success, ChangeStatus_Failed,
    ChangeStatus_Success, dummyAction, GetLessonById_Failed, GetLessonById_Success,
    LoadLessonsSuccess,
    RemoveLesson_Failed, RemoveLesson_Success, SetValidationErrors,
    UpdateLesson_Failed, UpdateLesson_Sucess
} from "./Lessons.actions";
import * as adapter from "./Lessons.adapter";

export const initialState: LessonsState = adapter.LessonsAdapter.getInitialState({
    ValidationErrors: [],
});
// Creating reducer                        
export const LessonsReducer = createReducer(
    initialState,
    on(AddLesson_Success, (state, Lessons) => adapter.LessonsAdapter.addOne(Lessons, state)),
    on(AddLesson_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetLessonById_Success, (state, Lessons) => 
    {
        return {
            ...state,
            CurrentLessonsById: Lessons
        };
    }),
    on(GetLessonById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateLesson_Sucess, (state, res) => adapter.LessonsAdapter.updateOne(res.Lesson, state)),
    on(RemoveLesson_Success, (state, { id }) => adapter.LessonsAdapter.removeOne(id, state)),
    on(RemoveLesson_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(ChangeStatus_Success, (state, res) => adapter.LessonsAdapter.updateOne(res.Lesson, state)),
    on(ChangeStatus_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateLesson_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadLessonsSuccess, (state, { payload }) =>
    {
        state = adapter.LessonsAdapter.removeAll({ ...state });
        return adapter.LessonsAdapter.addMany(payload, state);
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
    return LessonsReducer(state, action);
}


export const selectLessonsState = createFeatureSelector<LessonsState>('lessons');

export const selectLessonsByID = (id: number) => createSelector(
    selectLessonsState,
    (state) => state.entities[id]
);
export const selectLessonsIds = createSelector(selectLessonsState, adapter.selectLessonsIds);
export const selectLessonsEntities = createSelector(selectLessonsState, adapter.selectLessonsEntities);
export const selectAllLessons = createSelector(selectLessonsState, adapter.selectAllLessons);
export const selectLessonsCount = createSelector(selectLessonsState, adapter.LessonsCount);
export const select_Lessons_ValidationErrors = createSelector(
    selectLessonsState,
    (state) => state.ValidationErrors!
);


