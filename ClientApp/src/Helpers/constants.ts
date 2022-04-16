import { Validators } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { CustomValidators } from "./custom-validators";

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
    RememberMe: "Remember me",
    Send: "Send",
    ResetPassword: "Reset password"
};

export const FormErrors = {
    NoMatchedData_inSelection: "No matched data found"
};
/****************************************************************************************
 *                                          CSS                                     
 ****************************************************************************************/
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
    calibri_font: "calibri-font",
    Dashboard: {
        SidNav: {
            fullOpend: "SideNav-FullOpened",
            halfClosed: "SideNav-HalfClosed",
            content: {
                ltr: {
                    pinned: "mat-sidenav-content-pin-LTR",
                    nonPinned: "mat-sidenav-content-nonPinned-LTR"
                },
                rtl: {
                    pinned: "mat-sidenav-content-pin-RTL",
                    nonPinned: "mat-sidenav-content-nonPinned-RTL"
                }
            }
        }
    }
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
        Logged_In_Success: "You successfully logged in",
        Addition: (type: string) => `${type} is added successfully`,
        Delete: (type: string) => `${type} is deleted successfully`,
        Update: (type: string) => `${type} is updated successfully`,
    },
    Error: {
        Unique_Field_ERROR: "You can't repeat values in this field. Add UNIQUE value.",
        ResetPasswordFail_InvalidToken: "This reset link is used before, or the token expired. Try to reset password again",
        BrowserDontSupportFullscreen: "Your browser doesn't support fullscreen mode. Use latest version of Chrome.",
        Addition: (type: string) => `Failed to add ${type}`,

        Delete: (type: string) => `Failed to delete ${type}`,
        Update: (type: string) => `Failed to Update ${type}`
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
    authForm: {
        rememberMe: "rememberme",
        password: "password",
        email: "email",
        phonenumber: "phonenumber",
        username: "username",
        confirmpassword: "confirmpassword",
        firstname: "firstname",
        lastname: "lastname",
    },
    postForm: {
        title: "title",
        slug: "slug",
        htmlContent: "htmlcontent",
        description: "description",
        excerpt: "excerpt",
        featureimageurl: "featureimageurl",
        categories: "categories",
    },
    AddEditCategoryForm: {
        name: "name",
        title: "title",
        slug: "slug",
        description: "description"
    },
    categoryForm: {
        name: "name",
        title: "title",
        slug: "slug",
        description: "description",
        parentkey: "parentkey"
    },
    mediaForm: {
        title: "title",
        description: "description",
        caption: "caption",
        alttext: "alttext",
    }
};

export const FormFieldsNames = {
    authForm: {
        Email: "Email",
        Passowrd: "Password",
        RememberMe: "Remember Me",
        PhoneNumber: "Phone Number",
        Username: "Username",
        ConfirmPassword: "Confirm password",
        FirstName: "First name",
        LastName: "Last name"
    },
    Post: {
        title: "Title",
        slug: "Sulg",
        excerpt: "Excerpt"
    },
    Category: {
        name: "Name",
        title: "Title",
        slug: "Slug",
        description: "Description",
        parentkey: "Parent"
    },
    Media: {
        title: "Title",
        description: "Description",
        caption: "Caption",
        alttext: "Alt Text",
        url: "Url"
    }
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
    },
    SEO_Title_Length: "Title length must be between 60 and 70 characters",
    SEO_Description_Length: "Description length must be between 50 and 160 characters",
};

export const FormValidationErrorsNames = {
    email: "email",
    required: "required",
    pattern: "pattern",
    minlength: "minlength",
    maxlength: "maxlength",
    min: "min",
    max: "max",
    password: {
        hasSmallCase: "hasSmallCase",
        minLength: "minlength",
        hasSpecialCharacters: "hasSpecialCharacters",
        hasCapitalCase: "hasCapitalCase",
        hasNumber: "hasNumber",
        NoPassswordMatch: "NoPassswordMatch"
    }
};

export const LocalStorageKeys = {
    isLoggedIn: "isLoggedIn",
    FixedSidnav: "FixedSidnav "
};
export const CookieNames = {
    XSRF_TOKEN: "XSRF-TOKEN",
    TwoFactorToken: "twoFactorToken",
    MemberId: "memberId",
    RememberDevice: "rememberDevice",
    User_id: "user_id",
    Access_token: "access_token",
    userRole: "userRole",
    Username: "username",
    refreshToken: "refreshToken",
    loginStatus: "loginStatus",
    refershTokenExpire: "refershTokenExpire",
};
export const InputFieldTypes =
{
    text: "text",
    email: "email",
    password: "password",
    checkbox: "checkbox"
};
//#region Form Appearnce
/************************************************************************
 *                      Form Appearance
 ************************************************************************/
const outlineFormAppearance: MatFormFieldAppearance = "outline";
const fillFormAppearance: MatFormFieldAppearance = "fill";

export const defaultFormAppearance = fillFormAppearance;
//#endregion

export const ConstRegex =
{
    PhoneRegex: new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    EmailRegex: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
};

export const AuthConstants = {
    email: "email",
    token: "token"
};

export const HTTPResponseStatus = {
    identityErrors: "identityErrors"
};

export function ClientUrl(url: string): string
{
    return "https://" + window.location.host + "/" + url;
}
export const PostType = {
    Add: "Add",
    Edit: "Edit"
};
//#region
/************************************************************************
 *                          State mangement constants                   *
 ************************************************************************/
export const actionNames = {
    AuthenticationActions: {
        Login: '[Login Page] Login request',
        InProgress: '[Auth] InProgress',
        LoginSuccess: '[Auth API] Login Success',
        LoginFailure: '[Auth API] Login Failure',
        Register: '[Register Page] Register request',
        RegisterSuccess: '[Auth API] Register Success',
        RegisterFailure: '[Auth API] Register Failure',
        IsLoggedIn: '[Auth API] IsLoggedIn',
        IsLoggedInSuccess: '[Auth API] IsLoggedInSuccess',
        ForgetPassword: '[ForgetPassword] request',
        ForgetPasswordSuccess: '[Auth API] ForgetPassword Success',
        ForgetPasswordFailure: '[Auth API] ForgetPassword Failure',
        ResetPassword: '[ResetPassword] request',
        ResetPasswordSuccess: '[Auth API] ResetPassword Success',
        ResetPasswordFailure: '[Auth API] ResetPassword Failure',
        LoginValidationErrors: '[Auth API] Login Validation errors',
        SetValidationErrors: '[Auth API] Set Validation errors',
        CheckLoginOnServer: '[Auth] Check Login',
        Logout: '[Auth] Confirm Logout',
        LogoutCancelled: '[Auth] Logout Cancelled',
        LogoutConfirmed: '[Auth] Logout Confirmed',
    },
    PostActions: {
        ADD_POST: '[ADD POST] Request',
        ADD_POST_Success: '[ADD POST] SUCCESS',
        ADD_POST_Failed: '[ADD POST] FAILED',
        GetPostById: '[GetPostById] request',
        GetPostById_Success: '[GetPostById] Sucess',
        GetPostById_Failed: '[GetPostBy_Slug] Failed',
        ChangeStatus: '[ChangeStatus] request',
        ChangeStatus_Success: '[ChangeStatus] Sucess',
        ChangeStatus_Failed: '[ChangeStatus] Failed',
        GetPostBy_Slug: '[GetPostById] request',
        GetPostBy_Slug_Success: '[GetPostBy_Slug] Sucess',
        GetPostBy_Slug_Failed: '[GetPostBy_Slug] Failed',
        UPDATE_POST: '[Update POST] Request',
        UPDATE_POST_Sucess: '[Update POST] Sucess',
        UPDATE_POST_Failed: '[Update POST] Failed',
        REMOVE_POST: '[Delete POST] Request',
        REMOVE_POST_Success: '[Delete POST] Sucess',
        REMOVE_POST_Failed: '[Delete POST] Failed',
        REMOVE_POSTS: '[POST] Remove POSTs',
        LOAD_ALL_POSTS: '[POST] Load All POSTs',
        LOAD_ALL_POSTS_SUCCESS: '[Load POSTs] Success',
        LOAD_ALL_POSTS_FAILED: '[Load POSTs] FAILED',
        Set_ValidationErrors: '[POST] Set Validation Errors',
    },
    designActions: {
        pinned: '[Pinnded menu]'
    },
    categoryActions: {
        ADD_CATEGORY: '[Add CATEGORY] Request',
        ADD_CATEGORY_Success: '[Add CATEGORY] SUCCESS',
        ADD_CATEGORY_Failed: '[Add CATEGORY] FAILED',
        UPDATE_CATEGORY: '[Update CATEGORY] Request',
        UPDATE_CATEGORY_Success: '[Update CATEGORY] SUCCESS',
        UPDATE_CATEGORY_Failed: '[Update CATEGORY] FAILED',
        REMOVE_CATEGORY: '[Delete CATEGORY] Request',
        REMOVE_CATEGORY_Success: '[Delete CATEGORY] SUCCESS',
        REMOVE_CATEGORY_Failed: '[Delete CATEGORY] FAILED',
        LOAD_ALL_CATEGORIES: '[CATEGORY] Load All CATEGORIES',
        LOAD_ALL_CATEGORIES_SUCCESS: '[Load CATEGORIES] Success',
        LOAD_ALL_CATEGORIES_FAILED: '[Load CATEGORIES] FAILED',
        GetCategoryById: '[GetCategoryById] request',
        GetCategoryById_Success: '[GetCategoryById] Sucess',
        GetCategoryById_Failed: '[GetCategoryBy_Slug] Failed',
    },
    AttactmentActions: {
        ADD_ATTACHMENT: '[Add Attachment] Request',
        ADD_ATTACHMENT_Success: '[Add Attachment] SUCCESS',
        ADD_ATTACHMENT_Failed: '[Add Attachment] FAILED',
        UPDATE_ATTACHMENT: '[Update Attachment] Request',
        UPDATE_ATTACHMENT_Success: '[Update Attachment] SUCCESS',
        UPDATE_ATTACHMENT_Failed: '[Update Attachment] FAILED',
        REMOVE_ATTACHMENT: '[Delete Attachment] Request',
        REMOVE_ATTACHMENT_Success: '[Delete Attachment] SUCCESS',
        REMOVE_ATTACHMENT_Failed: '[Delete Attachment] FAILED',
        LOAD_ALL_ATTACHMENTS: '[Attachment] Load All Attachments',
        LOAD_ALL_ATTACHMENTS_SUCCESS: '[Load Attachments] Success',
        LOAD_ALL_ATTACHMENTS_FAILED: '[Load Attachments] FAILED',
        SelectAttachment: '[Select Attachment] Request',
        UpdateTempAttachment: '[Update Temp Attachment]',
        UpdateResponseMessage: '[Update Response Message]',
        checkSelectedFile: '[Check Selected File]',
    }
};

//#endregion
//#region Validators
export const PASSWORD_MINLENGTH = 8;
export const SEO_TITLE_MIN_LENGTH = 60;
export const SEO_TITLE_MAX_LENGTH = 70;
export const SEO_DESCRIPTION_MIN_LENGTH = 50;
export const SEO_DESCRIPTION_MAX_LENGTH = 160;
export const validators = {
    required: Validators.required,
    PASSWORD_MIN_LENGTH: Validators.minLength(PASSWORD_MINLENGTH),
    SEO_TITLE_MIN_LENGTH: Validators.minLength(SEO_TITLE_MIN_LENGTH),
    SEO_TITLE_MAX_LENGTH: Validators.maxLength(SEO_TITLE_MAX_LENGTH),
    SEO_DESCRIPTION_MIN_LENGTH: Validators.minLength(SEO_DESCRIPTION_MIN_LENGTH),
    SEO_DESCRIPTION_MAX_LENGTH: Validators.maxLength(SEO_DESCRIPTION_MAX_LENGTH),
    password: Validators.compose([
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { hasSpecialCharacters: true })]),
    email: Validators.pattern(ConstRegex.EmailRegex)
};
//#endregion

export const InputElementsAttributes = {
    required: "required",
    minlength: "minlength",
    maxlength: "maxlength",
    min: "min",
    max: "max"
};
