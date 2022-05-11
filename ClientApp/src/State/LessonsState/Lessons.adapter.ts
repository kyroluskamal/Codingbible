import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Lesson } from "src/models.model";

export const LessonsAdapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
    sortComparer: false
});

export const {
    selectIds: selectLessonsIds,
    selectEntities: selectLessonsEntities,
    selectAll: selectAllLessons,
    selectTotal: LessonsCount
} = LessonsAdapter.getSelectors(); 