using AspNetCore.SEOHelper.Sitemap;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Models.Posts;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.UnitOfWork;
using Serilog;
using System.Xml.Linq;
using TinifyAPI;

namespace CodingBible.Services.FunctionalService
{
    public class FunctionalService : IFunctionalService
    {
        private readonly ApplicationUserManager _userManager;
        private readonly ApplicationUserRoleManager RoleManager;
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        private readonly IWebHostEnvironment Env;

        private ICookieServ CookieService { get; }

        public FunctionalService(ApplicationUserManager userManager, ApplicationUserRoleManager roleManager, ICookieServ cookieService, IUnitOfWork_ApplicationUser unitOfWork, IWebHostEnvironment env)
        {
            _userManager = userManager;
            RoleManager = roleManager;
            CookieService = cookieService;
            UnitOfWork = unitOfWork;
            Env = env;
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
                        ApplicationUserRole adminRole = new(Constants.Roles.admin)
                        {
                            NormalizedName = Constants.Roles.admin.ToUpper(),
                            Handle = Constants.Roles.admin.ToLower(),
                            RoleIcon = "/uploads/roles/icons/default/role.png",
                            IsActive = true
                        };
                        await RoleManager.CreateAsync(adminRole);
                    }
                    var u = await _userManager.FindByEmailAsync(adminUser.Email);
                    if (u != null)
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
                CookieService.DeleteAllCookies();
                return false;
            }
            CookieService.DeleteAllCookies();
            return false;
        }
        public async Task CompressImage(string FilPath_Origina, string FilePath_optimised)
        {
            Tinify.Key = "ly5n539WXDRxb4ZtPhYwGNsYFKYKntj9"; //TinyPNG Developer API KEY
            var source = Tinify.FromFile(FilPath_Origina);
            await source.ToFile(FilePath_optimised);
        }
        public async Task ResizeImage(string FilPath_Origina, string FilePath_optimised, int width, string scaleMethod = "scale")
        {
            Tinify.Key = "ly5n539WXDRxb4ZtPhYwGNsYFKYKntj9"; //TinyPNG Developer API KEY
            var source = Tinify.FromFile(FilPath_Origina);
            var resized = source.Resize(new
            {
                method = scaleMethod,
                width = width,
            });
            await resized.ToFile(FilePath_optimised);
        }
        //public async Task<string> CreatePostSitemap(string HostNme)
        //{
        //    var x = new XDocument();
        //    try
        //    {
        //        var Posts = await UnitOfWork.Posts.GetAllAsync();
        //        var list = new List<SitemapNode>();
        //        foreach (Post post in Posts)
        //        {
        //            list.Add(new SitemapNode
        //            {
        //                LastModified = post.LasModified,
        //                Priority = post.Priority,
        //                Url = $"{HostNme}/{post.Slug}",
        //                Frequency = GetFrequencyValue(post.EditFrequency)
        //            });
        //        }
        //        new SitemapDocument().CreateSitemapXML(list, Env.WebRootPath);
        //        return "Sitemap Created Successfully";
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
        //            ex.Message, ex.StackTrace, ex.InnerException, ex.Source);

        //        return "An error occurred while creating sitemap";
        //    }
        //}

        //public string UpdatePostSitemap(string HostNme, Post post)
        //{
        //    try
        //    {
        //        SitemapDocument sitemap = new();
        //        var Nodes = sitemap.LoadFromFile(Env.WebRootPath + "/sitemap.xml");
        //        Nodes.Add(new SitemapNode()
        //        {
        //            LastModified = post.LasModified,
        //            Priority = post.Priority,
        //            Url = $"{HostNme}/{post.Slug}",
        //            Frequency = GetFrequencyValue(post.EditFrequency)
        //        });
        //        sitemap.CreateSitemapXML(Nodes, Env.ContentRootPath);
        //        return "Sitemap Updated Successfully";
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Error("An error occurred while editing sitemap {Error} {StackTrace} {InnerException} {Source}",
        //            ex.Message, ex.StackTrace, ex.InnerException, ex.Source);

        //        return "An error occurred while editing sitemap";
        //    }
        //}

        private static SitemapFrequency GetFrequencyValue(int freq)
        {
            return freq switch
            {
                0 => SitemapFrequency.Never,
                1 => SitemapFrequency.Yearly,
                2 => SitemapFrequency.Monthly,
                3 => SitemapFrequency.Weekly,
                4 => SitemapFrequency.Daily,
                5 => SitemapFrequency.Hourly,
                6 => SitemapFrequency.Always,
                _ => SitemapFrequency.Monthly
            };
        }
    }
}

