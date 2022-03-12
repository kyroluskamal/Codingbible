import { HttpClient } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { byTestId, createRoutingFactory, Spectator } from "@ngneat/spectator";
import { Store, StoreModule } from "@ngrx/store";
import { MockService } from "ng-mocks";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { AppModule, metaReducers } from "src/app/app.module";
import { ClientSideValidationService } from "src/CommonServices/client-side-validation.service";
import { DialogHandlerService } from "src/CommonServices/dialog-handler.service";
import { FormControlNames, InputElementsAttributes, InputFieldTypes, validators } from "src/Helpers/constants";
import { CustomValidators } from "src/Helpers/custom-validators";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { AppReducers } from "src/State/app.state";
import { RegisterFailure } from "src/State/AuthState/auth.actions";
import { RegisterComponent } from "./register.component";

describe("RegisterComponent", () =>
{
    let emailInput: HTMLInputElement | null;
    let passwordInput: HTMLInputElement | null;
    let confirmpasswordInput: HTMLInputElement | null;
    let firstNameInput: HTMLInputElement | null;
    let lastNameInput: HTMLInputElement | null;
    let userNameInput: HTMLInputElement | null;
    let registerBtn: HTMLInputElement | null;
    let spectator: Spectator<RegisterComponent>;
    let DialogMocks = MockService(DialogHandlerService);

    const createComponent = createRoutingFactory({
        component: RegisterComponent,
        imports: [StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
            MatFormFieldModule, MatCardModule, TooltipModule.forRoot(), MatInputModule],
        providers: [FormBuilder, Store, HttpClient, { provide: DialogHandlerService, useValue: DialogMocks }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        mocks: [ClientSideValidationService],
        shallow: false
    });
    beforeEach(() =>
    {
        spectator = createComponent({
            detectChanges: true
        });
        spectator.component.ngOnInit();
        emailInput = <HTMLInputElement>spectatorSelectByControlName<RegisterComponent>(spectator, FormControlNames.authForm.email);
        passwordInput = <HTMLInputElement>spectatorSelectByControlName<RegisterComponent>(spectator, FormControlNames.authForm.password);
        confirmpasswordInput = <HTMLInputElement>spectatorSelectByControlName<RegisterComponent>(spectator, FormControlNames.authForm.confirmpassword);
        firstNameInput = <HTMLInputElement>spectatorSelectByControlName<RegisterComponent>(spectator, FormControlNames.authForm.firstname);
        lastNameInput = <HTMLInputElement>spectatorSelectByControlName<RegisterComponent>(spectator, FormControlNames.authForm.lastname);
        userNameInput = <HTMLInputElement>spectatorSelectByControlName<RegisterComponent>(spectator, FormControlNames.authForm.username);
        registerBtn = spectator.query(byTestId('registerBtn'));
    });
    describe("Client Side Validation", () =>
    {
        describe("RegisterFrom testing", () =>
        {
            describe(`${toTitleCase(FormControlNames.authForm.email)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.email)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has email pattern validator`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.hasValidator(validators.email)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.password)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.password)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has [password] pattern validators`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.hasValidator(validators.password!)).toBeTrue();
                });
                it(`has minlength 8 validator`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.hasValidator(validators.PASSWORD_MIN_LENGTH)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.confirmpassword)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has minlength 8 validator`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.hasValidator(validators.PASSWORD_MIN_LENGTH)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.firstname)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.hasValidator(validators.required)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.lastname)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.hasValidator(validators.required)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.authForm.username)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.username)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.username)?.hasValidator(validators.required)).toBeTrue();
                });
            });
            it("has passwordMatchValidator", () =>
            {
                expect(spectator.component.RegisterForm.hasValidator(CustomValidators.passwordMatchValidator)).toBeTrue();
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
            describe(toTitleCase(FormControlNames.authForm.confirmpassword), () =>
            {
                it(`exists`, () =>
                {
                    expect(confirmpasswordInput).toBeTruthy();
                });
                it(`has type password`, () =>
                {
                    expect(confirmpasswordInput?.type).toEqual(InputFieldTypes.password);
                });
                it(`has required attribute`, () =>
                {
                    expect(confirmpasswordInput).toHaveAttribute(InputElementsAttributes.required);
                });
                it(`has minlength attribute with value = 8`, () =>
                {
                    expect(confirmpasswordInput).toHaveAttribute(InputElementsAttributes.minlength, '8');
                });
            });
            describe(toTitleCase(FormControlNames.authForm.firstname), () =>
            {
                it(`exists`, () =>
                {
                    expect(firstNameInput).toBeTruthy();
                });
                it(`has type password`, () =>
                {
                    expect(firstNameInput?.type).toEqual(InputFieldTypes.text);
                });
                it(`has required attribute`, () =>
                {
                    expect(firstNameInput).toHaveAttribute(InputElementsAttributes.required);
                });
            });
            describe(toTitleCase(FormControlNames.authForm.lastname), () =>
            {
                it(`exists`, () =>
                {
                    expect(lastNameInput).toBeTruthy();
                });
                it(`has type password`, () =>
                {
                    expect(lastNameInput?.type).toEqual(InputFieldTypes.text);
                });
                it(`has required attribute`, () =>
                {
                    expect(lastNameInput).toHaveAttribute(InputElementsAttributes.required);
                });
            });
            describe(toTitleCase(FormControlNames.authForm.username), () =>
            {
                it(`exists`, () =>
                {
                    expect(userNameInput).toBeTruthy();
                });
                it(`has type password`, () =>
                {
                    expect(userNameInput?.type).toEqual(InputFieldTypes.text);
                });
                it(`has required attribute`, () =>
                {
                    expect(userNameInput).toHaveAttribute(InputElementsAttributes.required);
                });
            });
        });
        describe("Register button", () =>
        {
            it('disable Register button if RegisterForm is not valid', () =>
            {
                spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue(null);
                spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.setValue("fdfdfd");
                spectator.detectChanges();
                expect(registerBtn).toBeDisabled();
            });
            it('enable Register button if RegisterForm is valid valid', () =>
            {
                spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("kyroluskamal@gmail.com");
                spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.setValue("Kfdf@23256");
                spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("fdfdfdfd");
                spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("fdfdfdfdfd");
                spectator.component.RegisterForm.get(FormControlNames.authForm.username)?.setValue("registerBtn");
                spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kfdf@23256");
                spectator.detectChanges();
                expect(registerBtn).not.toBeDisabled();
            });
            it("disable Register button when the form is valid and the user click the Register button", () =>
            {
                spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("kyroluskamal@gmail.com");
                spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.setValue("Kfdf@23256");
                spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("fdfdfdfd");
                spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("fdfdfdfdfd");
                spectator.component.RegisterForm.get(FormControlNames.authForm.username)?.setValue("registerBtn");
                spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kfdf@23256");
                spectator.detectChanges();
                expect(registerBtn).not.toBeDisabled();
                registerBtn?.click();
                spectator.detectChanges();
                expect(registerBtn).toBeDisabled();
            });
        });
    });

    describe("Server Side Validation [Integration test with NGRX store]", () =>
    {
        describe("Register Form is valid", () =>
        {
            it("never shows validation errors", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(RegisterFailure({ error: null, validationErrors: [] }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).not.toExist();
                }
            ));
        });
        describe("Register Form is invalid", () =>
        {
            it("shows validation errors above form", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(RegisterFailure({
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
        });
    });
});


