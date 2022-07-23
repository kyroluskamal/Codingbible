using CodingBible.Models.Posts;
namespace CodingBible.Services.SitemapService;

public interface ISitemapService
{
    Task<bool> CreateGeneralSitemap(string baseUrl);
}
