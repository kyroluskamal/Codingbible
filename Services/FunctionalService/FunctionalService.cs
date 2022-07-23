using AspNetCore.SEOHelper.Sitemap;
using CodingBible.Models;
using CodingBible.Models.Courses;
using CodingBible.Models.Identity;
using CodingBible.Models.Posts;
using CodingBible.Models.SlugMap;
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
        public async Task ResizeImage_SCALE(string FilPath_Origina, string FilePath_optimised, int width, string scaleMethod = "scale")
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
        public async Task ResizeImage_OtherMedthods(string FilPath_Original, string FilePath_optimised, int Width, int Height, string scaleMethod = "fit")
        {
            Tinify.Key = "ly5n539WXDRxb4ZtPhYwGNsYFKYKntj9"; //TinyPNG Developer API KEY
            var source = Tinify.FromFile(FilPath_Original);
            var resized = source.Resize(new
            {
                method = scaleMethod,
                width = Width,
                height = Height,
            });
            await resized.ToFile(FilePath_optimised);
        }
        public async Task UpdateOtherSlug<T>(T obj)
        {
            var type = obj.GetType();

            var IsArabic = (bool)type.GetProperty("IsArabic").GetValue(obj);
            var OtherSlug = type.GetProperty("OtherSlug");
            var Slug = (string)type.GetProperty("Slug").GetValue(obj);

            if ((bool)IsArabic)
            {
                string EnSlug = null;
                if (obj is Course)
                    EnSlug = (await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, Slug)))?.EnSlug;
                else if (obj is Section)
                    EnSlug = (await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, Slug)))?.EnSlug;
                else if (obj is Lesson)
                    EnSlug = (await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, Slug)))?.EnSlug;
                else if (obj is CourseCategory)
                    EnSlug = (await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, Slug)))?.EnSlug;
                else if (obj is Post)
                    EnSlug = (await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, Slug)))?.EnSlug;
                else if (obj is Category)
                    EnSlug = (await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, Slug)))?.EnSlug;
                OtherSlug.SetValue(obj, EnSlug);
            }
            else
            {
                string ArSlug = null;
                if (obj is Course)
                    ArSlug = (await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, Slug)))?.ArSlug;
                else if (obj is Section)
                    ArSlug = (await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, Slug)))?.ArSlug;
                else if (obj is Lesson)
                    ArSlug = (await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, Slug)))?.ArSlug;
                else if (obj is CourseCategory)
                    ArSlug = (await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, Slug)))?.ArSlug;
                else if (obj is Post)
                    ArSlug = (await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, Slug)))?.ArSlug;
                else if (obj is Category)
                    ArSlug = (await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, Slug)))?.ArSlug;
                OtherSlug.SetValue(obj, ArSlug);
            }
        }
        public async Task AddUpdate_SlugMap<T>(T Obj, string oldSlug = "")
        {
            var type = Obj.GetType();
            var IsArabic = (bool)type.GetProperty("IsArabic").GetValue(Obj);
            var OtherSlug = (string)type.GetProperty("OtherSlug").GetValue(Obj);
            var Slug = (string)type.GetProperty("Slug").GetValue(Obj);

            if (OtherSlug == null)
            {
                await AddUpdateSlugMapHelper_OtherSlug_Null(Obj, Slug, OtherSlug, IsArabic, oldSlug);
            }
            else
            {
                await AddUpdateSlugMapHelper_OtherSlug_Not_Null(Obj, Slug, OtherSlug, IsArabic, oldSlug);
            }
        }
        private async Task AddUpdateSlugMapHelper_OtherSlug_Not_Null<T>(T obj,
        string Slug,
        string OtherSlug,
        bool IsArabic,
        string oldSlug = "")
        {
            if (obj is Course)
            {
                if (IsArabic)
                {
                    var SlugMap = await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x =>
                                    (x.ArSlug == null && Equals(x.EnSlug, OtherSlug))
                        || (Equals(x.EnSlug, OtherSlug) && Equals(x.ArSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.ArSlug = Slug;
                        SlugMap.EnSlug = OtherSlug;
                        UnitOfWork.SlugMap_Courses.Update(SlugMap);
                    }
                }
                else
                {
                    var SlugMap = await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x =>
                                    (x.EnSlug == null && Equals(x.ArSlug, OtherSlug))
                        || (Equals(x.ArSlug, OtherSlug) && Equals(x.EnSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.EnSlug = Slug;
                        SlugMap.ArSlug = OtherSlug;
                        UnitOfWork.SlugMap_Courses.Update(SlugMap);
                    }
                }
            }
            else if (obj is Section)
            {
                if (IsArabic)
                {
                    var SlugMap = await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x =>
                                    (x.ArSlug == null && Equals(x.EnSlug, OtherSlug))
                        || (Equals(x.EnSlug, OtherSlug) && Equals(x.ArSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.ArSlug = Slug;
                        SlugMap.EnSlug = OtherSlug;
                        UnitOfWork.SlugMap_Sections.Update(SlugMap);
                    }
                }
                else
                {
                    var SlugMap = await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x =>
                                    (x.EnSlug == null && Equals(x.ArSlug, OtherSlug))
                        || (Equals(x.ArSlug, OtherSlug) && Equals(x.EnSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.EnSlug = Slug;
                        SlugMap.ArSlug = OtherSlug;
                        UnitOfWork.SlugMap_Sections.Update(SlugMap);
                    }
                }
            }
            else if (obj is Lesson)
            {
                if (IsArabic)
                {
                    var SlugMap = await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x =>
                                    (x.ArSlug == null && Equals(x.EnSlug, OtherSlug))
                        || (Equals(x.EnSlug, OtherSlug) && Equals(x.ArSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.ArSlug = Slug;
                        SlugMap.EnSlug = OtherSlug;
                        UnitOfWork.SlugMap_Lessons.Update(SlugMap);
                    }
                }
                else
                {
                    var SlugMap = await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x =>
                                    (x.EnSlug == null && Equals(x.ArSlug, OtherSlug))
                        || (Equals(x.ArSlug, OtherSlug) && Equals(x.EnSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.EnSlug = Slug;
                        SlugMap.ArSlug = OtherSlug;
                        UnitOfWork.SlugMap_Lessons.Update(SlugMap);
                    }
                }
            }
            else if (obj is CourseCategory)
            {
                if (IsArabic)
                {
                    var SlugMap = await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x =>
                                    (x.ArSlug == null && Equals(x.EnSlug, OtherSlug))
                        || (Equals(x.EnSlug, OtherSlug) && Equals(x.ArSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.ArSlug = Slug;
                        SlugMap.EnSlug = OtherSlug;
                        UnitOfWork.SlugMap_CourseCategories.Update(SlugMap);
                    }
                }
                else
                {
                    var SlugMap = await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x =>
                                    (x.EnSlug == null && Equals(x.ArSlug, OtherSlug))
                        || (Equals(x.ArSlug, OtherSlug) && Equals(x.EnSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.EnSlug = Slug;
                        SlugMap.ArSlug = OtherSlug;
                        UnitOfWork.SlugMap_CourseCategories.Update(SlugMap);
                    }
                }
            }
            else if (obj is Post)
            {
                if (IsArabic)
                {
                    var SlugMap = await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x =>
                                    (x.ArSlug == null && Equals(x.EnSlug, OtherSlug))
                        || (Equals(x.EnSlug, OtherSlug) && Equals(x.ArSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.ArSlug = Slug;
                        SlugMap.EnSlug = OtherSlug;
                        UnitOfWork.SlugMap_Posts.Update(SlugMap);
                    }
                }
                else
                {
                    var SlugMap = await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x =>
                                    (x.EnSlug == null && Equals(x.ArSlug, OtherSlug))
                        || (Equals(x.ArSlug, OtherSlug) && Equals(x.EnSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.EnSlug = Slug;
                        SlugMap.ArSlug = OtherSlug;
                        UnitOfWork.SlugMap_Posts.Update(SlugMap);
                    }
                }
            }
            else if (obj is Category)
            {
                if (IsArabic)
                {
                    var SlugMap = await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x =>
                                    (x.ArSlug == null && Equals(x.EnSlug, OtherSlug))
                        || (Equals(x.EnSlug, OtherSlug) && Equals(x.ArSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.ArSlug = Slug;
                        SlugMap.EnSlug = OtherSlug;
                        UnitOfWork.SlugMap_Categories.Update(SlugMap);
                    }
                }
                else
                {
                    var SlugMap = await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x =>
                                    (x.EnSlug == null && Equals(x.ArSlug, OtherSlug))
                        || (Equals(x.ArSlug, OtherSlug) && Equals(x.EnSlug, oldSlug)));
                    if (SlugMap != null)
                    {
                        SlugMap.EnSlug = Slug;
                        SlugMap.ArSlug = OtherSlug;
                        UnitOfWork.SlugMap_Categories.Update(SlugMap);
                    }
                }
            }
        }

        private async Task AddUpdateSlugMapHelper_OtherSlug_Null<T>(T obj,
        string Slug,
        string OtherSlug,
        bool IsArabic,
        string oldSlug = "")
        {
            if (obj is Course)
            {
                SlugMap_Courses SlugMap = null;
                if (IsArabic)
                    SlugMap = await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, oldSlug));
                else
                    SlugMap = await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, oldSlug));

                if (SlugMap == null)
                {
                    if (IsArabic)
                        await UnitOfWork.SlugMap_Courses.AddAsync(new SlugMap_Courses() { ArSlug = Slug, EnSlug = OtherSlug });
                    else
                        await UnitOfWork.SlugMap_Courses.AddAsync(new SlugMap_Courses() { ArSlug = OtherSlug, EnSlug = Slug });
                }
                else
                {
                    if (IsArabic)
                        SlugMap.ArSlug = Slug;
                    else
                        SlugMap.EnSlug = Slug;
                    UnitOfWork.SlugMap_Courses.Update(SlugMap);
                }
            }
            else if (obj is Section)
            {
                SlugMap_Sections SlugMap = null;
                if (IsArabic)
                    SlugMap = await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, oldSlug));
                else
                    SlugMap = await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, oldSlug));

                if (SlugMap == null)
                {
                    if (IsArabic)
                        await UnitOfWork.SlugMap_Sections.AddAsync(new SlugMap_Sections() { ArSlug = Slug, EnSlug = OtherSlug });
                    else
                        await UnitOfWork.SlugMap_Sections.AddAsync(new SlugMap_Sections() { ArSlug = OtherSlug, EnSlug = Slug });
                }
                else
                {
                    if (IsArabic)
                        SlugMap.ArSlug = Slug;
                    else
                        SlugMap.EnSlug = Slug;
                    UnitOfWork.SlugMap_Sections.Update(SlugMap);
                }
            }
            else if (obj is Lesson)
            {
                SlugMap_Lessons SlugMap = null;
                if (IsArabic)
                    SlugMap = await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, oldSlug));
                else
                    SlugMap = await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, oldSlug));

                if (SlugMap == null)
                {
                    if (IsArabic)
                        await UnitOfWork.SlugMap_Lessons.AddAsync(new SlugMap_Lessons() { ArSlug = Slug, EnSlug = OtherSlug });
                    else
                        await UnitOfWork.SlugMap_Lessons.AddAsync(new SlugMap_Lessons() { ArSlug = OtherSlug, EnSlug = Slug });
                }
                else
                {
                    if (IsArabic)
                        SlugMap.ArSlug = Slug;
                    else
                        SlugMap.EnSlug = Slug;
                    UnitOfWork.SlugMap_Lessons.Update(SlugMap);
                }
            }
            else if (obj is CourseCategory)
            {
                SlugMap_CourseCategory SlugMap = null;
                if (IsArabic)
                    SlugMap = await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, oldSlug));
                else
                    SlugMap = await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, oldSlug));

                if (SlugMap == null)
                {
                    if (IsArabic)
                        await UnitOfWork.SlugMap_CourseCategories.AddAsync(new SlugMap_CourseCategory() { ArSlug = Slug, EnSlug = OtherSlug });
                    else
                        await UnitOfWork.SlugMap_CourseCategories.AddAsync(new SlugMap_CourseCategory() { ArSlug = OtherSlug, EnSlug = Slug });
                }
                else
                {
                    if (IsArabic)
                        SlugMap.ArSlug = Slug;
                    else
                        SlugMap.EnSlug = Slug;
                    UnitOfWork.SlugMap_CourseCategories.Update(SlugMap);
                }
            }
            else if (obj is Category)
            {
                SlugMap_Category SlugMap = null;
                if (IsArabic)
                    SlugMap = await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, oldSlug));
                else
                    SlugMap = await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, oldSlug));

                if (SlugMap == null)
                {
                    if (IsArabic)
                        await UnitOfWork.SlugMap_Categories.AddAsync(new SlugMap_Category() { ArSlug = Slug, EnSlug = OtherSlug });
                    else
                        await UnitOfWork.SlugMap_Categories.AddAsync(new SlugMap_Category() { ArSlug = OtherSlug, EnSlug = Slug });
                }
                else
                {
                    if (IsArabic)
                        SlugMap.ArSlug = Slug;
                    else
                        SlugMap.EnSlug = Slug;
                    UnitOfWork.SlugMap_Categories.Update(SlugMap);
                }
            }
            else if (obj is Post)
            {
                SlugMap_Posts SlugMap = null;
                if (IsArabic)
                    SlugMap = await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x => Equals(x.ArSlug, oldSlug));
                else
                    SlugMap = await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x => Equals(x.EnSlug, oldSlug));

                if (SlugMap == null)
                {
                    if (IsArabic)
                        await UnitOfWork.SlugMap_Posts.AddAsync(new SlugMap_Posts() { ArSlug = Slug, EnSlug = OtherSlug });
                    else
                        await UnitOfWork.SlugMap_Posts.AddAsync(new SlugMap_Posts() { ArSlug = OtherSlug, EnSlug = Slug });
                }
                else
                {
                    if (IsArabic)
                        SlugMap.ArSlug = Slug;
                    else
                        SlugMap.EnSlug = Slug;
                    UnitOfWork.SlugMap_Posts.Update(SlugMap);
                }
            }
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
        //                LastModified = post.LastModified,
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
        //            LastModified = post.LastModified,
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
    }
}
