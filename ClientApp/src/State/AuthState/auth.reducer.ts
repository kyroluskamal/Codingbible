import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CookieNames } from "src/Helpers/constants";
import { AuthState } from "../app.state";

import { ForgetPasswordFailure, ForgetPasswordSuccess, IsInProgress, IsLoggedIn, LoginFailure, LoginSuccess, LogoutCancelled, LogoutConfirmed, RegisterFailure, RegisterSuccess, ResetPasswordFailure, ResetPasswordSuccess, SetValidationErrors } from "./auth.actions";
export const initialState: AuthState = {
    user: null,
    loginError: null,
    roles: [],
    InProgress: false,
    ValidationErrors: [],
    isLoggedIn: false,
    refershTokenExpire: "0",
    isLoggedInChecked: false
};
export const AuthReducer = createReducer(
    initialState,
    on(IsInProgress, (state) =>
    {
        return { ...state, InProgress: true, isLoggedIn: false, ValidationErrors: [] };
    }),
    on(LoginSuccess, (state, res) =>
    {
        return {
            ...state, user: res.data.user, roles: res.data.roles, LoggingIsInProgress: false,
            ValidationErrors: [], isLoggedIn: true, InProgress: false,
            refershTokenExpire: res.tokenExpire,
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
        return { ...state, ValidationErrors: ValidationErrors, isLoggedIn: false };
    }),
    on(RegisterSuccess, (state, res) =>
    {
        return { ...state, ...initialState };
    }),
    on(RegisterFailure, (state, { error, validationErrors }) =>
    {
        return { ...state, loginError: error, ValidationErrors: validationErrors, isLoggedIn: false };
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
    }),
    on(LogoutConfirmed, (state) =>
    {
        return {
            ...state, ...initialState
        };
    }),

    on(LogoutCancelled, (state) =>
    {
        return {
            ...state, ...state
        };
    }),
    on(IsLoggedIn, (state, res) =>
    {
        return {
            ...state, isLoggedIn: res.isLoggedIn, isLoggedInChecked: res.checked,
            user: res.isLoggedIn ? state.user : null, roles: res.isLoggedIn ? state.roles : [],
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
    (state) =>
    {
        let isLoggedIn = state.isLoggedIn && state.user !== null;
        return { isLoggedIn: isLoggedIn, Checked: state.isLoggedInChecked, tokenExpire: state.refershTokenExpire };
    }
);
