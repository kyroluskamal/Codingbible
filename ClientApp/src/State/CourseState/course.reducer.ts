import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CourseState } from "../app.state";
import
{
    AddCourse_Failed, AddCourse_Success,
    ChangeStatus_Failed, ChangeStatus_Success, dummyAction,
    GetCourseById_Failed, GetCourseById_Success, LoadCoursesSuccess,
    RemoveCourse_Failed, RemoveCourse_Success, SetValidationErrors,
    UpdateCourse_Failed, UpdateCourse_Sucess
} from "./course.actions";
import * as adapter from "./course.adapter";

export const initialState: CourseState = adapter.CourseAdapter.getInitialState({
    ValidationErrors: [],
});
// Creating reducer                        
export const CourseReducer = createReducer(
    initialState,
    on(AddCourse_Success, (state, Course) => adapter.CourseAdapter.addOne(Course, state)),
    on(AddCourse_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(GetCourseById_Success, (state, Course) => 
    {
        return {
            ...state,
            CurrentCourseById: Course
        };
    }),
    on(GetCourseById_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCourse_Sucess, (state, res) => adapter.CourseAdapter.updateOne(res.Course, state)),
    on(RemoveCourse_Success, (state, { id }) => adapter.CourseAdapter.removeOne(id, state)),
    on(RemoveCourse_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(ChangeStatus_Success, (state, res) => adapter.CourseAdapter.updateOne(res.Course, { ...state, CurrentCourseById: res.currentCourseById })),
    on(ChangeStatus_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(UpdateCourse_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(LoadCoursesSuccess, (state, { payload }) =>
    {
        state = adapter.CourseAdapter.removeAll({ ...state });
        return adapter.CourseAdapter.addMany(payload, state);
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
    return CourseReducer(state, action);
}


export const selectCourseState = createFeatureSelector<CourseState>('course');

export const selectCourseByID = (id: number) => createSelector(
    selectCourseState,
    (state) => state.entities[id]
);
export const selectCourseIds = createSelector(selectCourseState, adapter.selectCourseIds);
export const selectCourseEntities = createSelector(selectCourseState, adapter.selectCourseEntities);
export const selectAllCourses = createSelector(selectCourseState, adapter.selectAllCourses);
export const selectCoursesCount = createSelector(selectCourseState, adapter.CoursesCount);
export const selec_Course_ValidationErrors = createSelector(
    selectCourseState,
    (state) => state.ValidationErrors!
);

