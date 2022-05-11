using AutoMapper;
using CodingBible.Models.Courses;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.SitemapService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CodingBible.Services.AuthenticationService;
using Serilog;
namespace CodingBible.Controllers.api.v1;

[Route("api/v1/[controller]")]
[ApiController]
[ApiVersion("1.0")]
public class CoursesController : ControllerBase
{
    public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
    private readonly IMapper Mapper;
    private ICookieServ CookierService { get; }
    private ApplicationUserManager UserManager { get; }
    private readonly IFunctionalService FunctionalService;
    private readonly ISitemapService SitemapService;

    public CoursesController(IUnitOfWork_ApplicationUser unitOfWork,
    IMapper mapper, ICookieServ cookierService, ApplicationUserManager userManager,
    IFunctionalService functionalService, ISitemapService sitemapService)
    {
        UnitOfWork = unitOfWork;
        Mapper = mapper;
        CookierService = cookierService;
        UserManager = userManager;
        FunctionalService = functionalService;
        SitemapService = sitemapService;
    }
    /*****************************************************************************************
    *                                    Course Api Functions
    ******************************************************************************************/
    [HttpGet]
    [Route(nameof(GetAllCourses))]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCourses()
    {
        var courses = await UnitOfWork.Courses.GetAllAsync(includeProperties: "Author");
        return Ok(courses.ToList());
    }
    [HttpGet]
    [Route(nameof(GetCourseById))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var course = await UnitOfWork.Courses.GetAsync(id);
        return Ok(course);
    }

    [HttpGet]
    [Route(nameof(GetCourseByName))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCourseByName(string name)
    {
        var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Name == name);
        return Ok(course);
    }

    [HttpGet]
    [Route(nameof(GetCourseBySlug))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCourseBySlug(string slug)
    {
        var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Slug == slug);
        return Ok(course);
    }

    [HttpGet]
    [Route(nameof(GetCoursesInCategory))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCoursesInCategory(int CategoryId)
    {
        var courses = await UnitOfWork.CoursesPerCategories.GetAllAsync(x =>
        x.CourseCategoryId == CategoryId, includeProperties: "Course");
        return Ok(courses);
    }

    [HttpGet]
    [Route(nameof(GetCoursesInCategoryByName))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCoursesInCategoryByName(string CategoryName)
    {
        var category = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Name == CategoryName);
        var courses = await UnitOfWork.CoursesPerCategories.GetAllAsync(x =>
        x.CourseCategoryId == category.Id, includeProperties: "Course");
        return Ok(courses);
    }

    [HttpGet]
    [Route(nameof(GetCoursesInCategoryBySlug))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCoursesInCategoryBySlug(string CategorySlug)
    {
        var category = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Slug == CategorySlug);
        var courses = await UnitOfWork.CoursesPerCategories.GetAllAsync(x =>
        x.CourseCategoryId == category.Id, includeProperties: "Course");
        return Ok(courses);
    }

    [HttpPost]
    [Route(nameof(AddCourse))]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> AddCourse([FromBody] Course course)
    {
        if (ModelState.IsValid)
        {
            if (await UnitOfWork.Courses.IsNotUnique(x => x.Slug == course.Slug))
            {
                return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(course.Slug)));
            }
            await UnitOfWork.Courses.AddAsync(course);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(course);
            }
            else
            {
                return BadRequest("Failed to add course");
            }
        }
        return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
    }

    /******************************************************************************
        *                                   Categories CRUD
        *******************************************************************************/
    #region Categories CRUD
    [HttpGet]
    [Route(nameof(GetAllCategories))]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await UnitOfWork.CourseCategories.GetAllAsync(includeProperties: "CoursesPerCategories");
        return Ok(categories);
    }
    [HttpGet]
    [Route(nameof(GetCategoryBySlug) + "/{slug}")]
    public async Task<IActionResult> GetCategoryBySlug([FromRoute] string slug)
    {
        var category = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Slug == slug, includeProperties: "CoursesPerCategories");
        return category != null ? Ok(category) : NotFound();
    }
    [HttpPost]
    [Route(nameof(AddCategory))]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> AddCategory([FromBody] CourseCategory category)
    {
        if (ModelState.IsValid)
        {
            var user = await UserManager.FindByIdAsync(CookierService.GetUserID());
            /*
             * This conditions is just preventive and protective step. It is never called
             * because if the username cookie is not found, then the Authorize attribute
             * will prevent the action call. This condition is only called if some can 
             * pass the authorize attribute. So, THIS CONDITION CAN BE TESTED only
             * through checking if the HTTPSTATUS code is Unauthorized or redirect or not.
             */
            if (user == null)
            {
                await FunctionalService.Logout();
                return StatusCode(450, Constants.HttpResponses.NullUser_Error_Response());
            }
            if (await UnitOfWork.Categories.IsNotUnique(x => x.Slug == category.Slug))
            {
                return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(category.Slug)));
            }
            var newCategory = new CourseCategory();
            newCategory = Mapper.Map(category, newCategory);

            await UnitOfWork.CourseCategories.AddAsync(newCategory);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(newCategory);
            }
            return BadRequest(Constants.HttpResponses.Addition_Failed($"The {category.Name} category"));
        }
        return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
    }

    [HttpPut]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(UpdateCategory))]
    public async Task<IActionResult> UpdateCategory([FromBody] CourseCategory category)
    {
        Log.Warning(category.Name);
        if (ModelState.IsValid)
        {
            var getCategory = await UnitOfWork.CourseCategories.GetAsync(category.Id);
            if (getCategory == null)
            {
                return NotFound();
            }
            var oldLevel = getCategory.Level;
            getCategory = Mapper.Map(category, getCategory);
            if (category.Level != oldLevel)
            {
                await UpdateCategoryLevel(getCategory);
            }
            UnitOfWork.CourseCategories.Update(getCategory);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Update_Sucess(getCategory.Name));
            }
            return BadRequest(Constants.HttpResponses.Update_Failed(getCategory.Name));
        }
        return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
    }
    [HttpDelete]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(DeleteCategory) + "/{id}")]
    public async Task<IActionResult> DeleteCategory([FromRoute] int id)
    {
        var getCategory = await UnitOfWork.CourseCategories.GetAsync(id);
        if (getCategory == null)
        {
            return NotFound();
        }
        var catToDeleteId = getCategory.Id;
        var catToDelete_Level = getCategory.Level;
        var catToDelete_ParentKey = getCategory.ParentKey;
        var children = await UnitOfWork.CourseCategories.GetAllAsync(x => x.ParentKey == getCategory.Id);
        children = children.ToList();
        if (children.Any())
        {
            foreach (var child in children)
            {
                child.ParentKey = getCategory.ParentKey;
                child.Level = getCategory.Level;
            }
        }
        await UnitOfWork.Categories.RemoveAsync(id);
        var result = await UnitOfWork.SaveAsync();
        if (result > 0)
        {
            if (children.Any())
            {
                foreach (var child in children)
                {
                    await UpdateCategoryLevel(child);
                }
            }
            return Ok(Constants.HttpResponses.Delete_Sucess($"Category ({getCategory.Name})"));
        }
        return BadRequest(Constants.HttpResponses.Delete_Failed($"Category ({getCategory.Name})"));
    }
    [HttpGet]
    [Authorize(AuthenticationSchemes = "Custom")]
    [Route(nameof(IsCatSlug_NOT_Unique) + "/{slug}")]
    public async Task<IActionResult> IsCatSlug_NOT_Unique([FromRoute] string slug)
    {
        return Ok(await UnitOfWork.CourseCategories.IsNotUnique(x => x.Slug == slug));
    }
    private async Task UpdateCategoryLevel(CourseCategory Category)
    {
        var children = await UnitOfWork.CourseCategories.GetAllAsync(x => x.ParentKey == Category.Id);
        foreach (var child in children)
        {
            child.Level = Category.Level + 1;
            UnitOfWork.CourseCategories.Update(child);
            await UpdateCategoryLevel(child);
        }
    }
    #endregion
}
