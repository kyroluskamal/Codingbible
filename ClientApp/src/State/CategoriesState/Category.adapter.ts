import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Category } from "src/models.model";

export const CategoryAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
    sortComparer: false
});

export const {
    selectIds: selectCategory_Ids,
    selectEntities: selectCategory_Entities,
    selectAll: selectAllcategorys,
    selectTotal: categorysCount
} = CategoryAdapter.getSelectors(); 