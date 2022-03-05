import { Update } from "@ngrx/entity";
import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { Post } from "src/models.model";

export const dummyAction = createAction("Dont call server");
export const AddPOST = createAction(actionNames.PostActions.ADD_POST,
    props<Post>());
export const AddPOST_Success = createAction(actionNames.PostActions.ADD_POST_Success,
    props<Post>());
export const AddPOST_Failed = createAction(actionNames.PostActions.ADD_POST_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const ChangeStatus = createAction(actionNames.PostActions.ChangeStatus,
    props<Post>());
export const ChangeStatus_Success = createAction(actionNames.PostActions.ChangeStatus_Success,
    props<{ POST: Update<Post>; currentPostById: Post; }>());
export const ChangeStatus_Failed = createAction(actionNames.PostActions.ChangeStatus_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const GetPostById = createAction(actionNames.PostActions.GetPostById,
    props<{ id: number; }>());
export const GetPostById_Success = createAction(actionNames.PostActions.GetPostById_Success,
    props<Post>());
export const GetPostById_Failed = createAction(actionNames.PostActions.GetPostById_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const UpdatePOST = createAction(actionNames.PostActions.UPDATE_POST,
    props<Post>());
export const UpdatePOST_Sucess = createAction(actionNames.PostActions.UPDATE_POST_Sucess,
    props<{ POST: Update<Post>; }>());
export const UpdatePOST_Failed = createAction(actionNames.PostActions.UPDATE_POST_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const RemovePOST = createAction(actionNames.PostActions.REMOVE_POST,
    props<{ id: number; source: string; }>());
export const RemovePOST_Success = createAction(actionNames.PostActions.REMOVE_POST_Success,
    props<{ id: number; }>());
export const RemovePOST_Failed = createAction(actionNames.PostActions.REMOVE_POST_Failed,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());
export const LoadPOSTs = createAction(actionNames.PostActions.LOAD_ALL_POSTS);
export const LoadPOSTsSuccess = createAction(actionNames.PostActions.LOAD_ALL_POSTS_SUCCESS,
    props<{ payload: Post[]; }>());
export const LoadPOSTsFail = createAction(actionNames.PostActions.LOAD_ALL_POSTS_FAILED,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>());