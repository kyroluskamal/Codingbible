import { CommonModule, Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { fakeAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { NavigationEnd } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { Store } from "@ngrx/store";
import { AppModule } from "src/app/app.module";
import { FormControlNames, InputElementsAttributes, InputFieldTypes, validators } from "src/Helpers/constants";
import { CustomValidators } from "src/Helpers/custom-validators";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { ResetPasswordFailure } from "src/State/AuthState/auth.actions";
import { HomeComponent } from "../../home/home.component";
import { ResetPasswordComponent } from "./reset-password.component";

describe("RegisterComponent", () =>
{
    let emailInput: HTMLInputElement | null;
    let passwordInput: HTMLInputElement | null;
    let confirmpasswordInput: HTMLInputElement | null;
    let ResetPasswordBtn: HTMLButtonElement | null;
    let spectator: SpectatorRouting<ResetPasswordComponent>;
    const createComponent = createRoutingFactory({
        component: ResetPasswordComponent,
        declarations: [HomeComponent],
        imports: [AppModule, RouterTestingModule],
        providers: [FormBuilder, Store],
        mocks: [HttpClient],
        stubsEnabled: false,
        shallow: false
    });
    beforeEach(() =>
    {
        spectator = createComponent({
            detectChanges: true
        });
        spectator.component.ngOnInit();
        emailInput = <HTMLInputElement>spectatorSelectByControlName<ResetPasswordComponent>(spectator, FormControlNames.authForm.email);
        passwordInput = <HTMLInputElement>spectatorSelectByControlName<ResetPasswordComponent>(spectator, FormControlNames.authForm.password);
        confirmpasswordInput = <HTMLInputElement>spectatorSelectByControlName<ResetPasswordComponent>(spectator, FormControlNames.authForm.confirmpassword);

        ResetPasswordBtn = <HTMLButtonElement>spectator.query(byTestId('ResetPasswordBtn'));
    });
    describe("Client Side Validation", () =>
    {
        describe("Reset Form testing", () =>
        {
            describe(`${toTitleCase(FormControlNames.authForm.password)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.password)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.password)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has [password] pattern validators`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.password)?.hasValidator(validators.password!)).toBeTrue();
                });
                it(`has minlength 8 validator`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.password)?.hasValidator(validators.minLength_8)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.confirmpassword)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.confirmpassword)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.confirmpassword)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has minlength 8 validator`, () =>
                {
                    expect(spectator.component.Form.get(FormControlNames.authForm.confirmpassword)?.hasValidator(validators.minLength_8)).toBeTrue();
                });
            });
            it("has passwordMatchValidator", () =>
            {
                expect(spectator.component.Form.hasValidator(CustomValidators.passwordMatchValidator)).toBeTrue();
            });
        });
        describe("Html template input elements validation", () =>
        {
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
        describe("Reset Password button", () =>
        {
            it('disable Reset Password button if Form is not valid', () =>
            {
                spectator.component.Form.get(FormControlNames.authForm.password)?.setValue(null);
                spectator.component.Form.get(FormControlNames.authForm.confirmpassword)?.setValue("fdfdfd");
                spectator.detectChanges();
                expect(ResetPasswordBtn).toBeDisabled();
            });
            it('disable Reset Password button if email or token is not found in the link', () =>
            {
                spectator.component.Form.get(FormControlNames.authForm.password)?.setValue("fdfdF@2fdfdfd");
                spectator.component.Form.get(FormControlNames.authForm.confirmpassword)?.setValue("fdfdF@2fdfdfd");
                spectator.component.token = null;
                spectator.component.email = "Kyroluskamal@gjkjk.com";
                spectator.detectChanges();
                expect(spectator.component.Form.valid).toBeTrue();
                expect(ResetPasswordBtn).toBeDisabled();
            });
            it('enable Reset Password button if Form is valid and token and email are found', () =>
            {
                spectator.component.Form.get(FormControlNames.authForm.password)?.setValue("Kfdf@23256");
                spectator.component.Form.get(FormControlNames.authForm.confirmpassword)?.setValue("Kfdf@23256");
                spectator.component.token = "dfdfdfdfdfdfd";
                spectator.component.email = "Kyroluskamal@gjkjk.com";
                spectator.detectChanges();

                expect(ResetPasswordBtn).not.toBeDisabled();
            });
            it("disable Reset Password button when the form is valid and the user click the Reset Password button", () =>
            {
                spectator.component.token = "fsfsdfdsfsdfsdfsd";
                spectator.component.email = "kyroluskamal@gmail.com";
                spectator.component.Form.get(FormControlNames.authForm.password)?.setValue("Kfdf@23256");
                spectator.component.Form.get(FormControlNames.authForm.confirmpassword)?.setValue("Kfdf@23256");
                spectator.detectChanges();
                expect(ResetPasswordBtn).not.toBeDisabled();
                ResetPasswordBtn?.click();
                spectator.detectChanges();
                expect(ResetPasswordBtn).toBeDisabled();
            });
        });
        it("If email is not found redirect to home page", async () =>
        {
            spectator.component.token = "fdfdfdfdfdfdf";
            spectator.component.ngOnInit();
            await spectator.fixture.whenStable();
            expect(spectator.inject(Location).path()).toBe("/");
        });
        it("If Token is not found redirect to home page", async () =>
        {
            spectator.component.email = "kkfsdlj@fsfsd.com";
            spectator.component.ngOnInit();
            await spectator.fixture.whenStable();
            expect(spectator.inject(Location).path()).toBe("/");
        });
        it("returns undefined if the email, token and form is invalid", () =>
        {
            expect(spectator.component.OnSubmit()).toBe(undefined);
        });
    });

    describe("Server Side Validation [Mocking]", () =>
    {
        describe("Register Form is valid", () =>
        {
            it("never shows validation errors", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(ResetPasswordFailure({ error: null, validationErrors: [] }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).not.toExist();
                }
            ));
        });
        describe("Reset password Form is invalid", () =>
        {
            it("shows validation errors above form", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(ResetPasswordFailure({
                        error: null, validationErrors: [
                            { key: "Password", message: "The Password field is required" },
                        ]
                    }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).toExist();
                    let liElements: HTMLLIElement[] | null = spectator.queryAll("#invalidErrors li");
                    for (let li of liElements)
                    {
                        expect(li.innerHTML.toString()).toContainText(["Password", "required"]);
                    }
                }
            ));
        });
    });
});