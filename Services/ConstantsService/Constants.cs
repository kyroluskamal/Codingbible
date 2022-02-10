using CodingBible.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CodingBible.Services.ConstantsService
{
    public static class Constants
    {
        public static class Roles
        {
            public const string admin = "Administrator";
            public const string Participant = "Participant";
            public const string Reader = "Reader";
        }

        public static class AppSettings
        {
            public const string Site = "http://coding-bible.com";
            public const string Audience = "http://coding-bible.com";
            public const string ExpireTime = "60";
            public const string RtExpireTime = "120";
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



        public static class IdentityDefaultOptions {
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
            public const string Username = "username";
        }

        public static class TokensName
        {
            public const string User_id = "user_id";
            public const string Access_token = "access_token";
        }

        public static class EmailSettings
        {
            public const string ConfirmationEmailSubject = "Confirm your email";
            public static string ConfirmationEmail_Body(string emailbody)
            {
                return $"Please confirm your account by <a href='{emailbody}'>clicking here</a>.";
            }
        }
        
        public static class AuthenticationSchemes
        {
            public const string Admin = "Admin";
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
                return new HttpResponsesObject("Wrong email", "There is no user registered with this email");
            }
            public static object EmailAlreadyConfirmed_Error_Response()
            {
                return new HttpResponsesObject("EMAIL_ALREADY_CONFIRMED", "This email is already confirmed");
            }
            public static object EmailConfirmed_Success()
            {
                return new HttpResponsesObject("EMAIL_CONFIRM_SUCCESS", "Email is confirmed successfully");
            }
            public static object WrongPassword_Response()
            {
                return new HttpResponsesObject("Wrong Password", "Correct email, but Wrong password.");
            }
            public static object EmailNotConfirmed_pleaseConfirm()
            {
                return new HttpResponsesObject("Email not confirmed", "Please, check your email. Check spam if you don't find it in the inbex.");
            }
            public static object Loggin_success()
            {
                return new HttpResponsesObject("LOGGIN_SUCCESS", "You logged in successfully");
            }
        }
    }
}
