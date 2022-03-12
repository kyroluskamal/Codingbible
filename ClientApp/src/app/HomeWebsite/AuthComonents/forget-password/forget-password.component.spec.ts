import { HttpClient } from "@angular/common/http";
import { fakeAsync } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { Store } from "@ngrx/store";
import { AppModule } from "src/app/app.module";
import { FormControlNames, InputElementsAttributes, InputFieldTypes, validators } from "src/Helpers/constants";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { ForgetPasswordFailure } from "src/State/AuthState/auth.actions";
import { ForgetPasswordComponent } from "./forget-password.component";

describe("ForgetPasswordComponent [Unit Test]", () =>
{
    let emailInput: HTMLInputElement | null;
    let SendBtn: HTMLButtonElement | null;
    let spectator: SpectatorRouting<ForgetPasswordComponent>;
    const createComponent = createRoutingFactory({
        component: ForgetPasswordComponent,
        imports: [AppModule],
        providers: [FormBuilder, Store, HttpClient],
        shallow: false
    });
    beforeEach(() =>
    {
        spectator = createComponent({
            detectChanges: true
        });
        spectator.component.ngOnInit();
        emailInput = <HTMLInputElement>spectatorSelectByControlName<ForgetPasswordComponent>(spectator, FormControlNames.authForm.email);

        SendBtn = spectator.query(byTestId('SendBtn'));
    });
    describe("Client Side Validation", () =>
    {
        describe("ForgetPassworForm testing", () =>
        {
            describe(`${toTitleCase(FormControlNames.authForm.email)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has email pattern validator`, () =>
                {
                    expect(spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)?.hasValidator(validators.email)).toBeTrue();
                });
            });
            it("returns undefined if the ForgetPassworForm is invalid", () =>
            {
                spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)?.setValue(null);
                spectator.detectChanges();
                expect(spectator.component.OnSubmit()).toBe(undefined);
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
        });
        describe("Send button", () =>
        {
            it('disable Send button if ForgetPassworForm is not valid', () =>
            {
                spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)?.setValue(null);
                spectator.detectChanges();
                expect(SendBtn).toBeDisabled();
            });
            it('enable login button if ForgetPassworForm is valid valid', () =>
            {
                spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)?.setValue("kyroluskamal@gmail.com");
                spectator.detectChanges();
                expect(SendBtn).not.toBeDisabled();
            });
            it("disable login button when the form is valid and the user click the login button", () =>
            {
                spectator.component.ForgetPassworForm.get(FormControlNames.authForm.email)?.setValue("kyroluskamal@gmail.com");
                spectator.detectChanges();
                expect(SendBtn).not.toBeDisabled();
                SendBtn?.click();
                spectator.detectChanges();
                expect(SendBtn).toBeDisabled();
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
                    spectator.component.store.dispatch(ForgetPasswordFailure({ error: null, validationErrors: [] }));
                    spectator.tick(1000);
                    spectator.detectChanges();
                    let invalidErrors: HTMLDivElement | null = spectator.query(byTestId('invalidErrors'));
                    expect(invalidErrors).not.toExist();
                }
            ));
            it("shows validation errors for email: [required] [Not valid]", fakeAsync(
                () =>
                {
                    spectator.component.store.dispatch(ForgetPasswordFailure({
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