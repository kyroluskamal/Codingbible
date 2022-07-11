import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Lesson, Section } from "src/models.model";
import { LessonsState } from "../app.state";
import
{
    AddLesson_Failed, AddLesson_Success, ChangeStatus_Failed,
    ChangeStatus_Success, dummyAction, GetLessonById_Failed, GetLessonById_Success,
    GetLessonBySlug_Failed,
    GetLessonBySlug_Success,
    GetLessonsByCourseId_Failed,
    GetLessonsByCourseId_Success,
    LessonAdditionIsComplete,
    LessonUpdateIsCompleted,
    LoadLessonsFail,
    LoadLessonsSuccess,
    RemoveLesson_Failed, RemoveLesson_Success, SetCurrentSelectedLesson, SetValidationErrors,
    UpdateLesson_Failed, UpdateLesson_Order_Failed, UpdateLesson_Order_Success, UpdateLesson_Sucess
} from "./Lessons.actions";
import * as adapter from "./Lessons.adapter";

export const initialState: LessonsState = adapter.LessonsAdapter.getInitialState({
    ValidationErrors: [],
    AdditionState: false,
    UpdateState: false,
    CurrentSelectedLesson: null
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
        return adapter.LessonsAdapter.upsertOne(Lessons, state);
    }),
    on(GetLessonById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateLesson_Sucess, (state, res) =>
    {
        let otherLesson: Lesson = new Lesson();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === res.Lesson.otherSlug)
                {
                    otherLesson = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(res.Lesson.otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherLesson = state.entities[key]!;
                }
            }
        }
        let copyOfOtherLesson: Lesson = { ...otherLesson };
        console.log(copyOfOtherLesson);
        copyOfOtherLesson.otherSlug = res.Lesson.slug;
        if (otherLesson)
        {
            return adapter.LessonsAdapter.upsertMany([copyOfOtherLesson, res.Lesson], state);
        } else
        {
            return adapter.LessonsAdapter.upsertOne(res.Lesson, state);
        }
    }),
    on(RemoveLesson_Success, (state, { id, otherSlug }) =>
    {
        let otherLesson: Lesson = new Lesson();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === otherSlug)
                {
                    otherLesson = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherLesson = state.entities[key]!;
                }
            }
        }
        let copyOfOtherLesson: Lesson = { ...otherLesson };
        copyOfOtherLesson.otherSlug = null;
        if (otherLesson)
        {
            return adapter.LessonsAdapter.removeOne(id, state) && adapter.LessonsAdapter.upsertOne(copyOfOtherLesson, state);
        } else
            return adapter.LessonsAdapter.removeOne(id, state);
    }),
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
    on(LoadLessonsFail, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadLessonsSuccess, (state, { payload }) =>
    {
        return adapter.LessonsAdapter.upsertMany(payload, state);
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
    on(GetLessonsByCourseId_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetLessonsByCourseId_Success, (state, { payload }) =>
    {
        return adapter.LessonsAdapter.upsertMany(payload, state);
    }),
    on(LessonAdditionIsComplete, (state, res) =>
    {
        return {
            ...state,
            AdditionState: res.status
        };
    }),
    on(LessonUpdateIsCompleted, (state, res) =>
    {
        return {
            ...state,
            UpdateState: res.status
        };
    }),
    on(SetCurrentSelectedLesson, (state, res) =>
    {
        return {
            ...state,
            CurrentSelectedLesson: res
        };
    }),
    on(GetLessonsByCourseId_Success, (state, res) => adapter.LessonsAdapter.upsertMany(res.payload, state)),
    on(GetLessonsByCourseId_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateLesson_Order_Success, (state, res) => adapter.LessonsAdapter.upsertMany(res.Lessons, state)),
    on(UpdateLesson_Order_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetLessonBySlug_Success, (state, res) => adapter.LessonsAdapter.upsertOne(res, state)),
    on(GetLessonBySlug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
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
export const Select_Lesson_AdditionState = createSelector(selectLessonsState, (state) => state.AdditionState);
export const Select_Lesson_UpdateState = createSelector(selectLessonsState, (state) => state.UpdateState);
export const selectLessonBySlug = (Slug: string) => createSelector(
    selectLessonsState,
    (state) =>
    {
        for (let key in state.entities)
        {
            if (state.entities[key]?.slug === Slug)
            {
                return state.entities[key];
            }
        }
        return new Lesson();
    }
);
export const selectLessonByFragmentName = (fragment: string) => createSelector(
    selectLessonsState,
    (state) =>
    {
        for (let key in state.entities)
        {
            if (state.entities[key]?.nameSlugFragment === fragment)
            {
                return state.entities[key];
            }
        }
        return undefined;
    }
);
export const selectLessonBy_SectionId = (sectionId: number) => createSelector(
    selectLessonsState,
    (state) =>
    {
        let lessons: Lesson[] = [];
        for (let key in state.entities)
        {
            if (state.entities[key]?.sectionId === sectionId)
            {
                lessons.push(state.entities[key]!);
            }
        }
        return lessons.sort((a, b) => a.orderWithinSection - b.orderWithinSection);
    }
);
export const selectLessonByCourseId = (courseId: number) => createSelector(
    selectLessonsState,
    (state) =>
    {
        let lessons: Lesson[] = [];
        for (let key in state.entities)
        {
            if (state.entities[key]?.courseId === courseId)
            {
                lessons.push(state.entities[key]!);
            }
        }
        return lessons;
    }
);
export const selectCurrentSelectedLesson = createSelector(selectLessonsState, (state) => state.CurrentSelectedLesson);
