import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Course } from "src/models.model";

export const CourseAdapter: EntityAdapter<Course> = createEntityAdapter<Course>({
    sortComparer: false
});

export const {
    selectIds: selectCourseIds,
    selectEntities: selectCourseEntities,
    selectAll: selectAllCourses,
    selectTotal: CoursesCount
} = CourseAdapter.getSelectors(); 