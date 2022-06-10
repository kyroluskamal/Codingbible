import { Location } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserModule } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { byTestId, createRoutingFactory, Spectator } from "@ngneat/spectator";
import { Store, StoreModule } from "@ngrx/store";
import { MockService } from "ng-mocks";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { metaReducers } from "src/app/app.module";
import { ClientSideValidationService } from "src/CommonServices/client-side-validation.service";
import { FormControlNames, FormValidationErrorsNames, InputElementsAttributes, InputFieldTypes, validators } from "src/Helpers/constants";
import { CustomValidators } from "src/Helpers/custom-validators";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { AuthRoutes } from "src/Helpers/router-constants";
import { AppReducers } from "src/State/app.state";
import { RegisterFailure } from "src/State/AuthState/auth.actions";
import { RoutesForHomeModule } from "../../home-website-routing.module";
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

    const createComponent = createRoutingFactory({
        component: RegisterComponent,
        imports: [StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
            HttpClientModule, BrowserModule,
            MatFormFieldModule, MatCardModule, TooltipModule.forRoot(), MatInputModule,
        RouterTestingModule.withRoutes(RoutesForHomeModule), MatButtonModule
        ],
        providers: [FormBuilder, Store, HttpClient],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        mocks: [ClientSideValidationService],
        stubsEnabled: false,
        shallow: false
    });
    beforeEach(() =>
    {
        spectator = createComponent({
            detectChanges: false
        });
        spectator.component.ngOnInit();
        spectator.detectComponentChanges();
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
                it(`Set form invalid if email entered but not valid`, () =>
                {
                    let email = spectator.component.RegisterForm.get(FormControlNames.authForm.email);
                    spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.setValue("Kiko@2009");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kiko@2009");
                    email?.setValue("kflkdslkfls@fkl");
                    expect(email?.hasError(FormValidationErrorsNames.pattern)).toBeTrue();
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.errors).toBe(null);
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.errors).toBe(null);
                    expect(spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.errors).toBe(null);
                    expect(spectator.component.RegisterForm.hasError(FormValidationErrorsNames.password.NoPassswordMatch)).toBeFalse();
                    expect(spectator.component.RegisterForm.invalid).toBeTrue();
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
                it(`Set form invalid if password lessthan 8`, () =>
                {
                    let password = spectator.component.RegisterForm.get(FormControlNames.authForm.password);
                    spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("Kiko@gmail.com");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                    password?.setValue("Kiko@22");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kiko@22");
                    expect(password?.hasError(FormValidationErrorsNames.password.hasNumber)).toBeFalse();
                    expect(password?.hasError(FormValidationErrorsNames.password.hasCapitalCase)).toBeFalse();
                    expect(password?.hasError(FormValidationErrorsNames.password.hasSmallCase)).toBeFalse();
                    expect(password?.hasError(FormValidationErrorsNames.password.hasSpecialCharacters)).toBeFalse();
                    expect(password?.hasError(FormValidationErrorsNames.minlength)).toBeTrue();
                    expect(spectator.component.RegisterForm.invalid).toBeTrue();
                });
                describe("Check password validation requirements", () =>
                {
                    it("has hasNumber Error", () =>
                    {
                        let password = spectator.component.RegisterForm.get(FormControlNames.authForm.password);
                        spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("Kiko@gmail.com");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                        password?.setValue("Kiko@fffff");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kiko@fffff");
                        expect(password?.hasError(FormValidationErrorsNames.password.hasNumber)).toBeTrue();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasCapitalCase)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSmallCase)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSpecialCharacters)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.minlength)).toBeFalse();
                        expect(spectator.component.RegisterForm.invalid).toBeTrue();
                    });
                    it("has hasCapitalCase Error", () =>
                    {
                        let password = spectator.component.RegisterForm.get(FormControlNames.authForm.password);
                        spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("Kiko@gmail.com");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                        password?.setValue("kiko@2009");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("kiko@2009");
                        expect(password?.hasError(FormValidationErrorsNames.password.hasNumber)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasCapitalCase)).toBeTrue();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSmallCase)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSpecialCharacters)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.minlength)).toBeFalse();
                        expect(spectator.component.RegisterForm.invalid).toBeTrue();
                    });
                    it("has hasSmallCase Error", () =>
                    {
                        let password = spectator.component.RegisterForm.get(FormControlNames.authForm.password);
                        spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("Kiko@gmail.com");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                        password?.setValue("KIKO@2009");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("KIKO@2009");

                        expect(password?.hasError(FormValidationErrorsNames.password.hasNumber)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasCapitalCase)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSmallCase)).toBeTrue();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSpecialCharacters)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.minlength)).toBeFalse();
                        expect(spectator.component.RegisterForm.invalid).toBeTrue();
                    });
                    it("has hasSpecialCharacters Error", () =>
                    {
                        let password = spectator.component.RegisterForm.get(FormControlNames.authForm.password);
                        spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("Kiko@gmail.com");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                        password?.setValue("Kiko2009");
                        spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kiko2009");

                        expect(password?.hasError(FormValidationErrorsNames.password.hasNumber)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasCapitalCase)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSmallCase)).toBeFalse();
                        expect(password?.hasError(FormValidationErrorsNames.password.hasSpecialCharacters)).toBeTrue();
                        expect(password?.hasError(FormValidationErrorsNames.minlength)).toBeFalse();
                        expect(spectator.component.RegisterForm.invalid).toBeTrue();
                    });
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
                it("has NoPasswordMatch error if all formControls are valid but passsword and confirmed password are not the same", () =>
                {
                    spectator.component.RegisterForm.get(FormControlNames.authForm.password)?.setValue("Kiko@2009");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.email)?.setValue("Kiko@gmail.com");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.firstname)?.setValue("dfdfdfdfdfdf");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.lastname)?.setValue("dsdsdsdsdsdsds");
                    spectator.component.RegisterForm.get(FormControlNames.authForm.confirmpassword)?.setValue("Kiko@ff2009");
                    expect(spectator.component.RegisterForm.hasError(FormValidationErrorsNames.password.NoPassswordMatch)).toBeTrue();
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
                spectator.detectComponentChanges();
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
                spectator.detectComponentChanges();
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
                spectator.detectComponentChanges();
                expect(registerBtn).not.toBeDisabled();
                registerBtn?.click();
                spectator.detectComponentChanges();
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
                    spectator.detectComponentChanges();
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
                    spectator.detectComponentChanges();
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

    describe("Login link", () =>
    {
        describe("If ShowCardFooter = false", () =>
        {
            let Login_CardFooterFalse: HTMLAnchorElement | null;
            let spCloseDialog: jasmine.Spy;

            beforeEach(() =>
            {
                spectator.component.ShowCardFooter = false;
                spectator.detectComponentChanges();
                Login_CardFooterFalse = spectator.query<HTMLAnchorElement>(byTestId("Login_CardFooterFalse"));
            });
            it("exists", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    expect(Login_CardFooterFalse).toExist();
                }
            ));
            it("call close dialog after [Login] is clicked", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    spectator.click(byTestId("Login_CardFooterFalse"));
                    expect(spCloseDialog).toHaveBeenCalled();
                }
            ));
            it("open login link after [Login] is clicked", async () =>
            {
                spectator.click(byTestId("Login_CardFooterFalse"));
                await spectator.fixture.whenStable();
                expect(spectator.inject(Location).path()).toBe(`/${AuthRoutes.Login}`);
            });
        });
        describe("If ShowCardFooter = true", () =>
        {
            let Login_CardFooterTrue: HTMLAnchorElement | null;
            let spCloseDialog: jasmine.Spy;
            let spOpenLogin: jasmine.Spy;
            beforeAll(() =>
            {
                spectator.component.ShowCardFooter = true;
                spectator.detectComponentChanges();
                Login_CardFooterTrue = spectator.query<HTMLAnchorElement>(byTestId("Login_CardFooterTrue"));
            });
            it("Join now link is found", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    expect(Login_CardFooterTrue).toExist();
                }
            ));
            it("click Login and call dialogHandler.CloseDialog then dialogHandler.OpenLogin", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    spectator.click(byTestId("Login_CardFooterTrue"));
                    expect(spCloseDialog).toHaveBeenCalledBefore(spOpenLogin);
                }
            ));
        });
    });
    describe("Close button", () =>
    {
        describe("If CloseIconHide = true", () =>
        {
            it("does not exists", fakeAsync(
                () =>
                {
                    spectator.component.CloseIconHide = true;
                    spectator.detectComponentChanges();
                    spectator.tick(1000);
                    let closeBtn = spectator.query<HTMLButtonElement>(byTestId("closeBtn"));
                    expect(closeBtn).not.toExist();
                }
            ));
        });
        describe("If CloseIconHide = false", () =>
        {
            let closeBtn: HTMLButtonElement | null;
            let spCloseDialog: jasmine.Spy;
            beforeAll(() =>
            {
                spectator.component.CloseIconHide = false;
                spectator.detectComponentChanges();
                closeBtn = spectator.query<HTMLButtonElement>(byTestId("closeBtn"));
            });
            it("exists", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    expect(closeBtn).toExist();
                }
            ));
            it("click the login dialog if the close button is clicked", fakeAsync(
                () =>
                {
                    spectator.tick(1000);
                    spectator.click(byTestId("closeBtn"));
                    expect(spCloseDialog).toHaveBeenCalled();
                }
            ));
        });
    });
});


