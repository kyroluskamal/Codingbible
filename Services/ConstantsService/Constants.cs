using CodingBible.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CodingBible.Services.ConstantsService
{
    public static class Constants
    {
        public enum PostStatus
        {
            Draft = 0,
            Published = 1,
            Deleted = 2
        }
        public enum DifficultyLevel
        {
            Beginner = 0,
            Intermediate = 1,
            Advanced = 2,
            Expert = 3,
            AllLevels = 6
        }
        public static class Roles
        {
            public const string admin = "Administrator";
            public const string Participant = "Participant";
            public const string Reader = "Reader";
        }
        public const string imageExtensions = "jpg, jpeg, png, gif, bmp, webp, tiff";
        public static class AppSettings
        {
            public const string Site = "localhost:5001";
            public const string Audience = "localhost:5001";
            public const string ExpireTime = "180";
            public const string RtExpireTime = "240";
            public const string Secret = "tq4btuyjvF7QyX%m-*DW+weK&38RW?S!f#xW36gzC3CmXxQX_PVqBvx+_Mr2t=xqHYQW+PNYen8uteDfe@LNv_4My@U$CCrYqEhhGW%VFe#C!e&q4_4hZE!rj";
            public const bool ValidateIssuerSigningKey = true;
            public const bool ValidateIssuer = true;
            public const bool ValidateAudience = true;
            public const string ClientId = "uR5qSVy5czvamqcHeE?$#Hk%vQ+YdCZxVf?9ND&pSuF4m7FyjMe8*6F_FaF-+Az^u$UJmDy%-kDgXmyjvWVnGM7LjK*wfV95jr3!kDNmW!vP6yeCXgc-czfH_";
            public const bool AllowSiteWideTokenRefresh = true;
        }

        public static class DataProtectionKeys
        {
            public const string ApplicationUserKey = "mY@c3vvxYfFa8YT__XQ@R";
        }

        public static class IdentityDefaultOptions
        {
            /*---------------------------------------------------------------------------------------------------*/
            /*                              Password Properties                                                  */
            /*---------------------------------------------------------------------------------------------------*/
            public const bool PasswordRequireDigit = true;
            public const int PasswordRequiredLength = 6;
            public const bool PasswordRequireNonAlphanumeric = true;
            public const bool PasswordRequireUppercase = true;
            public const bool PasswordRequireLowercase = true;
            public const int PasswordRequiredUniqueChars = 0;
            /*---------------------------------------------------------------------------------------------------*/
            /*                              Lockout Properties                                                   */
            /*---------------------------------------------------------------------------------------------------*/
            public const double LockoutDefaultLockoutTimeSpanInMinutes = 30;
            public const int LockoutMaxFailedAccessAttempts = 5;
            public const bool LockoutAllowedForNewUsers = false;
            /*---------------------------------------------------------------------------------------------------*/
            /*                              User Properties                                                      */
            /*---------------------------------------------------------------------------------------------------*/
            public const bool UserRequireUniqueEmail = true;
            public const bool SignInRequireConfirmedEmail = false;
            public const string AccessDeniedPath = "/Admin/Account/Login";
        }

        public static class CookieName
        {
            public const string TwoFactorToken = "twoFactorToken";
            public const string MemberId = "memberId";
            public const string RememberDevice = "rememberDevice";
            public const string User_id = "user_id";
            public const string Access_token = "access_token";
            public const string userRole = "userRole";
            public const string Username = "username";
            public const string refreshToken = "refreshToken";
            public const string loginStatus = "loginStatus";
            public const string refershTokenExpire = "refershTokenExpire";
        }

        public static class TokensName
        {
            public const string User_id = "user_id";
            public const string Access_token = "access_token";
        }

        public static class EmailSettings
        {
            public const string ConfirmationEmailSubject = "Confirm your email";
            public const string ResetPasswordEmailSubject = "Reset Password";
            public static string ConfirmationEmail_Body(string emailbody)
            {
                return $"Please confirm your account by <a href='{emailbody}'>clicking here</a>.";
            }
            public static string ResetPasswordEmail_Body(string emailbody)
            {
                return $"To reset your password <a href='{emailbody}'>clicking here</a>.";
            }
        }
        public static class AuthenticationSchemes
        {
            public const string Admin = "Admin";
        }

        public static class DataAnotationErrorMessages
        {
            public const string Email_notValid = "Please, Enter a valid email";
            public const string Password_notValid = "Please, Enter a valid password";
            public const string Confirm_Password_error = "Password and confirmed password don't match";
            public const string Field_required_error = "This field is required";
            public const string PasswordMinLength_Error = "Enter 8 character at least";
            public const string SEO_Title_length = "Title should be between 60 to 70 characters";
            public const string SEO_Description_length = "Description should be between 50 to 160 characters";
            public static string RangeError(int min, int max)
            {
                return $"Enter from {min} to {max}";
            }
            public static string MinStringLength(int min)
            {
                return $"Enter {min} characters at least";
            }
        }
        public static string Join(string separator, string[] arrytoJoin)
        {
            string finalString = "";
            foreach (var item in arrytoJoin)
            {
                finalString += item + separator;
            }
            return finalString[0..finalString.IndexOf(separator)];
        }
        public static class HttpResponses
        {
            public static object RegisterResponse_Success()
            {
                return new HttpResponsesObject("success", "Your account is registered seccuessfully. Please confirm your email.");
            }
            public static object ModelState_Errors(ModelStateDictionary ModelState)
            {
                return new HttpResponsesObject("ModelStateErrors", ModelState);
            }
            public static object IdentityRegults_Errors(IEnumerable<IdentityError> errors)
            {
                return new HttpResponsesObject("identityErrors", errors);
            }
            public static object NullUser_Error_Response()
            {
                return new HttpResponsesObject("Wrong email", "There is no user registered with this email.");
            }
            public static object EmailAlreadyConfirmed_Error_Response()
            {
                return new HttpResponsesObject("EMAIL_ALREADY_CONFIRMED", "This email is already confirmed.");
            }
            public static object EmailConfirmed_Success()
            {
                return new HttpResponsesObject("EMAIL_CONFIRM_SUCCESS", "Email is confirmed successfully.");
            }
            public static object EmailConfirmed_FAILED()
            {
                return new HttpResponsesObject("EMAIL_CONFIRM_FAILED", "Email confirmation failed.");
            }
            public static object WrongPassword_Response()
            {
                return new HttpResponsesObject("Wrong Password", "Correct email, but Wrong password.");
            }
            public static object EmailNotConfirmed_pleaseConfirm()
            {
                return new HttpResponsesObject("Email not confirmed", "Please, check your email. Check spam if you don't find it in the inbex.");
            }
            public static object Loggin_success(dynamic data)
            {
                return new HttpResponsesObject("LOGGIN_SUCCESS", "You logged in successfully.", data);
            }
            public static object ResetPasswordLink_Send_Success()
            {
                return new HttpResponsesObject("RESET_PASSWORD_LINK_SEND_SUCCESS", "Reset password link is send successfully. Please, check your email.");
            }
            public static object ResetPasswordLink_Send_ERROR()
            {
                return new HttpResponsesObject("RESET_PASSWORD_LINK_SEND_failed", "Failed to send Reset password link. Please, try again.");
            }
            public static object ResetPassword_ERROR()
            {
                return new HttpResponsesObject("RESET_PASSWORD_ERROR", "Failed to reset password.");
            }
            public static object ResetPassword_Success()
            {
                return new HttpResponsesObject("RESET_PASSWORD_Sucess", "Password is reset successfully.");
            }
            public static object Addition_Failed(string op)
            {
                return new HttpResponsesObject("ADDITION_FAILED", $"{op} addition failed.");
            }
            public static object Update_Failed(string op)
            {
                return new HttpResponsesObject("UPDATE_FAILED", $"{op} update failed.");
            }
            public static object Update_Sucess(string op, dynamic data = null)
            {
                return new HttpResponsesObject("UPDATE_SUCCESS", $"{op} update success.", data);
            }
            public static object Delete_Failed(string op)
            {
                return new HttpResponsesObject("DELETE_FAILED", $"{op} deletion is failed.");
            }
            public static object Delete_Sucess(string op)
            {
                return new HttpResponsesObject("DELETE_SUCCESS", $"{op} Deletion is succeeded.");
            }
            public static object NotUnique_ERROR_Response(string prop)
            {
                return new HttpResponsesObject($"{prop}", $"{prop} should be unique.");
            }
            public static object NotFound_ERROR_Response(string name)
            {
                return new HttpResponsesObject("NOTFOUND", $"{name} is not Found.");
            }
            public static object Already_Exists_ERROR_Response(string name)
            {
                return new HttpResponsesObject("ALREADY_EXIST", $"{name} is already exosts.");
            }
        }
    }
}
