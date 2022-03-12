import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterTestingModule } from "@angular/router/testing";
import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { Store, StoreModule } from "@ngrx/store";
import { MockService } from "ng-mocks";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { metaReducers } from "src/app/app.module";
import { DialogHandlerService } from "src/CommonServices/dialog-handler.service";
import { FormControlNames, InputElementsAttributes, InputFieldTypes, validators } from "src/Helpers/constants";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { AuthRoutes } from "src/Helpers/router-constants";
import { AppReducers } from "src/State/app.state";
import { LoginFailure } from "src/State/AuthState/auth.actions";
import { RoutesForHomeModule } from "../../home-website-routing.module";
import { LoginComponent } from "./login.component";

describe("LoginComponent [Unit test]", () =>
{
    let emailInput: HTMLInputElement | null;
    let passwordInput: HTMLInputElement | null;
    let loginBtn: HTMLButtonElement | null;
    let spectator: SpectatorRouting<LoginComponent>;
    let DialogMocks = MockService(DialogHandlerService);
    const createComponent = createRoutingFactory({
        component: LoginComponent,
        imports: [StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
            MatFormFieldModule, MatCardModule, TooltipModule.forRoot(), MatInputModule, RouterTestingModule.withRoutes(RoutesForHomeModule)],
        providers: [FormBuilder, Store, HttpClient, { provide: DialogHandlerService, useValue: DialogMocks }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        stubsEnabled: false,
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
                    expect(spectator.component.loginForm.get(FormControlNames.authForm.password)?.hasValidator(validators.PASSWORD_MIN_LENGTH)).toBeTrue();
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
            it('enable login button if loginForm is valid', () =>
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

    describe("Server Side Validation [Integration test with NGRX store]", () =>
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
    describe("forget password link [Integration test with DialogHandlerService]", () =>
    {
        let forgetPassword: HTMLElement | null;
        let spCloseDialog: jasmine.Spy;
        let spOpenForgetPassword: jasmine.Spy;

        beforeEach(() =>
        {
            spOpenForgetPassword = spyOn(DialogMocks, "OpenForgetPassword");
            spCloseDialog = spyOn(DialogMocks, "CloseDialog");
            forgetPassword = spectator.query(byTestId("forgetpass"));
        });
        it("finds forgetPassword link", () =>
        {
            expect(forgetPassword).toExist();
        });
        it("close dialog is called after forget password is clicked", () =>
        {
            spectator.click(byTestId("forgetpass"));
            expect(spCloseDialog).toHaveBeenCalled();
        });
        it("openForgetPasswordDialog is called after forget password is clicked", () =>
        {
            spectator.click(byTestId("forgetpass"));
            expect(spOpenForgetPassword).toHaveBeenCalled();
        });
    });
    describe("Join now link", () =>
    {
        describe("If ShowCardFooter = false", () =>
        {
            let joinNow_CardFooterFalse: HTMLAnchorElement | null;
            let spCloseDialog: jasmine.Spy;

            beforeEach(() =>
            {
                spectator.component.ShowCardFooter = false;
                spectator.detectChanges();
                spCloseDialog = spyOn(DialogMocks, "CloseDialog");
                joinNow_CardFooterFalse = spectator.query<HTMLAnchorElement>(byTestId("joinNow_CardFooterFalse"));
            });
            it("exists", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    expect(joinNow_CardFooterFalse).toExist();
                }
            ));
            it("close dialog is called after [join now] is clicked", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    spectator.click(byTestId("joinNow_CardFooterFalse"));
                    expect(spCloseDialog).toHaveBeenCalled();
                }
            ));
            it("login link is opened after [join now] is clicked", async () =>
            {
                spectator.click(byTestId("joinNow_CardFooterFalse"));
                await spectator.fixture.whenStable();
                expect(spectator.inject(Location).path()).toBe(`/${AuthRoutes.Register}`);
            });
        });
        describe("If ShowCardFooter = true", () =>
        {
            let joinNow_CardFooterTrue: HTMLAnchorElement | null;
            let spCloseDialog: jasmine.Spy;
            let spOpenRegister: jasmine.Spy;
            beforeAll(() =>
            {
                spectator.component.ShowCardFooter = true;
                spectator.detectChanges();
                spCloseDialog = spyOn(spectator.component.dialogHandler, "CloseDialog");
                spOpenRegister = spyOn(spectator.component.dialogHandler, "OpenRegister");
                joinNow_CardFooterTrue = spectator.query<HTMLAnchorElement>(byTestId("joinNow_CardFooterTrue"));
            });
            it("Join now link is found", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    console.log(spectator.component.ShowCardFooter);
                    expect(joinNow_CardFooterTrue).toExist();
                }
            ));
            it("click join now and call dialogHandler.CloseDialog then dialogHandler.OpenRegister", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    spectator.click(byTestId("joinNow_CardFooterTrue"));
                    expect(spCloseDialog).toHaveBeenCalledBefore(spOpenRegister);
                }
            ));
        });
    });
});