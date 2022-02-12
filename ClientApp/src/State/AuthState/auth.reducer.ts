import { Action, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CookieNames, LocalStorageKeys } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ApplicationUser } from "src/models.model";
import { ForgetPasswordFailure, ForgetPasswordSuccess, IsInProgress, LoginFailure, LoginSuccess, RegisterFailure, RegisterSuccess, ResetPasswordFailure, ResetPasswordSuccess, SetValidationErrors } from "./auth.actions";
export interface AuthState
{
    user: ApplicationUser | null;
    loginError: string | null;
    roles: string[];
    InProgress: boolean;
    ValidationErrors: ModelStateErrors[];
    isLoggedIn: boolean;
}
export const initialState: AuthState = {
    user: null,
    loginError: null,
    roles: [],
    InProgress: false,
    ValidationErrors: [],
    isLoggedIn: document.cookie.includes(CookieNames.XSRF_TOKEN) ||
        document.cookie.includes(CookieNames.username)
};
export const AuthReducer = createReducer(
    initialState,
    on(IsInProgress, (state) =>
    {
        return { ...state, InProgress: true, isLoggedIn: false, ValidationErrors: [] };
    }),
    on(LoginSuccess, (state, res) =>
    {
        let isLoggedIn = document.cookie.includes(CookieNames.XSRF_TOKEN) ||
            document.cookie.includes(CookieNames.username);
        return {
            ...state, user: res.data.user, roles: res.data.roles, LoggingIsInProgress: false,
            ValidationErrors: [], isLoggedIn: isLoggedIn, InProgress: false
        };
    }),
    on(LoginFailure, (state, { error, validationErrors }) =>
    {
        return {
            ...state, loginError: error, InProgress: false, user: null,
            roles: [], ValidationErrors: validationErrors, isLoggedIn: false
        };
    }),
    on(SetValidationErrors, (state, { ValidationErrors }) =>
    {
        return { ...state, ValidationErrors: ValidationErrors };
    }),
    on(RegisterSuccess, (state, res) =>
    {
        return { ...state, ...initialState };
    }),
    on(RegisterFailure, (state, { error, validationErrors }) =>
    {
        return { ...state, loginError: error, ValidationErrors: validationErrors };
    }),
    on(ForgetPasswordSuccess, (state, res) =>
    {
        return { ...state, ...initialState };
    }),
    on(ForgetPasswordFailure, (state, { error, validationErrors }) =>
    {
        return {
            ...state, loginError: error, InProgress: false, user: null,
            roles: [], ValidationErrors: validationErrors, isLoggedIn: false
        };
    }),
    on(ResetPasswordSuccess, (state, res) =>
    {
        return { ...state, ...initialState };
    }),
    on(ResetPasswordFailure, (state, { error, validationErrors }) =>
    {
        return {
            ...state, loginError: error, InProgress: false, user: null,
            roles: [], ValidationErrors: validationErrors, isLoggedIn: false
        };
    })
);
export function authReducer(state: any, action: any)
{
    return AuthReducer(state, action);
}
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
    selectAuthState,
    (state) => state.user
);
export const selectUserRoles = createSelector(
    selectAuthState,
    (state) => state.roles
);
export const selectAllState = createSelector(
    selectAuthState,
    (state) => state
);
export const selectIsInProgress = createSelector(
    selectAuthState,
    (state) => state.InProgress
);
export const selectValidationErrors = createSelector(
    selectAuthState,
    (state) => state.ValidationErrors
);
export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state) => state.isLoggedIn
);