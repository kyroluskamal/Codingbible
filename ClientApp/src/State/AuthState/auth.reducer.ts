import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { CookieNames } from "src/Helpers/constants";
import { AuthState } from "../app.state";

import { ForgetPasswordFailure, ForgetPasswordSuccess, IsInProgress, LoginFailure, LoginSuccess, LogoutCancelled, LogoutConfirmed, RegisterFailure, RegisterSuccess, ResetPasswordFailure, ResetPasswordSuccess, SetValidationErrors } from "./auth.actions";

export function GetCookie(key: string)
{
    if (isPlatformBrowser(PLATFORM_ID))
    {
        let cookie = document.cookie;
        let cookies: string[] = cookie.split(";");
        for (let c of cookies)
        {
            let keyValue: string[] = c.trim().split("=");
            if (keyValue[0] === key) return keyValue[1];
        }
    }
    return "";
}
export const initialState: AuthState = {
    user: null,
    loginError: null,
    roles: [],
    InProgress: false,
    ValidationErrors: [],
    isLoggedIn: isPlatformBrowser(PLATFORM_ID) ? Boolean(Number(GetCookie(CookieNames.loginStatus))) : false,
    refershTokenExpire: isPlatformBrowser(PLATFORM_ID) ? GetCookie(CookieNames.refershTokenExpire).replace(/%20/g, ' ').replace(/%3A/g, ':') : "",
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
            refershTokenExpire: isPlatformBrowser(PLATFORM_ID) ? GetCookie(CookieNames.refershTokenExpire).replace(/%20/g, ' ').replace(/%3A/g, ':') : "",
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
        let isLoggedIn = isPlatformBrowser(PLATFORM_ID) ? Boolean(Number(GetCookie(CookieNames.loginStatus))) && state.user !== null : state.user !== null;
        return { isLoggedIn: isLoggedIn, Checked: state.isLoggedInChecked, tokenExpire: state.refershTokenExpire };
    }
);
