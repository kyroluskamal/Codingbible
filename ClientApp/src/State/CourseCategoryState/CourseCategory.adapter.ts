import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { CourseCategory } from "src/models.model";

export const CourseCategoryAdapter: EntityAdapter<CourseCategory> = createEntityAdapter<CourseCategory>({
    sortComparer: false
});

export const {
    selectIds: selectCourseCategoryIds,
    selectEntities: selectCourseCategoryEntities,
    selectAll: selectAllCourseCategorys,
    selectTotal: CourseCategorysCount
} = CourseCategoryAdapter.getSelectors(); 