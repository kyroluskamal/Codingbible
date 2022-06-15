import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { SlugMap_CategoriesState, SlugMap_CourseCategoriesState, SlugMap_CourseState, SlugMap_LessonState, SlugMap_PostState, SlugMap_SectionState } from "../app.state";
import { Get_All_SlugMap_Categories_Failed, Get_All_SlugMap_Categories_Success, Get_All_SlugMap_CourseCategories_Failed, Get_All_SlugMap_CourseCategories_Success, Get_All_SlugMap_Courses_Failed, Get_All_SlugMap_Courses_Success, Get_All_SlugMap_Lessons_Failed, Get_All_SlugMap_Lessons_Success, Get_All_SlugMap_Posts_Failed, Get_All_SlugMap_Posts_Success, Get_All_SlugMap_Sections_Failed, Get_All_SlugMap_Sections_Success, Get_SlugMap_Categories_By_Slug_Failed, Get_SlugMap_Categories_By_Slug_Success, Get_SlugMap_CourseCategories_By_Slug_Failed, Get_SlugMap_CourseCategories_By_Slug_Success, Get_SlugMap_Courses_By_Slug_Failed, Get_SlugMap_Courses_By_Slug_Success, Get_SlugMap_Lessons_By_Slug_Failed, Get_SlugMap_Lessons_By_Slug_Success, Get_SlugMap_Posts_By_Slug_Failed, Get_SlugMap_Posts_By_Slug_Success, Get_SlugMap_Sections_By_Slug_Failed, Get_SlugMap_Sections_By_Slug_Success } from "./SlugMap.actions";
import * as adapter from "./SlugMap.adapter";

export const SlugMap_Courses_initialState: SlugMap_CourseState = adapter.SlugMap_Courses_Adapter.getInitialState({
    ValidationErrors: []
});
export const SlugMap_Sections_initialState: SlugMap_SectionState = adapter.SlugMap_SectionsAdapter.getInitialState({
    ValidationErrors: []
});
export const SlugMap_Lessons_initialState: SlugMap_LessonState = adapter.SlugMap_LessonsAdapter.getInitialState({
    ValidationErrors: []
});
export const SlugMap_CourseCategory_initialState: SlugMap_CourseCategoriesState = adapter.SlugMap_CourseCategoryAdapter.getInitialState({
    ValidationErrors: []
});
export const SlugMap_Posts_initialState: SlugMap_PostState = adapter.SlugMap_PostsAdapter.getInitialState({
    ValidationErrors: []
});
export const SlugMap_Category_initialState: SlugMap_CategoriesState = adapter.SlugMap_CategoryAdapter.getInitialState({
    ValidationErrors: []
});

export const SlugMap_Courses_reducer = createReducer(
    SlugMap_Courses_initialState,
    on(Get_All_SlugMap_Courses_Success, (state, res) => adapter.SlugMap_Courses_Adapter.upsertMany(res.payload, state)),
    on(Get_SlugMap_Courses_By_Slug_Success, (state, res) => adapter.SlugMap_Courses_Adapter.upsertOne(res, state)),
    on(Get_All_SlugMap_Courses_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(Get_SlugMap_Courses_By_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    })
);
export const SlugMap_Sections_reducer = createReducer(
    SlugMap_Sections_initialState,
    on(Get_All_SlugMap_Sections_Success, (state, res) => adapter.SlugMap_SectionsAdapter.upsertMany(res.payload, state)),
    on(Get_SlugMap_Sections_By_Slug_Success, (state, res) => adapter.SlugMap_SectionsAdapter.upsertOne(res, state)),
    on(Get_All_SlugMap_Sections_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(Get_SlugMap_Sections_By_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
);
export const SlugMap_Lessons_reducer = createReducer(
    SlugMap_Lessons_initialState,
    on(Get_All_SlugMap_Lessons_Success, (state, res) => adapter.SlugMap_LessonsAdapter.upsertMany(res.payload, state)),
    on(Get_SlugMap_Lessons_By_Slug_Success, (state, res) => adapter.SlugMap_LessonsAdapter.upsertOne(res, state)),
    on(Get_All_SlugMap_Lessons_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(Get_SlugMap_Lessons_By_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    })
);
export const SlugMap_CourseCategory_reducer = createReducer(
    SlugMap_CourseCategory_initialState,
    on(Get_All_SlugMap_CourseCategories_Success, (state, res) => adapter.SlugMap_CourseCategoryAdapter.upsertMany(res.payload, state)),
    on(Get_SlugMap_CourseCategories_By_Slug_Success, (state, res) => adapter.SlugMap_CourseCategoryAdapter.upsertOne(res, state)),
    on(Get_All_SlugMap_CourseCategories_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(Get_SlugMap_CourseCategories_By_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    })
);
export const SlugMap_Posts_reducer = createReducer(
    SlugMap_Posts_initialState,
    on(Get_All_SlugMap_Posts_Success, (state, res) => adapter.SlugMap_PostsAdapter.upsertMany(res.payload, state)),
    on(Get_SlugMap_Posts_By_Slug_Success, (state, res) => adapter.SlugMap_PostsAdapter.upsertOne(res, state)),
    on(Get_All_SlugMap_Posts_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(Get_SlugMap_Posts_By_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
);
export const SlugMap_Category_reducer = createReducer(
    SlugMap_Category_initialState,
    on(Get_All_SlugMap_Categories_Success, (state, res) => adapter.SlugMap_CategoryAdapter.upsertMany(res.payload, state)),
    on(Get_SlugMap_Categories_By_Slug_Success, (state, res) => adapter.SlugMap_CategoryAdapter.upsertOne(res, state)),
    on(Get_All_SlugMap_Categories_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    }),
    on(Get_SlugMap_Categories_By_Slug_Failed, (state, res) =>
    {
        return {
            ...state,
            ValidationErrors: res.validationErrors
        };
    })
);

export const SlugMap_Section_State = createFeatureSelector<SlugMap_SectionState>('SlugMap_Section');
export const SlugMap_Post_State = createFeatureSelector<SlugMap_PostState>('SlugMap_Post');
export const SlugMap_Lesson_State = createFeatureSelector<SlugMap_LessonState>('SlugMap_Lesson');
export const SlugMap_Courses_State = createFeatureSelector<SlugMap_CourseState>('SlugMap_Courses');
export const SlugMap_CourseCategories_State = createFeatureSelector<SlugMap_CourseCategoriesState>('SlugMap_CourseCategories');
export const SlugMap_Categories_State = createFeatureSelector<SlugMap_CategoriesState>('SlugMap_Categories');

export const selectAll_SlugMap_Section = createSelector(SlugMap_Section_State, adapter.selectAll_SlugMap_Sections);
export const selectAll_SlugMap_Post = createSelector(SlugMap_Post_State, adapter.selectAll_SlugMap_Posts);
export const selectAll_SlugMap_Lesson = createSelector(SlugMap_Lesson_State, adapter.selectAll_SlugMap_Lessons);
export const selectAll_SlugMap_Course = createSelector(SlugMap_Courses_State, adapter.selectAll_SlugMap_Courses);
export const selectAll_SlugMap_CourseCategory = createSelector(SlugMap_CourseCategories_State, adapter.selectAll_SlugMap_CourseCategory);
export const selectAll_SlugMap_Category = createSelector(SlugMap_Categories_State, adapter.selectAll_SlugMap_Category);
