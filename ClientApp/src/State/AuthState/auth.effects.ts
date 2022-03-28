import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, exhaustMap, map, tap, mergeMap } from 'rxjs';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { ServerResponseHandelerService } from 'src/CommonServices/server-response-handeler.service';
import { AuthRoutes, DashboardRoutes, HomeRoutes } from 'src/Helpers/router-constants';
import { AccountService } from 'src/Services/account.service';
import * as AuthActions from './auth.actions';
import { HTTPResponseStatus, NotificationMessage } from 'src/Helpers/constants';
import { GetServerErrorResponseService } from 'src/CommonServices/getServerErrorResponse.service';

@Injectable()
export class AuthEffects
{
    loginRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.Login),
            exhaustMap(action =>
            {
                return this.accoutnService.Login({ email: action.email, password: action.password, rememberMe: action.rememberMe })
                    .pipe(
                        map((r) => AuthActions.LoginSuccess(r)),
                        catchError((e) => of(AuthActions.LoginFailure({ error: e, validationErrors: this.ServerError.GetServerSideValidationErrors(e) })))
                    );
            }
            )
        )
    );
    logoutRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.Logout),
            exhaustMap(() =>
                this.accoutnService.logout()
                    .pipe(
                        map((r) =>
                        {
                            this.router.navigateByUrl("/");
                            return AuthActions.LogoutConfirmed();
                        }),
                        catchError((e) =>
                        {
                            return of(AuthActions.LogoutCancelled());
                        })
                    )
            )
        )
    );


    loginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.LoginSuccess),
                tap((r) =>
                {
                    this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                    this.dialogHandler.CloseDialog();
                    if (this.router.url.includes(AuthRoutes.Login))
                        this.router.navigateByUrl(DashboardRoutes.Home);
                })
            ),
        { dispatch: false }
    );
    RegisterRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.Register),
            exhaustMap(action =>
                this.accoutnService.Register({
                    email: action.email,
                    username: action.username,
                    password: action.password,
                    confirmpassword: action.confirmpassword,
                    firstname: action.firstname,
                    lastname: action.lastname,
                    clientUrl: action.clientUrl,
                    isActive: true,
                    rememberMe: false
                })
                    .pipe(
                        map((r) => AuthActions.RegisterSuccess(r)),
                        catchError((e) => of(AuthActions.RegisterFailure({ error: e, validationErrors: this.ServerError.GetServerSideValidationErrors(e) })))
                    )
            )
        )
    );
    RegisterSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.RegisterSuccess),
                tap((r) =>
                {
                    this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                    this.dialogHandler.CloseDialog();
                    if (this.router.url.includes(AuthRoutes.Register))
                        this.router.navigateByUrl(AuthRoutes.Login);
                })
            ),
        { dispatch: false }
    );
    ForgetPasswordRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.ForgetPassword),
            exhaustMap(action =>
                this.accoutnService.ForgetPassword({
                    email: action.email,
                    clientUrl: action.clientUrl,
                })
                    .pipe(
                        map((r) => AuthActions.ForgetPasswordSuccess(r)),
                        catchError((e) => of(AuthActions.ForgetPasswordFailure({ error: e, validationErrors: this.ServerError.GetServerSideValidationErrors(e) })))
                    )
            )
        )
    );
    ForgetPasswordSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.ForgetPasswordSuccess),
                tap((r) =>
                {
                    this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                    this.dialogHandler.CloseDialog();
                })
            ),
        { dispatch: false }
    );
    ResetPasswordRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.ResetPassword),
            exhaustMap(action =>
                this.accoutnService.ResetPassword({
                    email: action.email,
                    token: action.token,
                    password: action.password,
                    confirmPassword: action.confirmPassword
                })
                    .pipe(
                        map((r) => AuthActions.ResetPasswordSuccess(r)),
                        catchError((e) => of(AuthActions.ResetPasswordFailure({ error: e, validationErrors: this.ServerError.GetServerSideValidationErrors(e) })))
                    )
            )
        )
    );
    ResetPasswordSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.ResetPasswordSuccess),
                tap((r) =>
                {
                    this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                    this.router.navigate(['', AuthRoutes.Login]);
                })
            ),
        { dispatch: false }
    );
    ResetPasswordFailure$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.ResetPasswordFailure),
                tap((e) =>
                {
                    if (e.error.error.status === HTTPResponseStatus.identityErrors)
                    {
                        for (let error of e.error.error.message)
                        {
                            if (error.code === "InvalidToken")
                            {
                                this.ServerResponse.GetGeneralError_Swal("Failed", "OK", NotificationMessage.Error.ResetPasswordFail_InvalidToken);
                                this.router.navigateByUrl("/");
                                break;
                            }
                        }
                        return;
                    }
                    if (e.error.error.errors.Email)
                    {
                        this.ServerResponse.GetGeneralError_Swal("Failed", "OK", "Not a valid email. Try to reset password again");
                        this.router.navigateByUrl("/");
                        return;
                    }
                })
            ),
        { dispatch: false }
    );
    constructor(
        private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        public dialogHandler: DialogHandlerService, private ServerError: GetServerErrorResponseService,
        private accoutnService: AccountService,
        private router: Router
    ) { }
}