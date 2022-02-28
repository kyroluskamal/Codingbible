import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { HttpResponsesObject, Post } from "src/models.model";

export const AddPOST = createAction(actionNames.PostActions.ADD_POST,
    props<Post>());
export const dummyAction = createAction("Dont call server");
export const AddPOST_Success = createAction(actionNames.PostActions.ADD_POST_Success,
    props<Post>());
export const AddPOST_Failed = createAction(actionNames.PostActions.ADD_POST_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const AddPOSTs = createAction(actionNames.PostActions.ADD_POSTS,
    props<{ payload: { POSTs: Post[]; }; }>());
export const UpdatePOST = createAction(actionNames.PostActions.UPDATE_POST,
    props<{ payload: { POST: Update<Post>; }; }>());
export const UpdatePOSTs = createAction(actionNames.PostActions.UPDATE_POSTS,
    props<{ payload: { POSTs: Update<Post>[]; }; }>());
export const RemovePOST = createAction(actionNames.PostActions.REMOVE_POST,
    props<{ payload: { id: string; }; }>());
export const RemovePOSTs = createAction(actionNames.PostActions.REMOVE_POSTS,
    props<{ payload: { ids: string[]; }; }>());
export const ClearPOSTs = createAction(actionNames.PostActions.CLEAR_POSTS);
export const LoadPOSTs = createAction(actionNames.PostActions.LOAD_ALL_POSTS);
export const LoadPOSTsSuccess = createAction(actionNames.PostActions.LOAD_ALL_POSTS_SUCCESS,
    props<{ payload: Post[]; }>());
export const LoadPOSTsFail = createAction(actionNames.PostActions.LOAD_ALL_POSTS_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const SelectPOST = createAction(actionNames.PostActions.SELECT_POST,
    props<{ payload: { POSTId: string; }; }>()); 