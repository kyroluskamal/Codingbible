using CodingBible.Models;
using CodingBible.Models.Courses;
using CodingBible.Models.Menus;
using CodingBible.Models.Posts;
using CodingBible.Models.SlugMap;
using CodingBible.Services.FunctionalService;
using Microsoft.EntityFrameworkCore;

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
            var UncategorizedPostCategory = await ApplicationDbContext.Categories.FirstOrDefaultAsync(x => x.Name == "Uncategorized");
            if (UncategorizedPostCategory == null)
            {
                UncategorizedPostCategory = new Category()
                {
                    Name = "Uncategorized",
                    Slug = "uncategorized",
                    Description = "Uncategorized",
                    Level = 0,
                    ParentKey = null,
                    IsArabic = false,
                    Title = "Uncategorized",
                };
                await ApplicationDbContext.Categories.AddAsync(UncategorizedPostCategory);
                await ApplicationDbContext.SaveChangesAsync();
            }
            var UncategorizedPostCategory_AR = await ApplicationDbContext.Categories.FirstOrDefaultAsync(x => x.Name == "غير مصنف");
            if (UncategorizedPostCategory_AR == null)
            {
                UncategorizedPostCategory_AR = new Category()
                {
                    Name = "غير مصنف",
                    Slug = "غير-مصنف",
                    Description = "غير مصنف",
                    Level = 0,
                    ParentKey = null,
                    IsArabic = true,
                    Title = "غير مصنف",
                };
                await ApplicationDbContext.Categories.AddAsync(UncategorizedPostCategory_AR);
                await ApplicationDbContext.SaveChangesAsync();
            }

            var SlugMap_Categories = await ApplicationDbContext.SlugMap_Categories.FirstOrDefaultAsync(x => x.EnSlug == "Uncategorized");
            if (SlugMap_Categories == null)
            {
                SlugMap_Categories = new SlugMap_Category()
                {
                    EnSlug = "Uncategorized",
                    ArSlug = "غير-مصنف",
                };
                await ApplicationDbContext.SlugMap_Categories.AddAsync(SlugMap_Categories);
                await ApplicationDbContext.SaveChangesAsync();
            }
            var Uncategorized_Course_Category = await ApplicationDbContext.CourseCategories.FirstOrDefaultAsync(x => x.Name == "Uncategorized");
            if (Uncategorized_Course_Category == null)
            {
                Uncategorized_Course_Category = new CourseCategory()
                {
                    Name = "Uncategorized",
                    Slug = "uncategorized",
                    Description = "Uncategorized",
                    Level = 0,
                    ParentKey = null,
                    IsArabic = false,
                    Title = "Uncategorized",
                };
                await ApplicationDbContext.CourseCategories.AddAsync(Uncategorized_Course_Category);
                await ApplicationDbContext.SaveChangesAsync();
            }

            var Uncategorized_Course_Category_AR = await ApplicationDbContext.CourseCategories.FirstOrDefaultAsync(x => x.Name == "غير مصنف");
            if (Uncategorized_Course_Category_AR == null)
            {
                Uncategorized_Course_Category_AR = new CourseCategory()
                {
                    Name = "غير مصنف",
                    Slug = "غير-مصنف",
                    Description = "غير مصنف",
                    Level = 0,
                    ParentKey = null,
                    IsArabic = true,
                    Title = "غير مصنف",
                };
                await ApplicationDbContext.CourseCategories.AddAsync(Uncategorized_Course_Category_AR);
                await ApplicationDbContext.SaveChangesAsync();
            }
            var SlugMap_CourseCategories = await ApplicationDbContext.SlugMap_CourseCategories.FirstOrDefaultAsync(x => x.EnSlug == "Uncategorized");
            if (SlugMap_CourseCategories == null)
            {
                SlugMap_CourseCategories = new SlugMap_CourseCategory()
                {
                    EnSlug = "Uncategorized",
                    ArSlug = "غير-مصنف",
                };
                await ApplicationDbContext.SlugMap_CourseCategories.AddAsync(SlugMap_CourseCategories);
                await ApplicationDbContext.SaveChangesAsync();
            }
            if (!ApplicationDbContext.MenuLocations.Any())
            {
                MenuLocations[] MenuLocations =
                {
                   new MenuLocations(){
                        Name = "home",
                    },
                     new MenuLocations(){
                        Name = "courses",
                    }
                    ,
                     new MenuLocations(){
                        Name = "blog",
                    }
                };
                await ApplicationDbContext.MenuLocations.AddRangeAsync(MenuLocations);
                await ApplicationDbContext.SaveChangesAsync();
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
