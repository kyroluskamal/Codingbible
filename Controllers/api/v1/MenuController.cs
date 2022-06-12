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
using Microsoft.AspNetCore.Cors;

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
    [Route(nameof(GetMenus))]
    public async Task<IActionResult> GetMenus()
    {
        try
        {
            var data = await UnitOfWork.Menus.GetAllAsync(includeProperties: "MenuItems,MenuLocations");
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetMenuById) + "/{Id}")]
    public async Task<IActionResult> GetMenuById([FromRoute] int Id)
    {
        try
        {
            var data = await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Id == Id, includeProperties: "MenuItems,MenuLocations");
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetMenuByName) + "/{Name}")]
    public async Task<IActionResult> GetMenuByName([FromRoute] string Name)
    {
        try
        {
            var menu = await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Name == Name, includeProperties: "MenuItems,MenuLocations");
            return Ok(menu);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetMenuByLocationName) + "/{LocationName}")]
    public async Task<IActionResult> GetMenuByLocationName([FromRoute] string LocationName)
    {
        try
        {
            MenuLocations menuLocation = await UnitOfWork.MenuLocations.GetFirstOrDefaultAsync(x => x.Name == LocationName);
            Menu menu = await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.MenuLocationsId == menuLocation.Id, includeProperties: "MenuItems,MenuLocations");
            return Ok(menu);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetMenuLocations))]
    public async Task<IActionResult> GetMenuLocations()
    {
        try
        {
            var data = await UnitOfWork.MenuLocations.GetAllAsync();
            return Ok(data);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(AddMenu))]
    public async Task<IActionResult> AddMenu([FromBody] Menu model)
    {
        try
        {
            if (ModelState.IsValid)
            {
                Menu menu = new()
                {
                    Name = model.Name,
                    MenuLocationsId = model.MenuLocationsId
                };
                await UnitOfWork.Menus.AddAsync(model);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(menu);
                }
                return BadRequest(Constants.HttpResponses.Addition_Failed("Menu"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpPut]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(UpdateMenu))]
    public async Task<IActionResult> UpdateMenu([FromBody] Menu model)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var menu = await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Id == model.Id, includeProperties: "MenuItems,MenuLocations");
                if (menu == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(model.Name));
                }
                menu.Name = model.Name;
                UnitOfWork.Menus.Update(menu);
                foreach (var m in menu.MenuItems)
                {
                    MenuItem menuItem = await UnitOfWork.MenuItems.GetFirstOrDefaultAsync(x => x.Id == m.Id);
                    if (menuItem == null)
                    {
                        await UnitOfWork.MenuItems.AddAsync(m);
                    }
                    else
                    {
                        menuItem.EnName = m.EnName;
                        menuItem.ArName = m.ArName;
                        menuItem.ParentKey = m.ParentKey;
                        menuItem.EnUrl = m.EnUrl;
                        menuItem.ArUrl = m.ArUrl;
                        menuItem.Level = m.Level;
                        menuItem.OrderWithinParent = m.OrderWithinParent;
                        UnitOfWork.MenuItems.Update(menuItem);
                    }
                }
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Update_Sucess("Menu", menu));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed("Menu"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpDelete]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(DeleteMenu) + "/{id}")]
    public async Task<IActionResult> DeleteMenu([FromRoute] int id)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var menu = await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Id == id);
                if (menu == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Menu"));
                }
                UnitOfWork.Menus.Remove(menu);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Delete_Sucess("Menu"));
                }
                return BadRequest(Constants.HttpResponses.Delete_Failed("Menu"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpDelete]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(DeleteMenuItem) + "/{Id}")]
    public async Task<IActionResult> DeleteMenuItem([FromRoute] int MenuItemId)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var menuItem = await UnitOfWork.MenuItems.GetFirstOrDefaultAsync(x => x.Id == MenuItemId);
                if (menuItem == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(menuItem.EnName));
                }
                UnitOfWork.MenuItems.Remove(menuItem);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    Menu Menu = await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Id == MenuItemId);
                    return Ok(Constants.HttpResponses.Delete_Sucess("MenuItem", Menu));
                }
                return BadRequest(Constants.HttpResponses.Delete_Failed("MenuItem"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
}
