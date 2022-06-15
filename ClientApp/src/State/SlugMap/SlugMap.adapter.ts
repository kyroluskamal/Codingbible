import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { SlugMap_Category, SlugMap_CourseCategory, SlugMap_Courses, SlugMap_Lessons, SlugMap_Posts, SlugMap_Sections } from "src/models.model";

export const SlugMap_Courses_Adapter: EntityAdapter<SlugMap_Courses> = createEntityAdapter<SlugMap_Courses>({
    sortComparer: false
});

export const {
    selectIds: select_SlugMap_Courses_Ids,
    selectEntities: select_SlugMap_Courses_Entities,
    selectAll: selectAll_SlugMap_Courses,
    selectTotal: SlugMap_Courses_Count
} = SlugMap_Courses_Adapter.getSelectors();


export const SlugMap_CategoryAdapter: EntityAdapter<SlugMap_Category> = createEntityAdapter<SlugMap_Category>({
    sortComparer: false
});

export const {
    selectIds: select_SlugMap_Category_Ids,
    selectEntities: select_SlugMap_Category_Entities,
    selectAll: selectAll_SlugMap_Category,
    selectTotal: SlugMap_Categorys_Count
} = SlugMap_CategoryAdapter.getSelectors();

export const SlugMap_CourseCategoryAdapter: EntityAdapter<SlugMap_CourseCategory> = createEntityAdapter<SlugMap_CourseCategory>({
    sortComparer: false
});

export const {
    selectIds: select_SlugMap_CourseCategory_Ids,
    selectEntities: select_SlugMap_CourseCategory_Entities,
    selectAll: selectAll_SlugMap_CourseCategory,
    selectTotal: SlugMap_CourseCategorys_Count
} = SlugMap_CourseCategoryAdapter.getSelectors();

export const SlugMap_SectionsAdapter: EntityAdapter<SlugMap_Sections> = createEntityAdapter<SlugMap_Sections>({
    sortComparer: false
});

export const {
    selectIds: select_SlugMap_Sections_Ids,
    selectEntities: select_SlugMap_Sections_Entities,
    selectAll: selectAll_SlugMap_Sections,
    selectTotal: SlugMap_Sections_Count
} = SlugMap_SectionsAdapter.getSelectors();

export const SlugMap_LessonsAdapter: EntityAdapter<SlugMap_Lessons> = createEntityAdapter<SlugMap_Lessons>({
    sortComparer: false
});

export const {
    selectIds: select_SlugMap_Lessons_Ids,
    selectEntities: select_SlugMap_Lessons_Entities,
    selectAll: selectAll_SlugMap_Lessons,
    selectTotal: SlugMap_Lessons_Count
} = SlugMap_LessonsAdapter.getSelectors();

export const SlugMap_PostsAdapter: EntityAdapter<SlugMap_Posts> = createEntityAdapter<SlugMap_Posts>({
    sortComparer: false
});

export const {
    selectIds: select_SlugMap_Posts_Ids,
    selectEntities: select_SlugMap_Posts_Entities,
    selectAll: selectAll_SlugMap_Posts,
    selectTotal: SlugMap_Posts_Count
} = SlugMap_PostsAdapter.getSelectors();

