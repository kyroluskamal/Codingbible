using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.FunctionalService;
using DataService;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Linq;
using System.Threading.Tasks;

namespace CodingBible.Data
{
    public class DbContextInitializer : IDbContextInitializer
    {

        private readonly DataProtectionKeysContext DataProtectionKeysContext;
        private readonly ApplicationDbContext ApplicationDbContext;
        private readonly IFunctionalService FunctionalService;
        private readonly ApplicationUserManager ApplicationUserManager;
        public DbContextInitializer(DataProtectionKeysContext dataProtectionKeysContext, ApplicationDbContext applicationDbContext, IFunctionalService functionalService, ApplicationUserManager applicationUserManager)
        {
            DataProtectionKeysContext = dataProtectionKeysContext;
            ApplicationDbContext = applicationDbContext;
            FunctionalService = functionalService;
            ApplicationUserManager = applicationUserManager;
        }

        public async Task Initialize()
        {
           

            
            if (!ApplicationDbContext.MailProviders.Any())
            {
                MailProviders[] MailProviders =
                {
                   new MailProviders {
                      Name="HostProvider",
                       IsService = false,
                       FromEmail= "codingbi@coding-bible.com",
                       DisplayName = "Coding Bible",
                       Password = "kiko@codbib2020", 
                       Host = "webhosting4000.is.cc", 
                       Port = 587,
                       IsDefault = true
                    },
                   new MailProviders {
                       Name="SendGrid",
                       IsService = true,
                       ServiceSecretKey ="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",
                       ServiceEmail="kyroluskamal@gmail.com",
                       FromEmail= "codingbi@coding-bible.com",
                       DisplayName = "Coding Bible",
                       IsDefault = false
                    }
                };
                await ApplicationDbContext.MailProviders.AddRangeAsync(MailProviders);
                await ApplicationDbContext.SaveChangesAsync();
            }
            // Check, if db contains any users. If db is not empty, then db has been already seeded
            if (!ApplicationDbContext.Users.Any())
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


                var result = await ApplicationUserManager.CreateAsync(adminUser, "Kiko@2009");

                if (result.Succeeded)
                {
                    await ApplicationUserManager.AddToRoleAsync(adminUser, "Administrator");
                    Log.Information("Admin User Created {UserName}", adminUser.UserName);
                }
                else
                {
                    var errorString = string.Join(",", result.Errors);
                    Log.Error("Error while creating user {Error}", errorString);
                }
            }

            //// If empty create Admin User and App User
            
            //await functionalSvc.CreateDefaultUser();

            //// Populate Country database 
            //var countries = await countrySvc.GetCountriesAsync();
            //if (countries.Count > 0)
            //{
            //    await applicationDbContext.Countries.AddRangeAsync(countries);
            //    await applicationDbContext.SaveChangesAsync();
            //}

        }
    }
}
