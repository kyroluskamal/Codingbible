using CodingBible.Data;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ActivityService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.ViewModels;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using Serilog;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CodingBible.Services.TokenService;

namespace CodingBible.Services.AuthenticationService
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ApplicationDbContext ApplicationDbContext;
        private readonly ICookieServ CookieServ;
        //private readonly IServiceProvider Provider;
        private readonly IActivityServ ActivityServ;
        private readonly ITokenServ TokenService;
        //private IDataProtector Protector;
        private string[] UserRoles = new[] { Constants.Roles.admin, Constants.Roles.Reader };
        private TokenValidationParameters validationParameters;
        private JwtSecurityTokenHandler handler;
        private string unProtectedToken;
        private ClaimsPrincipal validateToken;

        public AuthService(UserManager<ApplicationUser> userManager,
            ApplicationDbContext applicationDbContext,
            ICookieServ cookieServ, IActivityServ activityServ, ITokenServ tokenService)
        {
            UserManager = userManager;
            ApplicationDbContext = applicationDbContext;
            CookieServ = cookieServ;

            ActivityServ = activityServ;
            TokenService = tokenService;
        }

        // These method will be called by Client or application Users => Angular/REST API app
        public async Task<TokenResponseModel> Auth(TokenRequestModel model)
        {
            // We will return Generic 500 HTTP Server Status Error
            // If we receive an invalid payload
            if (model == null)
            {
                return TokenService.CreateErrorResponseToken("Model State is Invalid", HttpStatusCode.InternalServerError);
            }

            switch (model.GrantType)
            {
                case "password":
                    return await TokenService.GenerateNewToken(model);
                case "refresh_token":
                    return await TokenService.RefreshToken(model);
                default:
                    // not supported - return a HTTP 401 (Unauthorized)
                    return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
            }
        }

        // Will be used for authenticating the Admin
        public async Task<TokenResponseModel> Auth(LoginViewModel model)
        {
            ActivityModel activityModel = new ActivityModel();
            activityModel.Date = DateTime.UtcNow;
            activityModel.IpAddress = CookieServ.GetUserIP();
            activityModel.Location = CookieServ.GetUserCountry();
            activityModel.OperatingSystem = CookieServ.GetUserOS();

            try
            {
                // Get the User from Database
                var user = await UserManager.FindByEmailAsync(model.Email);

                if (user == null) return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);

                // Get the role of the user - validate if he is admin - dont bother to go ahead if returned false


                if (await UserManager.IsInRoleAsync(user, Constants.Roles.admin))
                {
                    /****** You can send email that Admin is logged in ******/
                    activityModel.UserId = user.Id;
                    activityModel.Type = "Amin login";
                    activityModel.Icon = "fas fa-user-secret";
                    activityModel.Color = "danger";
                    await ActivityServ.AddUserActivity(activityModel);
                    Log.Information("Admin is logged in");
                    return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
                }

                // If user is admin continue to execute the code
                if (!await UserManager.CheckPasswordAsync(user, model.Password))
                {
                    activityModel.UserId = user.Id;
                    activityModel.Type = "Login attempt failed";
                    activityModel.Icon = "far fa-times-circle";
                    activityModel.Color = "danger";
                    await ActivityServ.AddUserActivity(activityModel);
                    Log.Error("Error : Invalid Password for Admin");
                    return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
                }

                // Then Check If Email Is confirmed
                if (!await UserManager.IsEmailConfirmedAsync(user))
                {
                    activityModel.Type = "Login attempt Success - Email Not Verified";
                    activityModel.UserId = user.Id;
                    activityModel.Icon = "far fa-envelope";
                    activityModel.Color = "warning";
                    await ActivityServ.AddUserActivity(activityModel);
                    Log.Error("Error : Email Not Confirmed for {user}", user.UserName);
                    return TokenService.CreateErrorResponseToken("Email Not Confirmed", HttpStatusCode.BadRequest);
                }

                activityModel.UserId = user.Id;
                activityModel.Type = "Login attempt successful";
                activityModel.Icon = "fas fa-thumbs-up";
                activityModel.Color = "success";
                await ActivityServ.AddUserActivity(activityModel);
                var authToken = await TokenService.GenerateNewToken(user, model);
                return authToken;
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
        }

        public async Task<bool> LogoutUserAsync()
        {
            var cookiesToDelete = new[]
            {
                "twoFactorToken",
                "memberId",
                "rememberDevice",
                "access_token",
                "loginStatus",
                "refreshToken",
                "userRole",
                "username",
                "user_id"
            };

            try
            {
                var username = CookieServ.Get("username");

                if (username != null)
                {
                    var user = await UserManager.FindByNameAsync(username);
                    var memberToken = await ApplicationDbContext.UserTokens.Where(x => x.UserId == user.Id).ToListAsync();

                    if (memberToken.Count > 0)
                    {
                        ApplicationDbContext.UserTokens.RemoveRange(memberToken);
                        await ApplicationDbContext.SaveChangesAsync();
                    }

                    CookieServ.DeleteAllCookies(cookiesToDelete);

                    return true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
            CookieServ.DeleteAllCookies(cookiesToDelete);
            return false;
        }
    }
}
