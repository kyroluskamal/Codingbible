using CodingBible.Models.Courses;
using CodingBible.Models.Posts;
using CodingBible.Services.ConstantsService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using Serilog;

namespace CodingBible.Services.SitemapService;

public class SitemapService : ISitemapService
{
    public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
    private readonly IWebHostEnvironment Env;
    private const string Sitemap = @"<?xml version='1.0' encoding='UTF-8'?>
                <urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'
                xmlns:image='http://www.google.com/schemas/sitemap-image/1.1'>";
    private const string POST_SITEMAP_FILE_NAME = "sitemap_blog_posts.xml";
    private const string CAT_SITEMAP_FILE_NAME = "sitemap_blog_categories.xml";
    private const string COURSES_SITEMAP_FILE_NAME = "sitemap_courses.xml";
    private const string LESSON_SITEMAP_FILE_NAME = "sitemap_lessons.xml";
    private const string SECTIONS_SITEMAP_FILE_NAME = "sitemap_sections.xml";
    private const string COURSES_CATS_SITEMAP_FILE_NAME = "sitemap_course_categories.xml";
    private const string SITEMAP_FOOTER = "</urlset>";
    private const string COURSES_LINK = "courses";
    public SitemapService(IWebHostEnvironment env, IUnitOfWork_ApplicationUser unitOfWork)
    {
        Env = env;
        UnitOfWork = unitOfWork;
    }

    public class SitemapModel
    {
        public string Url { get; set; }
        public DateTime? LastModified { get; set; }
        public double? Priority { get; set; }
    }
    public class SitemapNode
    {
        public DateTime LastModified { get; set; }
        public string Loc { get; set; }
        public List<ImageSitemapNode> Images { get; set; }
    }
    public class ImageSitemapNode
    {
        public string Loc { get; set; }
        public string Caption { get; set; }
        public string Title { get; set; }
    }

    public async Task<bool> CreateGeneralSitemap(string baseUrl)
    {
        try
        {
            var sitMapOfSiteMAps = @"<?xml version='1.0' encoding='UTF-8'?>
                    <sitemapindex xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>";
            var postSiteMapResult = await CreatePostSiteMap(baseUrl);
            var catSiteMapResult = await Create_Blog_Category_SiteMap(baseUrl);
            var coursesSiteMapResult = await Create_Courses_SiteMap(baseUrl);
            var courseCatsSiteMap = await Create_Courses_Category_SiteMap(baseUrl);
            if (postSiteMapResult)
            {
                sitMapOfSiteMAps += @$"<sitemap>
                <loc>{baseUrl}/{POST_SITEMAP_FILE_NAME}</loc>
             </sitemap>";
            }
            if (catSiteMapResult)
            {
                sitMapOfSiteMAps += @$"<sitemap>
                <loc>{baseUrl}/{CAT_SITEMAP_FILE_NAME}</loc>
             </sitemap>";
            }
            if (coursesSiteMapResult)
            {
                sitMapOfSiteMAps += @$"<sitemap>
                <loc>{baseUrl}/{COURSES_SITEMAP_FILE_NAME}</loc>
                </sitemap>";
                sitMapOfSiteMAps += @$"<sitemap>
                <loc>{baseUrl}/{LESSON_SITEMAP_FILE_NAME}</loc>
                </sitemap>";
                sitMapOfSiteMAps += @$"<sitemap>
                <loc>{baseUrl}/{SECTIONS_SITEMAP_FILE_NAME}</loc>
                </sitemap>";
            }
            if (courseCatsSiteMap)
            {
                sitMapOfSiteMAps += @$"<sitemap>
                <loc>{baseUrl}/{COURSES_CATS_SITEMAP_FILE_NAME}</loc>
                </sitemap>";
            }
            sitMapOfSiteMAps += "</sitemapindex>";
            using (var writer = new StreamWriter(Env.WebRootPath + "/sitemap.xml"))
            {
                await writer.WriteAsync(sitMapOfSiteMAps);
            }
            return true;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return false;
        }
    }
    public async Task<bool> CreatePostSiteMap(string baseUrl)
    {
        try
        {
            //Step 1 = Set the header of the sitemap.xml file
            var Post_sitemap = Sitemap;
            //Step 2 = Get all the posts from the database
            var Posts = await UnitOfWork.Posts.GetAllAsync(includeProperties: "Attachments");
            //Step 3 = Loop through all the posts and create a sitemap node for each one
            List<SitemapNode> Nodes = new();
            foreach (Post post in Posts)
            {
                if (post.Status == (int)Constants.PostStatus.Published)
                    Nodes.Add(await CreateSitemapNode<Post, PostAttachments>(post, true, true, baseUrl, "blog/"));
            }
            //Step 4 = Add the sitemap nodes to the sitemap
            foreach (SitemapNode node in Nodes)
            {
                Post_sitemap += GenerateSitemapUrl(node);
            }
            //Step 5 = Add the end tag of the sitemap
            Post_sitemap += SITEMAP_FOOTER;
            //Step 6 = Save the sitemap to the file system
            using (var writer = new StreamWriter($"{Env.WebRootPath}/{POST_SITEMAP_FILE_NAME}"))
            {
                await writer.WriteAsync(Post_sitemap);
            }
            return true;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return false;
        }
    }
    public async Task<bool> Create_Courses_SiteMap(string baseUrl)
    {
        try
        {
            //Step 1 = Set the header of the sitemap.xml file
            var Courses_sitemap = Sitemap;
            var Lessons_sitemap = Sitemap;
            var Sections_sitemap = Sitemap;
            //Step 2 = Get all the posts from the database
            var courses = await UnitOfWork.Courses.GetAllAsync();
            //Step 3 = Loop through all the posts and create a sitemap node for each one
            List<SitemapNode> CourseNodes = new();
            List<SitemapNode> LessonsNodes = new();
            List<SitemapNode> SectionsNodes = new();
            foreach (Course c in courses)
            {
                if (c.Status == (int)Constants.PostStatus.Published)
                    CourseNodes.Add(await CreateSitemapNode<Course, PostAttachments>(c, hasFeatureImage: true, hasAttachement: false, baseUrl, $"{COURSES_LINK}/"));

                var lessons = await UnitOfWork.Lessons.GetAllAsync(includeProperties: "Attachments", filter: x => x.CourseId == c.Id);
                foreach (Lesson lesson in lessons)
                {
                    if (lesson.Status == (int)Constants.PostStatus.Published)
                    {
                        LessonsNodes.Add(await CreateSitemapNode<Lesson, LessonAttachments>(
                            lesson, hasFeatureImage: true, hasAttachement: true,
                            baseUrl, complementarySlug: $"{COURSES_LINK}/{c.Slug}/lesson/"));
                    }
                }
                var sections = await UnitOfWork.Sections.GetAllAsync(filter: x => x.CourseId == c.Id);
                foreach (Section section in sections)
                {
                    if (section.Status == (int)Constants.PostStatus.Published)
                    {
                        SectionsNodes.Add(await CreateSitemapNode<Section, LessonAttachments>(
                        section, hasFeatureImage: true, hasAttachement: false,
                        baseUrl, complementarySlug: $"{COURSES_LINK}/{c.Slug}/section/", false));
                    }
                }
            }
            //Step 4 = Add the sitemap nodes to the sitemap
            foreach (SitemapNode node in CourseNodes)
            {
                Courses_sitemap += GenerateSitemapUrl(node);
            }
            foreach (SitemapNode node in LessonsNodes)
            {
                Lessons_sitemap += GenerateSitemapUrl(node);
            }
            foreach (SitemapNode node in SectionsNodes)
            {
                Sections_sitemap += GenerateSitemapUrl(node);
            }
            //Step 5 = Add the end tag of the sitemap
            Courses_sitemap += SITEMAP_FOOTER;
            Lessons_sitemap += SITEMAP_FOOTER;
            Sections_sitemap += SITEMAP_FOOTER;
            //Step 6 = Save the sitemap to the file system
            using (var writer = new StreamWriter($"{Env.WebRootPath}/{COURSES_SITEMAP_FILE_NAME}"))
            {
                await writer.WriteAsync(Courses_sitemap);
            }
            using (var writer = new StreamWriter($"{Env.WebRootPath}/{LESSON_SITEMAP_FILE_NAME}"))
            {
                await writer.WriteAsync(Lessons_sitemap);
            }
            using (var writer = new StreamWriter($"{Env.WebRootPath}/{SECTIONS_SITEMAP_FILE_NAME}"))
            {
                await writer.WriteAsync(Sections_sitemap);
            }
            return true;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return false;
        }
    }

    public async Task<bool> Create_Blog_Category_SiteMap(string baseUrl)
    {
        try
        {
            //Step 1 = Set the header of the sitemap.xml file
            var Cats_sitemap = Sitemap;
            //Step 2 = Get all the posts from the database
            var Cats = await UnitOfWork.Categories.GetAllAsync();
            //Step 3 = Loop through all the posts and create a sitemap node for each one
            List<SitemapNode> Nodes = new();
            foreach (Category cat in Cats)
            {
                Nodes.Add(await CreateSitemapNode<Category, PostAttachments>(cat, hasFeatureImage: false, hasAttachement: false, baseUrl, "blog/", false));
            }
            //Step 4 = Add the sitemap nodes to the sitemap
            foreach (SitemapNode node in Nodes)
            {
                Cats_sitemap += GenerateSitemapUrl(node);
            }
            //Step 5 = Add the end tag of the sitemap
            Cats_sitemap += SITEMAP_FOOTER;
            //Step 6 = Save the sitemap to the file system
            using (var writer = new StreamWriter($"{Env.WebRootPath}/{CAT_SITEMAP_FILE_NAME}"))
            {
                await writer.WriteAsync(Cats_sitemap);
            }
            return true;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return false;
        }
    }
    public async Task<bool> Create_Courses_Category_SiteMap(string baseUrl)
    {
        try
        {
            //Step 1 = Set the header of the sitemap.xml file
            var Courses_Cats_sitemap = Sitemap;
            //Step 2 = Get all the posts from the database
            var courseCategories = await UnitOfWork.CourseCategories.GetAllAsync();
            //Step 3 = Loop through all the posts and create a sitemap node for each one
            List<SitemapNode> Nodes = new();
            foreach (CourseCategory cat in courseCategories)
            {
                Nodes.Add(await CreateSitemapNode<CourseCategory, PostAttachments>(cat, hasFeatureImage: false, hasAttachement: false, baseUrl, $"{COURSES_LINK}/", false));
            }
            //Step 4 = Add the sitemap nodes to the sitemap
            foreach (SitemapNode node in Nodes)
            {
                Courses_Cats_sitemap += GenerateSitemapUrl(node);
            }
            //Step 5 = Add the end tag of the sitemap
            Courses_Cats_sitemap += SITEMAP_FOOTER;
            //Step 6 = Save the sitemap to the file system
            using (var writer = new StreamWriter($"{Env.WebRootPath}/{COURSES_CATS_SITEMAP_FILE_NAME}"))
            {
                await writer.WriteAsync(Courses_Cats_sitemap);
            }
            return true;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return false;
        }
    }
    private static string GenerateSitemapUrl(SitemapNode node)
    {
        string urlNode = @$"
            <url>
                <loc>{node.Loc}</loc>
                <lastmod>{node.LastModified}</lastmod>
        ";
        foreach (ImageSitemapNode imageNode in node.Images)
        {
            urlNode += $"<image:image>\n<image:loc>{imageNode.Loc}</image:loc>";
            if (imageNode.Caption != null) urlNode += $"<image:caption>{imageNode.Caption}</image:caption>";
            if (imageNode.Title != null) urlNode += $"<image:title>{imageNode.Title}</image:title>";
            urlNode += "</image:image>";
        }
        urlNode += "</url>";
        return urlNode;
    }
    private async Task<SitemapNode> CreateSitemapNode<T, Att>(T Obj,
     bool hasFeatureImage, bool hasAttachement, string baseUrl, string complementarySlug = "", bool LastModified = true)
    {
        var type = Obj.GetType();
        var lastmod = LastModified ? type.GetProperty("LastModified").GetValue(Obj) : new DateTime();
        var loc = type.GetProperty("Slug").GetValue(Obj);
        var isArabic = (bool)type.GetProperty("IsArabic").GetValue(Obj);

        SitemapNode node = new()
        {
            LastModified = (DateTime)lastmod,
            Loc = isArabic ? $"{baseUrl}/ar/{complementarySlug}{loc}" : $"{baseUrl}/{complementarySlug}{loc}",
            Images = new()
        };
        if (hasAttachement)
        {
            var images = type.GetProperty("Attachments").GetValue(Obj) as List<Att>;
            foreach (var attachment in images)
            {
                var type_attachment = attachment.GetType();
                var Id = type_attachment.GetProperty("Id").GetValue(attachment);
                var attac_fromDb = await UnitOfWork.Attachments.GetAsync((int)Id);
                node.Images.Add(new ImageSitemapNode()
                {
                    Loc = $"{baseUrl}{attac_fromDb.FileUrl}",
                    Caption = attac_fromDb.Caption,
                    Title = attac_fromDb.Title
                });
            }
        }
        if (hasFeatureImage)
        {
            var FeatureImageUrl = type.GetProperty("FeatureImageUrl").GetValue(Obj);
            var FeatureImage = await UnitOfWork.Attachments.GetFirstOrDefaultAsync(x => x.FileUrl == (string)FeatureImageUrl);
            if (FeatureImage != null)
            {
                node.Images.Insert(0, new ImageSitemapNode()
                {
                    Loc = $"{baseUrl}{FeatureImage.FileUrl}",
                    Caption = FeatureImage.Caption,
                    Title = FeatureImage.Title
                });
            }
        }
        return node;
    }
}
