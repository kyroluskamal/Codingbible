import { MatFormFieldAppearance } from "@angular/material/form-field";

export const FormConstants = {
    Search: "Search",
    Delete: "Delete",
    Close: "Close",
    change_image: "Change Image",
    Found: "Found",
    Results: "results",
    Add: "Add",
    Edit: "Edit",
    PlaceHolders: {
        Search_table: "Search Table",
        emailExample: "ex: Jhon@gmail.com"
    },
    JoinNow: "Join now",
    DontHaveAccount: "Don't have Account?",
    Login: "Login",
    Register: "Register",
    AlreadyHaveAccount: "Already have account?",
    RememberMe: "Remember me"
};

export const FormErrors = {
    NoMatchedData_inSelection: "No matched data found"
};

export const css = {
    blue: "",
    red: "",
    green: "",
    LightRowSelection: "LightRowSelection",
    table_outer_container: "table-outer-container",
    SwalHtmlContent: "SwalHtmlContent",
    SwalWarningTitle: "SwalWarningTitle",
    SwalErrorTitle: "SwalErrorTitle",
    Width100: "Width100",
    calibri_font: "calibri-font"
};

export const ToolTip = {
    Delete: "Delete",
    Edit: "Edit"
};

export const Keys = {
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown"
};

export const AnimationClasses = {
    BounceUp: "BounceUp",
    FadeUp: "FadeUp"
};

export const NotificationMessage = {
    Success: {
        DataAddtionStatus_Success: "Data is added successfully",
        Data_SAVED_success: "Data is saved successfully",
        Logged_In_Success: "You successfully logged in"
    },
    Error: {
        Unique_Field_ERROR: "You can't repeat values in this field. Add UNIQUE value."
    }
};

export const sweetAlert = {
    Title: {
        Error: "Error",
        Warning: "Warning"
    },
    ButtonText: {
        OK: "OK",
        Cancenl: "Cancel",
        Confirm: "Confirm"
    }
};

export const FormControlNames = {
    rememberMe: "rememberme",
    password: "password",
    email: "email",
    phonenumber: "phonenumber",
    username: "username",
    confirmpassword: "confirmpassword",
    firstname: "firstname",
    lastname: "lastname"
};

export const FormFieldsNames = {
    Email: "Email",
    Passowrd: "Password",
    RememberMe: "Remember Me",
    PhoneNumber: "Phone Number",
    Username: "Username",
    ConfirmPassword: "Confirm password",
    FirstName: "First name",
    LastName: "Last name"
};
export const FormValidationErrors = {
    PleaseCorrectErrors: "Please, correct the following errors",
    EnterValidEmail: "Please, enter a valid email",
    RequiredField: "This field is required",
    Password: {
        minLength: "At least 8 characters",
        hasSpecialCharacters: "At least one special character",
        hasSmallCase: "At least one small case letter",
        hasCapitalCase: "At least one capital letter",
        hasNumber: "At least one number",
        NoPassswordMatch: "Both passwords are not matching."
    }

};
export const FormValidationErrorsNames = {
    email: "email",
    required: "required",
    pattern: "pattern",
    password: {
        hasSmallCase: "hasSmallCase",
        minLength: "minlength",
        hasSpecialCharacters: "hasSpecialCharacters",
        hasCapitalCase: "hasCapitalCase",
        hasNumber: "hasNumber",
        NoPassswordMatch: "NoPassswordMatch"
    }
};

export const InputFieldTypes =
{
    text: "text",
    email: "email",
    password: "password",
    checkbox: "checkbox"
};

export class FormFiledAppearance
{
    outline: MatFormFieldAppearance = "outline";
    fill: MatFormFieldAppearance = "fill";
};

export const ConstRegex =
{
    PhoneRegex: new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    EmailRegex: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
};