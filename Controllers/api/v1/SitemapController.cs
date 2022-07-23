using Microsoft.AspNetCore.Mvc;
using CodingBible.Services.SitemapService;

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

    [HttpGet(nameof(CreateSitemap))]
    public async Task<IActionResult> CreateSitemap()
    {
        try
        {
            var result = await SitemapService.CreateGeneralSitemap(BaseUrl);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    // [HttpGet(nameof(UpdatePostSitemap))]
    // public IActionResult UpdatePostSitemap()
    // {
    //     return Ok(SitemapService.UpdatePostSitemap(BaseUrl));
    // }
}
