import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Course } from "src/models.model";
import { CourseState } from "../app.state";
import
{
    AddCourse_Failed, AddCourse_Success,
    ChangeStatus_Failed, ChangeStatus_Success, dummyAction,
    GetCourseById_Failed, GetCourseById_Success, GetCourseBy_Slug_Failed, GetCourseBy_Slug_Success, LoadCoursesSuccess,
    RemoveCourse_Failed, RemoveCourse_Success, SetValidationErrors,
    UpdateCourse_Failed, UpdateCourse_Sucess
} from "./course.actions";
import * as adapter from "./course.adapter";

export const initialState: CourseState = adapter.CourseAdapter.getInitialState({
    ValidationErrors: [],
    error: null,
});
// Creating reducer                        
export const CourseReducer = createReducer(
    initialState,
    on(AddCourse_Success, (state, Course) =>
    {
        if (Course.otherSlug)
        {
            state = adapter.CourseAdapter.map(x =>
            {
                let newCourse = { ...x };
                if (x.slug === Course.otherSlug)
                {
                    newCourse.otherSlug = Course.slug;
                }
                return newCourse;
            }, state);
        }
        return adapter.CourseAdapter.addOne(Course, state);
    }),
    on(AddCourse_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
        };
    }),
    on(GetCourseById_Success, (state, Course) => 
    {
        return adapter.CourseAdapter.upsertOne(Course, state);
    }),
    on(GetCourseById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
        };
    }),
    on(UpdateCourse_Sucess, (state, res) => 
    {
        state = adapter.CourseAdapter.map((x) =>
        {
            let newCourse = { ...x };
            if (res.Course.isArabic)
            {
                if (x.slug.localeCompare(res.Course.otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    newCourse.otherSlug = res.Course.slug;
                }
            } else
            {
                if (x.slug === res.Course.otherSlug)
                {
                    newCourse.otherSlug = res.Course.slug;
                }
            }
            return newCourse;
        }, state);

        return adapter.CourseAdapter.upsertOne(res.Course, state);
    }),
    on(RemoveCourse_Success, (state, { id, otherSlug }) =>
    {
        let otherCourse: Course = new Course();
        for (let key in state.entities)
        {
            if (state.entities[key]?.isArabic)
                if (state.entities[key]?.slug === otherSlug)
                {
                    otherCourse = state.entities[key]!;
                }
            if (!state.entities[key]?.isArabic)
            {
                if (state.entities[key]?.slug.localeCompare(otherSlug!, "ar", { ignorePunctuation: true, sensitivity: 'base' }) === 0)
                {
                    otherCourse = state.entities[key]!;
                }
            }
        }
        let copyOfOtherCourse: Course = { ...otherCourse };
        copyOfOtherCourse.otherSlug = null;
        if (otherCourse.id != 0)
        {
            state = adapter.CourseAdapter.upsertOne(copyOfOtherCourse, state);
            return adapter.CourseAdapter.removeOne(id, state);
        } else
            return adapter.CourseAdapter.removeOne(id, state);
    }),
    on(RemoveCourse_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
        };
    }),
    on(ChangeStatus_Success, (state, res) => adapter.CourseAdapter.updateOne(res.Course, { ...state, CurrentCourseById: res.currentCourseById })),
    on(ChangeStatus_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
        };
    }),
    on(UpdateCourse_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
        };
    }),
    on(LoadCoursesSuccess, (state, { payload }) =>
    {
        return adapter.CourseAdapter.upsertMany(payload, state);
    }),
    on(SetValidationErrors, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
        };
    }),
    on(GetCourseBy_Slug_Success, (state, res) => adapter.CourseAdapter.upsertOne(res.Course, state)),
    on(GetCourseBy_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors,
            error: res.error
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


export const selectCourseState = createFeatureSelector<CourseState>('course');

export const selectCourseByID = (id: number) => createSelector(
    selectCourseState,
    (state) => state.entities[id]
);
export const selectCourseBySlug = (Slug: string) => createSelector(
    selectCourseState,
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
export const selectCourseIds = createSelector(selectCourseState, adapter.selectCourseIds);
export const selectCourseEntities = createSelector(selectCourseState, adapter.selectCourseEntities);
export const selectAllCourses = createSelector(selectCourseState, adapter.selectAllCourses);
export const selectCoursesCount = createSelector(selectCourseState, adapter.CoursesCount);
export const selec_Course_ValidationErrors = createSelector(
    selectCourseState,
    (state) => state.ValidationErrors!
);
export const select_Course_HttpResponseError = createSelector(
    selectCourseState,
    (state) => state.error
);


