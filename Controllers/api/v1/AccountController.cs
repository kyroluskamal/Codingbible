using AutoMapper;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.MailService;
using CodingBible.Services.TokenService;
using CodingBible.UnitOfWork;
using CodingBible.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Serilog;
using System.Text;
using System.Text.Encodings.Web;

namespace CodingBible.Controllers.api.v1
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IMapper Mapper;
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }

        private readonly ICookieServ CookieService;
        private readonly IEMailService MailService;
        private readonly ITokenServ TokenService;
        private readonly ApplicationUserManager UserManager;
        private readonly ApplicationUserRoleManager RoleManager;
        private readonly IFunctionalService FunctionalService;

        public AccountController(ICookieServ cookieService, IMapper mapper,
            ApplicationUserManager userManager,
            ApplicationUserRoleManager roleManager,
            IEMailService emailService,
            ITokenServ tokenService,
            IFunctionalService functionalService,
            IUnitOfWork_ApplicationUser unitOfWork)
        {
            CookieService = cookieService;
            Mapper = mapper;
            UserManager = userManager;
            RoleManager = roleManager;
            MailService = emailService;
            TokenService = tokenService;
            FunctionalService = functionalService;
            UnitOfWork = unitOfWork;
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
                var user = await UserManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
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
                    Log.Error("Error : Wrong password for {user}", model.Email);
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

                var expireTime = roles.Contains(Constants.Roles.admin) ? TimeSpan.FromMinutes(180) : accessToken.Expiration;
                // set cookie for jwt and refresh token
                CookieService.SetRequiredCookies(accessToken, user, roles.ToList(), expireTime, model.RememberMe);
                //CookieService.SetCookie(Constants.CookieName.r, authToken.Username, expireTime);
                Log.Information($"User {model.Email} logged in.");
                user.PasswordHash = null;
                user.SecurityStamp = null;
                var data = new
                {
                    user,
                    roles,
                    tokenExpire = accessToken.RefreshTokenExpiration
                };
                return Ok(Constants.HttpResponses.Loggin_success(data));
            }
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
                    if (!await RoleManager.RoleExistsAsync(Constants.Roles.Reader))
                    {
                        var newrole = new ApplicationUserRole(Constants.Roles.Reader)
                        {
                            RoleIcon = "",
                            IsActive = true,
                            NormalizedName = Constants.Roles.Reader.ToUpper(),
                            Handle = Constants.Roles.Reader.ToLower()
                        };
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

                    MailService.SendMail(MailRequest, await UnitOfWork.MailProviders.GetFirstOrDefaultAsync(x => x.IsDefault));

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
            try
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
                return Ok();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred at ForgotPassword {Error} {StackTrace} {InnerException} {Source}",
               ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return BadRequest(Constants.HttpResponses.EmailConfirmed_FAILED());
            }
        }
        /**************************************************************************************
         *                                       Forgetpassword
         * ************************************************************************************/
        [HttpPost(nameof(ForgetPassword))]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordModel model)
        {
            if (ModelState.IsValid)
            {
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
                    MailService.SendMail(mailRequest, await UnitOfWork.MailProviders.GetFirstOrDefaultAsync(x => x.IsDefault));
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
                catch (Exception ex)
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
                if (Request.Cookies.ContainsKey(Constants.CookieName.Access_token) && Request.Cookies.ContainsKey(Constants.CookieName.refreshToken)
                    && Request.Cookies.ContainsKey(Constants.CookieName.Username) && Request.Cookies.ContainsKey(Constants.CookieName.User_id))
                {
                    var userName = CookieService.Get(Constants.CookieName.Username);
                    var user = await UserManager.FindByNameAsync(userName);
                    var roles = await UserManager.GetRolesAsync(user);
                    var userOldToken = await UnitOfWork.UserTokens.GetFirstOrDefaultAsync(x => x.UserId == user.Id);
                    var tokenValidations = await TokenService.ValidateAuthTokenAsync(user, userOldToken, userName);

                    if (tokenValidations.IsValid && userOldToken.ExpiryTime > DateTime.Now)
                    {
                        return true;
                    }
                    else if ((userOldToken.ExpiryTime < DateTime.Now || tokenValidations.Message == "Token Expired") &&
                        Constants.AppSettings.AllowSiteWideTokenRefresh)
                    {
                        var accessToken = await TokenService.RefreshToken(user, roles.ToList(), userOldToken);
                        var expireTime = roles.Contains(Constants.Roles.admin) ? TimeSpan.FromMinutes(180) : accessToken.Expiration;
                        // set cookie for jwt and refresh token
                        CookieService.SetRequiredCookies(accessToken, user, roles.ToList(), expireTime, user.RememberMe);
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
        public async Task<IActionResult> Logout()
        {
            var result = await FunctionalService.Logout();
            return result ? StatusCode(250, result):StatusCode(450, result);
        }
    }
}
