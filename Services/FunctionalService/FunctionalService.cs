using CodingBible.Models;
using CodingBible.Data;
using Serilog;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using Microsoft.EntityFrameworkCore;

namespace CodingBible.Services.FunctionalService
{
    public class FunctionalService : IFunctionalService
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationUserRoleManager RoleManager;
        private ApplicationDbContext Db{get;}
        private ICookieServ CookieService{get;}

        public FunctionalService(ApplicationUserManager userManager, ApplicationUserRoleManager roleManager, ICookieServ cookieService, ApplicationDbContext db)
        {
            _userManager = userManager;
            RoleManager = roleManager;
            CookieService = cookieService;
            Db = db;
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
                    var memberToken = await Db.UserTokens.Where(x => x.UserId == user.Id).ToListAsync();

                    if (memberToken.Count > 0)
                    {
                        Db.UserTokens.RemoveRange(memberToken);
                        await Db.SaveChangesAsync();
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
