import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Section } from "src/models.model";

export const CourseSectionsAdapter: EntityAdapter<Section> = createEntityAdapter<Section>({
    sortComparer: false
});

export const {
    selectIds: selectCourseSectionIds,
    selectEntities: selectCourseSectionEntities,
    selectAll: selectAllCourseSections,
    selectTotal: CourseSectionsCount
} = CourseSectionsAdapter.getSelectors(); 