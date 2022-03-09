import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { fakeAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { Router, RouterModule, UrlSegment } from "@angular/router";
import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { Store } from "@ngrx/store";
import { AppModule } from "src/app/app.module";
import { FormControlNames, InputElementsAttributes, InputFieldTypes, validators } from "src/Helpers/constants";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { AuthRoutes } from "src/Helpers/router-constants";
import { HttpResponsesObject } from "src/models.model";
import { LoginFailure, LoginSuccess } from "src/State/AuthState/auth.actions";
import { RoutesForHomeModule } from "../../home-website-routing.module";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () =>
{
    let emailInput: HTMLInputElement | null;
    let passwordInput: HTMLInputElement | null;
    let loginBtn: HTMLButtonElement | null;
    let spectator: SpectatorRouting<LoginComponent>;
    const createComponent = createRoutingFactory({
        component: LoginComponent,
        imports: [AppModule, RouterModule.forChild(RoutesForHomeModule)],
        providers: [FormBuilder, Store, HttpClient],
        shallow: false
    });
    beforeEach(() =>
    {
        spectator = createComponent({
            detectChanges: true
        });
        spectator.component.ngOnInit();
        emailInput = <HTMLInputElement>spectatorSelectByControlName<LoginComponent>(spectator, FormControlNames.authForm.email);
        passwordInput = <HTMLInputElement>spectatorSelectByControlName<LoginComponent>(spectator, FormControlNames.authForm.password);
        loginBtn = spectator.query(byTestId('loginBtn'));
    });
    describe("Client Side Validation", () =>
    {
        describe("loginForm testing", () =>
        {
            describe(`${toTitleCase(FormControlNames.authForm.email)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.email)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.email)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has pattern validator`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.email)?.hasValidator(validators.email)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.password)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.password)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.password)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has pattern validators`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.password)?.hasValidator(validators.password!)).toBeTrue();
                });
                it(`has minlength 8 validator`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.password)?.hasValidator(validators.minLength_8)).toBeTrue();
                });
            });
            describe(toTitleCase(FormControlNames.authForm.rememberMe), () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.rememberMe)).toExist();
                });
                it(`has inital value is false`, () =>
                {
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.rememberMe)?.value).toBeFalse();
                });

            });
            it("returns undefined if the loginForm is invalid", () =>
            {
                spectator.component.loginForm.get(FormControlNames.authForm.email)?.setValue(null);
                spectator.component.loginForm.get(FormControlNames.authForm.password)?.setValue("fdfdfd");
                spectator.detectChanges();
                expect(spectator.component.Login()).toBe(undefined);
            });
        });
        describe("Html template input elements validation", () =>
        {
            describe(toTitleCase(FormControlNames.authForm.email), () =>
            {
                it(`exists`, () =>
                {
                    expect(emailInput).toBeTruthy();
                });
                it(`has type email`, () =>
                {
                    expect(emailInput?.type).toEqual(InputFieldTypes.email);
                });
                it(`has required attribute`, () =>
                {
                    expect(emailInput).toHaveAttribute(InputElementsAttributes.required);
                });
            });
            describe(toTitleCase(FormControlNames.authForm.password), () =>
            {
                it(`exists`, () =>
                {
                    expect(passwordInput).toBeTruthy();
                });
                it(`has type password`, () =>
                {
                    expect(passwordInput?.type).toEqual(InputFieldTypes.password);
                });
                it(`has required attribute`, () =>
                {
                    expect(passwordInput).toHaveAttribute(InputElementsAttributes.required);
                });
                it(`has minlength attribute with value = 8`, () =>
                {
                    expect(passwordInput).toHaveAttribute(InputElementsAttributes.minlength, '8');
                });
            });
        });
        describe("Login button", () =>
        {
            it('disable login button if loginForm is not valid', () =>
            {
                spectator.component.loginForm.get(FormControlNames.authForm.email)?.setValue(null);
                spectator.component.loginForm.get(FormControlNames.authForm.password)?.setValue("fdfdfd");
                spectator.detectChanges();
                expect(loginBtn).toBeDisabled();
            });
            it('enable login button if loginForm is valid valid', () =>
            {
                spectator.component.loginForm.get(FormControlNames.authForm.email)?.setValue("kyroluskamal@gmail.com");
                spectator.component.loginForm.get(FormControlNames.authForm.password)?.setValue("Kfdf@23256");
                spectator.detectChanges();
                expect(loginBtn).not.toBeDisabled();
            });
            it("disable login button when the form is valid and the user click the login button", () =>
            {
                spectator.component.loginForm.get(FormControlNames.authForm.email)?.setValue("kyroluskamal@gmail.com");
                spectator.component.loginForm.get(FormControlNames.authForm.password)?.setValue("Kfdf@23256");
                spectator.detectChanges();
                expect(loginBtn).not.toBeDisabled();
                loginBtn?.click();
                spectator.detectChanges();
                expect(loginBtn).toBeDisabled();
            });
        });
    });

    describe("Server Side Validation [Mocking]", () =>
    {
        describe("Login Form is valid", () =>
        {
            it("never shows validation errors", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(LoginFailure({ error: null, validationErrors: [] }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).not.toExist();
                }
            ));
            it("shows validation errors for email: [required] [Not valid]", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(LoginFailure({
                        error: null, validationErrors: [
                            { key: "Email", message: "The Email field is required" },
                            { key: "Email", message: "Please, enter a valid email" },
                        ]
                    }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).toExist();
                    let liElements: HTMLLIElement[] | null = spectator.queryAll("div li");
                    for (let li of liElements)
                    {
                        expect(li.innerHTML.toString()).toContainText(["Email", "required"]);
                        expect(li.innerHTML.toString()).toContainText(["Email", "Valid email"]);
                    }
                }
            ));
            it("shows validation errors for Password: [required]", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(LoginFailure({
                        error: null, validationErrors: [
                            { key: "Password", message: "The Password field is required" },
                            { key: "Password", message: "Please, enter a valid email" },
                        ]
                    }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).toExist();
                    let liElements: HTMLLIElement[] | null = spectator.queryAll("div li");
                    for (let li of liElements)
                    {
                        expect(li.innerHTML.toString()).toContainText(["Password", "required"]);
                    }
                }
            ));
        });
    });
});