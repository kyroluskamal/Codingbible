using CodingBible.Models.Posts;
using CodingBible.Services.ConstantsService;
using CodingBible.UnitOfWork;
using Serilog;

namespace CodingBible.Services.SitemapService;

public class SitemapService : ISitemapService
{
    public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
    private readonly IWebHostEnvironment Env;
    public SitemapService(IWebHostEnvironment env, IUnitOfWork_ApplicationUser unitOfWork)
    {
        Env = env;
        UnitOfWork = unitOfWork;
    }

    public class SitemapNode
    {
        public string Frequency { get; set; }
        public DateTime LastModified { get; set; }
        public string Loc { get; set; }
        public float Priority { get; set; }
        public List<ImageSitemapNode> Images { get; set; }
    }
    public class ImageSitemapNode
    {
        public string Loc { get; set; }
        public string Caption { get; set; }
        public string Title { get; set; }
    }

    public async Task<string> CreatePostSiteMap(string baseUrl)
    {
        try
        {
            //Step 1 = Set the header of the sitemap.xml file
            string Sitemap = @"<?xml version='1.0' encoding='UTF-8'?>
                <urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'
                xmlns:image='http://www.google.com/schemas/sitemap-image/1.1'>";
            //Step 2 = Get all the posts from the database
            var Posts = await UnitOfWork.Posts.GetAllAsync(includeProperties: "Attachments");
            //Step 3 = Loop through all the posts and create a sitemap node for each one
            List<SitemapNode> Nodes = new();
            foreach (Post post in Posts)
            {
                if (post.Status == (int)Constants.PostStatus.Published)
                    Nodes.Add(await CreateSitemapNode(post, baseUrl));
            }
            //Step 4 = Add the sitemap nodes to the sitemap
            foreach (SitemapNode node in Nodes)
            {
                Sitemap += GenerateSitemapUrl(node);
            }
            //Step 5 = Add the end tag of the sitemap
            Sitemap += "</urlset>";
            //Step 6 = Save the sitemap to the file system
            using (var writer = new StreamWriter(Env.WebRootPath + "/sitemap.xml"))
            {
                await writer.WriteAsync(Sitemap);
            }
            return "Sitemp Created Successfully";
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while creating sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return ex.Message + " " + ex.StackTrace + " " + ex.InnerException + " " + ex.Source;
        }
    }
    public async Task<string> AddPostToSitemap(Post post, string baseUrl)
    {
        try
        {
            string SitemapPath = Path.Combine(Env.WebRootPath, "sitemap.xml");
            if (!Directory.Exists(SitemapPath))
            {
                return await CreatePostSiteMap(baseUrl);
            }
            else
            {
                string[] Sitemap = File.ReadAllLines(SitemapPath);
                const string urlSet_endTag = "</urlset>";
                SitemapNode node = await CreateSitemapNode(post, baseUrl);
                Sitemap.SetValue(GenerateSitemapUrl(node), Sitemap.Length - 1);
                using (var writer = new StreamWriter(SitemapPath))
                {
                    await writer.WriteAsync(Constants.Join("", Sitemap.Append(urlSet_endTag).ToArray()));
                }
            }
            return "Sitemap Updated Successfully";
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while editing sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return ex.Message + " " + ex.Source;
        }
    }
    public async Task<string> DeletePostFromSitemap(Post post, string baseUrl)
    {
        try
        {
            string SitemapPath = Path.Combine(Env.WebRootPath, "sitemap.xml");
            if (!Directory.Exists(SitemapPath))
            {
                return await CreatePostSiteMap(baseUrl);
            }
            else
            {
                string Sitemap = Constants.Join("", File.ReadAllLines(SitemapPath));
                SitemapNode node = await CreateSitemapNode(post, baseUrl);
                string Sitemap_Url = GenerateSitemapUrl(node);
                Sitemap = Sitemap.Replace(Sitemap_Url, "");
                using (var writer = new StreamWriter(SitemapPath))
                {
                    await writer.WriteAsync(Sitemap);
                }
            }
            return "Sitemap Deleted Successfully";
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while editing sitemap {Error} {StackTrace} {InnerException} {Source}",
                ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return ex.Message + " " + ex.Source;
        }
    }
    public bool IsPostFoundInSitemap(string postSlug)
    {
        try
        {
            string SitemapPath = Path.Combine(Env.WebRootPath, "sitemap.xml");

            foreach (var line in File.ReadAllLines(SitemapPath))
            {
                if (line.Contains(postSlug))
                {
                    return true;
                }
            }
            return false;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while editing sitemap {Error} {StackTrace} {InnerException} {Source}",
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
                <changefreq>{node.Frequency}</changefreq>
                <priority>{node.Priority}</priority>
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
    private async Task<SitemapNode> CreateSitemapNode(Post post, string baseUrl)
    {
        SitemapNode node = new()
        {
            Frequency = post.EditFrequency,
            LastModified = post.LasModified,
            Loc = $"{baseUrl}/{post.Slug}",
            Priority = post.Priority,
            Images = new()
        };
        foreach (var attachment in post.Attachments)
        {
            attachment.Attachment = await UnitOfWork.Attachments.GetAsync(attachment.AttachmentId);
            node.Images.Add(new ImageSitemapNode()
            {
                Loc = $"{baseUrl}{attachment.Attachment.FileUrl}",
                Caption = attachment.Attachment.Caption,
                Title = attachment.Attachment.Title
            });
        }
        var FeatureImage = await UnitOfWork.Attachments.GetFirstOrDefaultAsync(x => x.FileUrl == post.FeatureImageUrl);
        if (FeatureImage != null)
        {
            node.Images.Insert(0, new ImageSitemapNode()
            {
                Loc = $"{baseUrl}{FeatureImage.FileUrl}",
                Caption = FeatureImage.Caption,
                Title = FeatureImage.Title
            });
        }
        return node;
    }
}
