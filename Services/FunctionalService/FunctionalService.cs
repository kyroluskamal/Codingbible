using CodingBible.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;
using Serilog;
using CodingBible.Models.Identity;

namespace CodingBible.Services.FunctionalService
{
    public class FunctionalService : IFunctionalService
    {
        private readonly ApplicationUserManager _userManager;
        private readonly IWebHostEnvironment _env;

        public FunctionalService(ApplicationUserManager userManager, IWebHostEnvironment env)
        {
            _userManager = userManager;
            _env = env;
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
                    await _userManager.AddToRoleAsync(adminUser, "Administrator");
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
