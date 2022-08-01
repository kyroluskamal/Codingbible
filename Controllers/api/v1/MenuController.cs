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
            if(menu!=null)
            menu.MenuLocationsName = menuLocation?.Name;
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
                    return Ok(await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Name == model.Name));
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
                if (model.MenuItemToAdd != null)
                {
                    List<MenuItem> sblings = (List<MenuItem>)await UnitOfWork.MenuItems.GetAllAsync(x => x.MenuId == menu.Id && x.ParentKey == model.MenuItemToAdd.ParentKey, orderBy: c => c.OrderBy(x => x.OrderWithinParent));
                    sblings.Insert(model.MenuItemToAdd.OrderWithinParent - 1, model.MenuItemToAdd);
                    for (var i = 0; i < sblings.Count; i++)
                    {
                        sblings[i].OrderWithinParent = i + 1;
                        if (sblings[i].Id != model.MenuItemToAdd.Id)
                        {
                            UnitOfWork.MenuItems.Update(sblings[i]);
                        }
                    }
                    await UnitOfWork.MenuItems.AddAsync(model.MenuItemToAdd);
                }
                if (model.MenuItemToEdit != null)
                {
                    var OldMenuItem = await UnitOfWork.MenuItems.GetFirstOrDefaultAsync(x => x.Id == model.MenuItemToEdit.Id);
                    var oldLevel = OldMenuItem.Level;
                    var oldOrderWithinParent = OldMenuItem.OrderWithinParent;
                    OldMenuItem.EnName = model.MenuItemToEdit.EnName;
                    OldMenuItem.ArName = model.MenuItemToEdit.ArName;
                    OldMenuItem.ParentKey = model.MenuItemToEdit.ParentKey;
                    OldMenuItem.EnUrl = model.MenuItemToEdit.EnUrl;
                    OldMenuItem.ArUrl = model.MenuItemToEdit.ArUrl;
                    OldMenuItem.Level = model.MenuItemToEdit.Level;
                    OldMenuItem.OrderWithinParent = model.MenuItemToEdit.OrderWithinParent;
                    OldMenuItem.MenuId = model.MenuItemToEdit.MenuId;
                    List<MenuItem> sblings = (List<MenuItem>)await UnitOfWork.MenuItems.GetAllAsync(x => x.MenuId == menu.Id && x.ParentKey == model.MenuItemToEdit.ParentKey, orderBy: c => c.OrderBy(x => x.OrderWithinParent));
                    if (sblings.Count > 0)
                    {
                        sblings.RemoveAt(oldOrderWithinParent - 1);
                        sblings.Insert(OldMenuItem.OrderWithinParent - 1, OldMenuItem);
                        for (var i = 0; i < sblings.Count; i++)
                        {
                            sblings[i].OrderWithinParent = i + 1;
                            UnitOfWork.MenuItems.Update(sblings[i]);
                        }
                    }
                    else
                    {
                        OldMenuItem.OrderWithinParent = 1;
                        UnitOfWork.MenuItems.Update(OldMenuItem);
                    }
                    if (OldMenuItem.Level != oldLevel)
                    {
                        await this.UpdateMenuItemLevel(OldMenuItem);
                    }
                }
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Update_Sucess("Menu", await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Id == model.Id, includeProperties: "MenuItems,MenuLocations")));
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
    [Route(nameof(DeleteMenuItem) + "/{MenuItemId}")]
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
                List<MenuItem> sblings = (List<MenuItem>)await UnitOfWork.MenuItems.GetAllAsync(x => x.MenuId == menuItem.MenuId && x.ParentKey == menuItem.ParentKey, orderBy: c => c.OrderBy(x => x.OrderWithinParent));
                sblings.RemoveAt(menuItem.OrderWithinParent - 1);
                List<MenuItem> children = (List<MenuItem>)await UnitOfWork.MenuItems.GetAllAsync(x => x.ParentKey == menuItem.Id, orderBy: c => c.OrderBy(x => x.OrderWithinParent));
                if (children.Count > 0)
                {
                    foreach (var child in children)
                    {
                        child.Level = menuItem.Level;
                        child.ParentKey = menuItem.ParentKey;
                    }
                }
                var MenuId = menuItem.MenuId;
                await UnitOfWork.MenuItems.RemoveAsync(menuItem.Id);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    for (var i = 0; i < sblings.Count; i++)
                    {
                        sblings[i].OrderWithinParent = i + 1;
                        UnitOfWork.MenuItems.Update(sblings[i]);
                    }
                    if (children.Count > 0)
                    {
                        foreach (var child in children)
                        {
                            await UpdateMenuItemLevel(child);
                        }
                    }
                    await UnitOfWork.SaveAsync();
                    return Ok(Constants.HttpResponses.Delete_Sucess("MenuItem", await UnitOfWork.Menus.GetFirstOrDefaultAsync(x => x.Id == MenuId, includeProperties: "MenuItems,MenuLocations")));
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

    private async Task UpdateMenuItemLevel(MenuItem menuItem)
    {
        var children = await UnitOfWork.MenuItems.GetAllAsync(x => x.ParentKey == menuItem.Id);
        foreach (var child in children)
        {
            child.Level = menuItem.Level + 1;
            UnitOfWork.MenuItems.Update(child);
            await UpdateMenuItemLevel(child);
        }
    }
}
