using CodingBible.Models;
using CodingBible.Data;
using Serilog;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using Microsoft.EntityFrameworkCore;
using CodingBible.UnitOfWork;

namespace CodingBible.Services.FunctionalService
{
    public class FunctionalService : IFunctionalService
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationUserRoleManager RoleManager;
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }

        private ICookieServ CookieService{get;}

        public FunctionalService(ApplicationUserManager userManager, ApplicationUserRoleManager roleManager, ICookieServ cookieService, IUnitOfWork_ApplicationUser unitOfWork)
        {
            _userManager = userManager;
            RoleManager = roleManager;
            CookieService = cookieService;
            UnitOfWork = unitOfWork;
        }

        public async Task CreateDefaultAdminUser()
        {
            try
            {
                var adminUser = new ApplicationUser
                {
                    Email = "kyroluskamal@gmail.com",
                    UserName = "kyroluskamal",
                    EmailConfirmed = true,
                    PhoneNumber = "1234567890",
                    PhoneNumberConfirmed = true,
                    Firstname = "Kyrolus",
                    Lastname = "Fahim",
                    IsActive = true,
                };

                var result = await _userManager.CreateAsync(adminUser, "Kiko@2009");

                if (result.Succeeded)
                {
                    if (!await RoleManager.RoleExistsAsync(Constants.Roles.admin))
                    {
                        var adminRole = new ApplicationUserRole(Constants.Roles.admin);
                        adminRole.NormalizedName = Constants.Roles.admin.ToUpper();
                        adminRole.Handle = Constants.Roles.admin.ToLower();
                        adminRole.RoleIcon = "/uploads/roles/icons/default/role.png";
                        adminRole.IsActive = true;
                        await RoleManager.CreateAsync(adminRole);
                    }
                    var u = await _userManager.FindByEmailAsync(adminUser.Email);
                    if(u!=null)
                        await _userManager.AddToRoleAsync(u, Constants.Roles.admin);
                    Log.Information("Admin User Created {UserName}", adminUser.UserName);
                }
                else
                {
                    var errorString = string.Join(",", result.Errors);
                    Log.Error("Error while creating user {Error}", errorString);
                }
            }
            catch (Exception ex)
            {
                Log.Error("Error while creating user {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
        }
        public async Task<bool> Logout()
        {
            try
            {
                var username = CookieService.Get(Constants.CookieName.Username);

                if (username != null)
                {
                    var user = await _userManager.FindByNameAsync(username);
                    var memberToken = await UnitOfWork.UserTokens.GetAllAsync(x => x.UserId == user.Id);

                    if (memberToken.ToList().Count > 0)
                    {
                        UnitOfWork.UserTokens.RemoveRange(memberToken);
                        await UnitOfWork.SaveAsync();
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
