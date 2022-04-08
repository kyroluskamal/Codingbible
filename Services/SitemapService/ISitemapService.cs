using CodingBible.Models.Posts;
namespace CodingBible.Services.SitemapService;

public interface ISitemapService
{
    Task<string> CreatePostSiteMap(string baseUrl);
    Task<string> AddPostToSitemap(Post post, string baseUrl);
    Task<string> DeletePostFromSitemap(Post post, string baseUrl);
    bool IsPostFoundInSitemap(string postSlug);
}
