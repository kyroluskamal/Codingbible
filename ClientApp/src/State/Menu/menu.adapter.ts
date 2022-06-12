import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Menu } from "src/models.model";

export const MenuAdapter: EntityAdapter<Menu> = createEntityAdapter<Menu>({
    sortComparer: false
});

export const {
    selectIds: selectMenu_Ids,
    selectEntities: selectMenu_Entities,
    selectAll: selectAllMenus,
    selectTotal: MenusCount
} = MenuAdapter.getSelectors(); 