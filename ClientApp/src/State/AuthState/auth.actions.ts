import { createAction, props } from "@ngrx/store";
import { actionNames } from "src/Helpers/constants";
import { ModelStateErrors } from "src/Interfaces/interfaces";
import { ForgetPasswordModel, HttpResponsesObject, LoginViewModel, RegisterViewModel, ResetPasswordModel } from "src/models.model";
export const Login = createAction(
    actionNames.AuthenticationActions.Login,
    props<LoginViewModel>()
);
export const IsInProgress = createAction(
    actionNames.AuthenticationActions.InProgress,
    props<{ isLoading: boolean; }>()
);
export const LoginSuccess = createAction(actionNames.AuthenticationActions.LoginSuccess,
    props<HttpResponsesObject>());
export const LoginFailure = createAction(actionNames.AuthenticationActions.LoginFailure,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>()
);
export const SetValidationErrors = createAction(actionNames.AuthenticationActions.SetValidationErrors,
    props<{ ValidationErrors: ModelStateErrors[]; }>()
);
/***********************************************************************************
 *                              Register actions
 ***********************************************************************************/
//#region Register actions
export const Register = createAction(
    actionNames.AuthenticationActions.Register,
    props<RegisterViewModel>()
);

export const RegisterSuccess = createAction(actionNames.AuthenticationActions.RegisterSuccess,
    props<HttpResponsesObject>());
export const RegisterFailure = createAction(actionNames.AuthenticationActions.RegisterFailure,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>()
);
//#endregion
/***********************************************************************************
 *                              Forgetpassword actions
 ***********************************************************************************/
//#region Forgetpassword actions
export const ForgetPassword = createAction(
    actionNames.AuthenticationActions.ForgetPassword,
    props<ForgetPasswordModel>()
);
export const ForgetPasswordSuccess = createAction(actionNames.AuthenticationActions.ForgetPasswordSuccess,
    props<HttpResponsesObject>());
export const ForgetPasswordFailure = createAction(actionNames.AuthenticationActions.ForgetPasswordFailure,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>()
);
//#endregion
/***********************************************************************************
 *                              Resetpassword actions
 ***********************************************************************************/
export const ResetPassword = createAction(
    actionNames.AuthenticationActions.ResetPassword,
    props<ResetPasswordModel>()
);
export const ResetPasswordSuccess = createAction(actionNames.AuthenticationActions.ResetPasswordSuccess,
    props<HttpResponsesObject>());
export const ResetPasswordFailure = createAction(actionNames.AuthenticationActions.ResetPasswordFailure,
    props<{ error: any; validationErrors: ModelStateErrors[]; }>()
);
/***********************************************************************************
 *                              IsLoggedIn actions
 ***********************************************************************************/
export const IsLoggedIn = createAction(actionNames.AuthenticationActions.IsLoggedIn,
    props<{ isLoggedIn: boolean; checked: boolean; }>());

export const Logout = createAction(actionNames.AuthenticationActions.Logout);
export const LogoutCancelled = createAction(actionNames.AuthenticationActions.LogoutCancelled);
export const LogoutConfirmed = createAction(actionNames.AuthenticationActions.LogoutConfirmed);