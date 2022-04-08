using Microsoft.AspNetCore.Mvc;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.SitemapService;
using CodingBible.Models.Posts;

namespace CodingBible.Controllers.api.v1;

[ApiVersion("1.0")]
[ApiController]
[Route("api/v1/[controller]")]
public class SitemapController : ControllerBase
{
    private ISitemapService SitemapService { get; }
    private IHttpContextAccessor HttpContextAccessor { get; }
    public HttpContext Current => HttpContextAccessor.HttpContext;
    private string BaseUrl => $"{Current.Request.Scheme}://{Current.Request.Host}";
    public SitemapController(ISitemapService sitemapService, IHttpContextAccessor httpContextAccessor)
    {
        SitemapService = sitemapService;
        HttpContextAccessor = httpContextAccessor;
    }

    [HttpGet(nameof(CreatePostSitemap))]
    public async Task<string> CreatePostSitemap()
    {
        return await SitemapService.CreatePostSiteMap(BaseUrl);
    }
    // [HttpGet(nameof(UpdatePostSitemap))]
    // public IActionResult UpdatePostSitemap()
    // {
    //     return Ok(SitemapService.UpdatePostSitemap(BaseUrl));
    // }
}
