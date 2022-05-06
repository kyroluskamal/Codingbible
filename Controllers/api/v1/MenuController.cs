using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.MailService;
using CodingBible.Services.TokenService;
using CodingBible.UnitOfWork;
using CodingBible.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.WebUtilities;
using Serilog;
using System.Text;
using System.Text.Encodings.Web;
using CodingBible.Services.AuthenticationService;
using CodingBible.Models.Menus;

namespace CodingBible.Controllers.api.v1;
[ApiVersion("1.0")]
[ApiController]
[Route("api/v1/[controller]")]
public class MenuController : ControllerBase
{
    private readonly IMapper Mapper;
    public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }

    private readonly ICookieServ CookieService;
    private readonly IEMailService MailService;
    private readonly ITokenServ TokenService;
    private readonly ApplicationUserManager UserManager;
    private readonly ApplicationUserRoleManager RoleManager;
    private readonly IFunctionalService FunctionalService;
    public MenuController(ICookieServ cookieService, IMapper mapper,
            ApplicationUserManager userManager,
            ApplicationUserRoleManager roleManager,
            IEMailService emailService,
            ITokenServ tokenService,
            IFunctionalService functionalService,
            IUnitOfWork_ApplicationUser unitOfWork)
    {
        CookieService = cookieService;
        Mapper = mapper;
        UserManager = userManager;
        RoleManager = roleManager;
        MailService = emailService;
        TokenService = tokenService;
        FunctionalService = functionalService;
        UnitOfWork = unitOfWork;
    }

    [HttpGet]
    [Route("[action]")]
    public async Task<IActionResult> GetMenus()
    {
        try
        {
            var data = await UnitOfWork.Menus.GetAllAsync(includeProperties: "MenuItems");
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // [HttpPost]
    // [Route("[action]")]
    // public async Task<IActionResult> AddMenu([FromBody] List<Menu> model)
    // {

    // }
}
