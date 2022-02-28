import { createAction, props } from "@ngrx/store";
import { actionNames } from '../../Helpers/constants';
export const PinnedMenu = createAction(
    actionNames.designActions.pinned,
    props<{ pinned: boolean; }>()
);