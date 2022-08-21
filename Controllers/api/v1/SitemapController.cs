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
    private IWebHostEnvironment Env { get; }
    public HttpContext Current => HttpContextAccessor.HttpContext;
    public SitemapController(ISitemapService sitemapService, IWebHostEnvironment env,
    IHttpContextAccessor httpContextAccessor)
    {
        SitemapService = sitemapService;
        HttpContextAccessor = httpContextAccessor;
        Env = env;
    }
    private string BaseUrl => "https://" + (Env.IsDevelopment() ? Current.Request.Host.Value : "coding-bible.com");

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
