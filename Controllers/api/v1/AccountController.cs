using AutoMapper;
using CodingBible.Data;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.MailService;
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
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace CodingBible.Controllers.api.v1
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IMapper Mapper;
        private readonly IServiceProvider ServiceProvider;
        private readonly ApplicationDbContext ApplicationDbContext;
        private readonly IAuthService AuthService;
        private readonly ICookieServ CookieService;
        private readonly IEMailService MailService;
        private readonly ApplicationUserManager UserManager;
        private readonly ApplicationUserRoleManager RoleManager;
        private const string AccessToken = Constants.TokensName.Access_token;
        private const string User_Id = Constants.TokensName.User_id;
        string[] cookiesToDelete = { Constants.CookieName.TwoFactorToken,
            Constants.CookieName.MemberId, Constants.CookieName.RememberDevice, 
            Constants.CookieName.User_id, Constants.CookieName.Access_token};
        public AccountController(IServiceProvider serviceProvider, ApplicationDbContext applicationDbContext, IAuthService authService, ICookieServ cookieService, IMapper mapper, ApplicationUserManager userManager, ApplicationUserRoleManager roleManager, IEMailService emailService)
        {
            ServiceProvider = serviceProvider;
            ApplicationDbContext = applicationDbContext;
            AuthService = authService;
            CookieService = cookieService;
            Mapper = mapper;
            UserManager = userManager;
            RoleManager = roleManager;
            MailService = emailService;
        }

        [AllowAnonymous]
        [HttpPost(nameof(Login))]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var jwtToken = await AuthService.Auth(model);
                    const int expireTime = 60; // set the value to 60 - as dont want the admin cookie to stay in browser for longer

                    CookieService.SetCookie(Constants.CookieName.Access_token, jwtToken.Token, expireTime);
                    CookieService.SetCookie(Constants.CookieName.User_id, jwtToken.UserId, expireTime);
                    CookieService.SetCookie(Constants.CookieName.Username, jwtToken.Username, expireTime);
                    Log.Information($"User {model.Email} logged in.");

                    return Ok(new {status="LoginSuccess", message="You logged in successfully"});

                }
                catch (Exception ex)
                {
                    Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                       ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                }

            }

            ModelState.AddModelError("", "Invalid Username/Password was entered");

            Log.Error("Invalid Username/Password was entered");

            return Unauthorized("Please Check the Login Credentials - Invalid Username/Password was entered");

        }

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
                        await RoleManager.CreateAsync(new ApplicationUserRole(Constants.Roles.Reader));
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

        [AllowAnonymous]
        [HttpPost(nameof(IsLoggedIn))]
        public async Task<bool> IsLoggedIn()
        {
            await Task.Delay(0);
            try
            {
                // Check if user is already logged in 
                if (!Request.Cookies.ContainsKey(AccessToken) || !Request.Cookies.ContainsKey(User_Id))
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return true;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userId = CookieService.Get(Constants.CookieName.User_id);

                if (userId != null)
                {
                    var protectorProvider = ServiceProvider.GetService<IDataProtectionProvider>();
                    var protector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);
                    var unprotectedToken = protector.Unprotect(userId);

                    var rt = ApplicationDbContext.UserTokens.FirstOrDefault(t => t.UserId.ToString() == unprotectedToken);

                    // First remove the Token
                    if (rt != null) ApplicationDbContext.UserTokens.Remove(rt);
                    await ApplicationDbContext.SaveChangesAsync();

                    // Second remove all Cookies              
                    CookieService.DeleteAllCookies(cookiesToDelete);
                }

            }
            catch (Exception ex)
            {
                CookieService.DeleteAllCookies(cookiesToDelete);
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            //Log.Information("User logged out.");
            return RedirectToLocal(null);
        }
        private IActionResult RedirectToLocal(string returnUrl)
        {
            return Ok();
            // Preventing open redirect attack
            //return Url.IsLocalUrl(returnUrl)
            //    ? (IActionResult)Redirect(returnUrl)
            //    : RedirectToAction(nameof(HomeController.Index), "Home");
        }
    }
}
