﻿using AutoMapper;
using CodingBible.Data;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.MailService;
using CodingBible.Services.TokenService;
using CodingBible.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace CodingBible.Controllers.api.v1
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v1/[controller]")]
    [AutoValidateAntiforgeryToken]
    public class AccountController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IServiceProvider ServiceProvider;
        private readonly ApplicationDbContext ApplicationDbContext;
        private readonly IAuthService AuthService;
        private readonly ICookieServ CookieService;
        private readonly IEMailService MailService;
        private readonly ITokenServ TokenService;
        private readonly ApplicationUserManager UserManager;
        private readonly ApplicationUserRoleManager RoleManager;
        private readonly ApplicationUserSignIngManager SignInManager;
        private const string AccessToken = Constants.TokensName.Access_token;
        private const string User_Id = Constants.TokensName.User_id;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public AccountController(IServiceProvider serviceProvider, ApplicationDbContext applicationDbContext, IAuthService authService, ICookieServ cookieService, IMapper mapper, ApplicationUserManager userManager, ApplicationUserRoleManager roleManager, IEMailService emailService, ITokenServ tokenService, ApplicationUserSignIngManager signInManager, IHttpContextAccessor httpContextAccessor)
        {
            ServiceProvider = serviceProvider;
            ApplicationDbContext = applicationDbContext;
            AuthService = authService;
            CookieService = cookieService;
            Mapper = mapper;
            UserManager = userManager;
            RoleManager = roleManager;
            MailService = emailService;
            TokenService = tokenService;
            SignInManager = signInManager;
            _httpContextAccessor = httpContextAccessor;
        }
        /**************************************************************************************
         *                                  Login action
         * ************************************************************************************/
        [AllowAnonymous]
        [HttpPost(nameof(Login))]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var user = await UserManager.FindByEmailAsync(model.Email);
                    if (user == null)  {
                        /*****************************************************************
                         * 
                         *              Send email to the admin to tell him about that
                         * 
                         * ***************************************************************/
                        Log.Error("Error : Email not found in database");
                        return BadRequest(Constants.HttpResponses.NullUser_Error_Response());
                     }

                    //var res = await SignInManager.CheckPasswordSignInAsync(user, model.Password, model.RememberMe);
                    var roles = await UserManager.GetRolesAsync(user);
                    // Get the role of the user - validate if he is admin - dont bother to go ahead if returned false
                    
                    // If user is admin continue to execute the code
                    if (!await UserManager.CheckPasswordAsync(user, model.Password))
                    {
                        Log.Error("Error : Wrong password for {user}",model.Email);
                        return Unauthorized(Constants.HttpResponses.WrongPassword_Response());
                    }

                    // Then Check If Email Is confirmed
                    if (!await UserManager.IsEmailConfirmedAsync(user))
                    {
                        Log.Error("Error : Email Not Confirmed for {user}", user.UserName);
                        return Unauthorized(Constants.HttpResponses.EmailNotConfirmed_pleaseConfirm());
                    }

                    // Create & Return the access token which contains JWT and Refresh Token
                    user.RememberMe = model.RememberMe;
                    await UserManager.UpdateAsync(user);
                    var accessToken = await TokenService.GenerateNewToken(user, roles.ToList());

                    var expireTime = roles.Contains(Constants.Roles.admin)?TimeSpan.FromMinutes(180) : accessToken.Expiration;
                    // set cookie for jwt and refresh token
                    CookieService.setRequiredCookies(accessToken, user, roles.ToList(), expireTime, model.RememberMe);


                    //CookieService.SetCookie(Constants.CookieName.r, authToken.Username, expireTime);
                    Log.Information($"User {model.Email} logged in.");
                    user.PasswordHash = null;
                    user.SecurityStamp = null;
                    var data = new
                    {
                        user = user,
                        roles = roles,
                        tokenExpire = accessToken.RefreshTokenExpiration
                    };
                    return Ok(Constants.HttpResponses.Loggin_success(data));

                }
                catch (Exception ex)
                {
                    Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                       ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                }

            }

            Log.Error("ModelState error");
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }

        //[HttpGet(nameof(IsUserFoundByEmail))]
        //[AllowAnonymous]
        //public async Task<IActionResult> IsUserFoundByEmail([FromQuery]string email)
        //{
        //    if (email == "") return Ok();
        //    var user = await UserManager.FindByEmailAsync(email);
        //    return user==null?BadRequest(Constants.HttpResponses.NullUser_Error_Response()) :Ok();
        //}
        /**************************************************************************************
         *                                      Register action
         * ************************************************************************************/

        [AllowAnonymous]
        [HttpPost(nameof(Register))]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var newUser = Mapper.Map<ApplicationUser>(model);
                var result = await UserManager.CreateAsync(newUser, model.Password);

                if (result.Succeeded)
                {
                    if(!await RoleManager.RoleExistsAsync(Constants.Roles.Reader))
                    {
                        var newrole = new ApplicationUserRole(Constants.Roles.Reader);
                        newrole.RoleIcon = "";
                        newrole.IsActive = true;
                        newrole.NormalizedName = Constants.Roles.Reader.ToUpper();
                        newrole.Handle = Constants.Roles.Reader.ToLower();
                        await RoleManager.CreateAsync(newrole);
                    }
                    await UserManager.AddToRoleAsync(newUser, Constants.Roles.Reader);

                    var confirmationCode = await UserManager.GenerateEmailConfirmationTokenAsync(newUser);
                    confirmationCode = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationCode));
                    var param = new Dictionary<string, string>
                    {
                        {"token", confirmationCode },
                        {"email", model.Email }
                    };
                    var callbackUrl = QueryHelpers.AddQueryString(model.ClientUrl, param);
                    var MailRequest = new MailRequest
                    {
                        ToEmail = model.Email,
                        Subject = Constants.EmailSettings.ConfirmationEmailSubject,
                        Body = Constants.EmailSettings.ConfirmationEmail_Body(HtmlEncoder.Default.Encode(callbackUrl))
                    };

                    MailService.SendMail(MailRequest, await ApplicationDbContext.MailProviders.FirstOrDefaultAsync(x=>x.IsDefault==true));

                    return Ok(Constants.HttpResponses.RegisterResponse_Success());
                }
                return BadRequest(Constants.HttpResponses.IdentityRegults_Errors(result.Errors));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        /***********************************************************************************************
         *                                     Email Confirmation
         * *********************************************************************************************/
        [HttpGet(nameof(EmailConfirmation))]
        public async Task<IActionResult> EmailConfirmation([FromQuery] string token, [FromQuery] string email)
        {
            var user = await UserManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest(Constants.HttpResponses.NullUser_Error_Response());
            if (await UserManager.IsEmailConfirmedAsync(user))
                return BadRequest(Constants.HttpResponses.EmailAlreadyConfirmed_Error_Response());
            var tokenInBody = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            var confirmResult = await UserManager.ConfirmEmailAsync(user, tokenInBody);
            if (!confirmResult.Succeeded)
                return BadRequest(Constants.HttpResponses.IdentityRegults_Errors(confirmResult.Errors));
            return StatusCode(201);
        }
        /**************************************************************************************
         *                                       Forgetpassword
         * ************************************************************************************/
        [HttpPost(nameof(ForgetPassword))]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordModel model)
        {
            if (ModelState.IsValid) {
                try
                {
                    var user = await UserManager.FindByEmailAsync(model.Email);
                    if (user == null)
                        return BadRequest(Constants.HttpResponses.NullUser_Error_Response());
                    var code = await UserManager.GeneratePasswordResetTokenAsync(user);
                    code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    var param = new Dictionary<string, string>
                    {
                        {"token", code },
                        {"email", model.Email }
                    };
                    var callbackUrl = QueryHelpers.AddQueryString(model.ClientUrl, param);

                    var mailRequest = new MailRequest
                    {
                        ToEmail = model.Email,
                        Subject = Constants.EmailSettings.ResetPasswordEmailSubject,
                        Body = Constants.EmailSettings.ResetPasswordEmail_Body(HtmlEncoder.Default.Encode(callbackUrl))
                    };
                    MailService.SendMail(mailRequest, await ApplicationDbContext.MailProviders.FirstOrDefaultAsync(x => x.IsDefault == true));
                    return Ok(Constants.HttpResponses.ResetPasswordLink_Send_Success());
                }
                catch (Exception ex)
                {
                    Log.Error("An error occurred at ForgotPassword {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                    return BadRequest(Constants.HttpResponses.ResetPasswordLink_Send_ERROR());
                }
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        /**************************************************************************************
         *                                       Resetpassword
         * ************************************************************************************/
        [HttpPost(nameof(ResetPassword))]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var user = await UserManager.FindByEmailAsync(model.Email);
                    if (user == null)
                        return BadRequest(Constants.HttpResponses.NullUser_Error_Response());
                    var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
                    var confirmResult = await UserManager.ResetPasswordAsync(user, token, model.Password);
                    if (!confirmResult.Succeeded)
                        return BadRequest(Constants.HttpResponses.IdentityRegults_Errors(confirmResult.Errors));
                    return Ok(Constants.HttpResponses.ResetPassword_Success());
                }
                catch(Exception ex)
                {
                    Log.Error("An error occurred at RESET PASSWORD {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                    return BadRequest(Constants.HttpResponses.ResetPassword_ERROR());
                }
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        /**************************************************************************************
         *                                       IsLoggedIn
         * ************************************************************************************/
        [HttpGet(nameof(IsLoggedIn))]
        public async Task<bool> IsLoggedIn()
        {
            await Task.Delay(0);
            try
            {
                // Check if user is already logged in 
                if (Request.Cookies.ContainsKey(Constants.CookieName.Access_token)&& Request.Cookies.ContainsKey(Constants.CookieName.refreshToken)
                    && Request.Cookies.ContainsKey(Constants.CookieName.Username)&& Request.Cookies.ContainsKey(Constants.CookieName.User_id))
                {
                    var userName = CookieService.Get(Constants.CookieName.Username);
                    var user = await UserManager.FindByNameAsync(userName);
                    var roles = await UserManager.GetRolesAsync(user);
                    var userOldToken = await ApplicationDbContext.UserTokens.Where(x => x.UserId == user.Id).FirstOrDefaultAsync();
                    var tokenValidations = await TokenService.ValidateAuthTokenAsync(user, userOldToken, userName);

                     if(tokenValidations.IsValid && userOldToken.ExpiryTime > DateTime.Now)
                    {
                        return true;
                    }
                    else if((userOldToken.ExpiryTime<DateTime.Now || tokenValidations.Message == "Token Expired") &&
                        Constants.AppSettings.AllowSiteWideTokenRefresh)
                    {
                        var accessToken = await TokenService.RefreshToken(user, roles.ToList(), userOldToken);
                        var expireTime = roles.Contains(Constants.Roles.admin) ? TimeSpan.FromMinutes(180) : accessToken.Expiration;

                        // set cookie for jwt and refresh token
                        CookieService.setRequiredCookies(accessToken, user, roles.ToList(), expireTime, user.RememberMe);


                    }
                    CookieService.DeleteAllCookies();
                    return false;
                }
                CookieService.DeleteAllCookies();
                return false;
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred Checking if user IsLoggedIn  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                CookieService.DeleteAllCookies();
                return false;
            }

        }
        /**************************************************************************************
         *                                       Logout
         * ************************************************************************************/
        [HttpGet(nameof(Logout))]
        public async Task<bool> Logout()
        {
            try
            {
                var username = CookieService.Get(Constants.CookieName.Username);

                if (username != null)
                {
                    var user = await UserManager.FindByNameAsync(username);
                    var memberToken = await ApplicationDbContext.UserTokens.Where(x => x.UserId == user.Id).ToListAsync();

                    if (memberToken.Count > 0)
                    {
                        ApplicationDbContext.UserTokens.RemoveRange(memberToken);
                        await ApplicationDbContext.SaveChangesAsync();
                    }

                    CookieService.DeleteAllCookies();

                    return true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while Logging our {} {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
            CookieService.DeleteAllCookies();
            return false;
        }
    }
}
