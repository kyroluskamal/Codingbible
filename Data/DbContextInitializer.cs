using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
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
        private readonly ApplicationDbContext ApplicationDbContext;
        private readonly IFunctionalService FunctionalService;
        public DbContextInitializer(ApplicationDbContext applicationDbContext, IFunctionalService functionalService)
        {
            ApplicationDbContext = applicationDbContext;
            FunctionalService = functionalService;
        }

        public async Task Initialize()
        {
            await ApplicationDbContext.Database.EnsureCreatedAsync();
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

            //if (!RoleManager.Roles.Any())
            //{
            //    ApplicationUserRole role1 = new ApplicationUserRole() { Id = 1, Name = "Administrator", NormalizedName = "ADMINISTRATOR", Handle = "administrator", RoleIcon = "/uploads/roles/icons/default/role.png", IsActive = true };
            //    ApplicationUserRole role2 = new ApplicationUserRole() { Id = 2, Name = "Reader", NormalizedName = "READER", Handle = "reader", RoleIcon = "/uploads/roles/icons/default/role.png", IsActive = true };
            //    await RoleManager.CreateAsync(role1);
            //    await RoleManager.CreateAsync(role2);
            //}
            // Check, if db contains any users. If db is not empty, then db has been already seeded
            if (!ApplicationDbContext.Users.Any())
            {
                await FunctionalService.CreateDefaultAdminUser();
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
