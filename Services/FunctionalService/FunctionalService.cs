using CodingBible.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;
using Serilog;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;

namespace CodingBible.Services.FunctionalService
{
    public class FunctionalService : IFunctionalService
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationUserRoleManager RoleManager;
        private readonly IWebHostEnvironment _env;

        public FunctionalService(ApplicationUserManager userManager, IWebHostEnvironment env, ApplicationUserRoleManager roleManager)
        {
            _userManager = userManager;
            _env = env;
            RoleManager = roleManager;
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
    }
}
