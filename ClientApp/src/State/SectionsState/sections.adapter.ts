import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Section } from "src/models.model";

export const SectionsAdapter: EntityAdapter<Section> = createEntityAdapter<Section>({
    sortComparer: false
});

export const {
    selectIds: selectSectionsIds,
    selectEntities: selectSectionsEntities,
    selectAll: selectAllSections,
    selectTotal: SectionsCount
} = SectionsAdapter.getSelectors(); 