import { ActionReducerMap } from "@ngrx/store";
import { AuthReducer, AuthState } from "./AuthState/auth.reducer";

export interface AppState
{
    auth: AuthState;
}

export const AppReducers: ActionReducerMap<AppState> = {
    auth: AuthReducer
};