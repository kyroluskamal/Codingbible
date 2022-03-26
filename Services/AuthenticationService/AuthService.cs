using CodingBible.Models;
using CodingBible.Services.CookieService;
using CodingBible.Services.TokenService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Identity;
using Serilog;

namespace CodingBible.Services.AuthenticationService
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> UserManager;
        private readonly ICookieServ CookieServ;
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        //private readonly IServiceProvider Provider;
        //private IDataProtector Protector;

        public AuthService(UserManager<ApplicationUser> userManager,

            ICookieServ cookieServ, IUnitOfWork_ApplicationUser unitOfWork)
        {
            UserManager = userManager;
            CookieServ = cookieServ;
            UnitOfWork = unitOfWork;
        }

        // Will be used for authenticating the Admin
        //public async Task<TokenResponseModel> Auth(LoginViewModel model)
        //{
        //    ActivityModel activityModel = new ActivityModel();
        //    activityModel.Date = DateTime.UtcNow;
        //    activityModel.IpAddress = CookieServ.GetUserIP();
        //    activityModel.Location = CookieServ.GetUserCountry();
        //    activityModel.OperatingSystem = CookieServ.GetUserOS();

        //    try
        //    {
        //        // Get the User from Database
        //        var user = await UserManager.FindByEmailAsync(model.Email);

        //        if (user == null) return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);

        //        // Get the role of the user - validate if he is admin - dont bother to go ahead if returned false
        //        if (await UserManager.IsInRoleAsync(user, Constants.Roles.admin))
        //        {
        //            /****** You can send email that Admin is logged in ******/
        //            activityModel.UserId = user.Id;
        //            activityModel.Type = "Amin login";
        //            activityModel.Icon = "fas fa-user-secret";
        //            activityModel.Color = "danger";
        //            await ActivityServ.AddUserActivity(activityModel);
        //            Log.Information("Admin is logged in");
        //            return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
        //        }

        //        // If user is admin continue to execute the code
        //        if (!await UserManager.CheckPasswordAsync(user, model.Password))
        //        {
        //            activityModel.UserId = user.Id;
        //            activityModel.Type = "Login attempt failed";
        //            activityModel.Icon = "far fa-times-circle";
        //            activityModel.Color = "danger";
        //            await ActivityServ.AddUserActivity(activityModel);
        //            Log.Error("Error : Invalid Password for Admin");
        //            return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
        //        }

        //        // Then Check If Email Is confirmed
        //        if (!await UserManager.IsEmailConfirmedAsync(user))
        //        {
        //            activityModel.Type = "Login attempt Success - Email Not Verified";
        //            activityModel.UserId = user.Id;
        //            activityModel.Icon = "far fa-envelope";
        //            activityModel.Color = "warning";
        //            await ActivityServ.AddUserActivity(activityModel);
        //            Log.Error("Error : Email Not Confirmed for {user}", user.UserName);
        //            return TokenService.CreateErrorResponseToken("Email Not Confirmed", HttpStatusCode.BadRequest);
        //        }

        //        activityModel.UserId = user.Id;
        //        activityModel.Type = "Login attempt successful";
        //        activityModel.Icon = "fas fa-thumbs-up";
        //        activityModel.Color = "success";
        //        await ActivityServ.AddUserActivity(activityModel);
        //        var authToken = await TokenService.GenerateNewToken(user);
        //        return authToken;
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
        //           ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
        //    }

        //    return TokenService.CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
        //}

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
                    var memberToken = await UnitOfWork.UserTokens.GetAllAsync(x => x.UserId == user.Id);

                    if (memberToken.ToList().Count > 0)
                    {
                        UnitOfWork.UserTokens.RemoveRange(memberToken);
                        await UnitOfWork.SaveAsync();
                    }

                    CookieServ.DeleteAllCookies();

                    return true;
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
            CookieServ.DeleteAllCookies();
            return false;
        }
    }
}
