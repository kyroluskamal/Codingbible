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
using Microsoft.AspNetCore.Cors;

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
    #region Course CRUDS
    /*****************************************************************************************
    *                                    Course Api Functions
    ******************************************************************************************/
    [HttpGet]
    [Route(nameof(GetAllCourses))]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCourses()
    {
        try
        {
            var courses = await UnitOfWork.Courses.GetAllAsync(includeProperties: "Author,CoursesPerCategories,Students");
            return Ok(courses.ToList());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting data from the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetCourseById))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCourseById(int id)
    {
        try
        {
            var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Id == id, includeProperties: "Author,CoursesPerCategories,Students");
            return Ok(course);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting data from the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route(nameof(GetCourseByName))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCourseByName(string name)
    {
        try
        {
            var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Name == name, includeProperties: "Author,CoursesPerCategories,Students");
            return Ok(course);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting data from the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route(nameof(GetCourseBySlug))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCourseBySlug(string slug)
    {
        try
        {
            var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Slug == slug, includeProperties: "Author,CoursesPerCategories,Students");
            return Ok(course);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting data from the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route(nameof(GetCoursesInCategory))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCoursesInCategory(int CategoryId)
    {
        try
        {
            var courses = await UnitOfWork.CoursesPerCategories.GetAllAsync(x =>
                         x.CourseCategoryId == CategoryId, includeProperties: "Course");
            return Ok(courses);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting data from the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route(nameof(GetCoursesInCategoryByName))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCoursesInCategoryByName(string CategoryName)
    {
        try
        {
            var category = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Name == CategoryName);
            var courses = await UnitOfWork.CoursesPerCategories.GetAllAsync(x =>
            x.CourseCategoryId == category.Id, includeProperties: "Course");
            return Ok(courses);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting the data from the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route(nameof(GetCoursesInCategoryBySlug))]
    [AllowAnonymous]
    public async Task<IActionResult> GetCoursesInCategoryBySlug(string CategorySlug)
    {
        try
        {
            var category = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Slug == CategorySlug);
            var courses = await UnitOfWork.CoursesPerCategories.GetAllAsync(x =>
            x.CourseCategoryId == category.Id, includeProperties: "Course");
            return Ok(courses);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while getting the data the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpPost]
    [Route(nameof(AddCourse))]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> AddCourse([FromBody] Course course)
    {
        try
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
                Log.Information("The user {UserName} is trying to add a course", user.UserName);
                if (user == null)
                {
                    await FunctionalService.Logout();
                    return StatusCode(450, Constants.HttpResponses.NullUser_Error_Response());
                }
                if (await UnitOfWork.Courses.IsNotUnique(x => x.Slug == course.Slug))
                {
                    return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(course.Slug)));
                }
                var newCourse = new Course();
                newCourse = Mapper.Map(course, newCourse);
                newCourse.DateCreated = DateTime.Now;
                newCourse.LastModified = DateTime.Now;
                newCourse.AuthorId = user.Id;
                await UnitOfWork.Courses.AddAsync(newCourse);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    if (course.Categories.Length > 0)
                    {
                        List<CoursesPerCategory> coursesPerCategories = new();
                        foreach (var cat in course.Categories)
                        {
                            coursesPerCategories.Add(new CoursesPerCategory()
                            {
                                CourseId = newCourse.Id,
                                CourseCategoryId = cat,
                            });
                        }
                        await UnitOfWork.CoursesPerCategories.AddRangeAsync(coursesPerCategories.ToArray());
                    }
                    await UnitOfWork.SaveAsync();
                    var courseToResturn = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Slug == course.Slug,
                    includeProperties: "Author,CoursesPerCategories,Students");
                    courseToResturn.Categories = course.Categories;
                    return Ok(courseToResturn);
                }
                return BadRequest("Failed to add course");
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while adding data to the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpPut]
    [Route(nameof(UpdateCourse))]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> UpdateCourse([FromBody] Course course)
    {
        try
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
                var courseToUpdate = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Id == course.Id);
                if (courseToUpdate == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(course.Name));
                }
                if (courseToUpdate.Slug != course.Slug && await UnitOfWork.Courses.IsNotUnique(x => x.Slug == course.Slug))
                {
                    return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(course.Slug)));
                }
                // courseToUpdate = Mapper.Map(course, courseToUpdate);
                courseToUpdate.Name = course.Name;
                courseToUpdate.Title = course.Title;
                courseToUpdate.Description = course.Description;
                courseToUpdate.Slug = course.Slug;
                courseToUpdate.LastModified = DateTime.Now;
                courseToUpdate.Status = course.Status;
                courseToUpdate.Categories = course.Categories;
                courseToUpdate.WhatWillYouLearn = course.WhatWillYouLearn;
                courseToUpdate.TargetAudience = course.TargetAudience;
                courseToUpdate.RequirementsOrInstructions = course.RequirementsOrInstructions;
                courseToUpdate.CourseFeatures = course.CourseFeatures;
                courseToUpdate.DifficultyLevel = course.DifficultyLevel;
                courseToUpdate.FeatureImageUrl = course.FeatureImageUrl;
                courseToUpdate.IntroductoryVideoUrl = course.IntroductoryVideoUrl;
                UnitOfWork.Courses.Update(courseToUpdate);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    courseToUpdate = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Id == course.Id, includeProperties: "CoursesPerCategories,Students");
                    foreach (var cat in courseToUpdate.CoursesPerCategories)
                    {
                        UnitOfWork.CoursesPerCategories.Remove(cat);
                    }
                    if (course.Categories.Length > 0)
                    {
                        List<CoursesPerCategory> coursesPerCategories = new();
                        foreach (var cat in course.Categories)
                        {
                            coursesPerCategories.Add(new CoursesPerCategory()
                            {
                                CourseId = courseToUpdate.Id,
                                CourseCategoryId = cat,
                            });
                        }
                        await UnitOfWork.CoursesPerCategories.AddRangeAsync(coursesPerCategories.ToArray());
                    }

                    await UnitOfWork.SaveAsync();
                    return Ok(Constants.HttpResponses.Update_Sucess(courseToUpdate.Title, courseToUpdate));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed(courseToUpdate.Title));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while updating data to the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpPut]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(ChangStatus))]
    public async Task<IActionResult> ChangStatus([FromBody] Course course)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getCourse = await UnitOfWork.Courses.GetAsync(course.Id);
                if (getCourse == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(course.Title));
                }
                getCourse.Status = course.Status;
                UnitOfWork.Courses.Update(getCourse);
                var result = await UnitOfWork.SaveAsync();
                /*
                    ADD here the sitemap code
                */
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Update_Sucess($"{getCourse.Title}"));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed($"{getCourse.Title}"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
              ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return BadRequest(ex);
        }
    }

    [HttpDelete]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(DeleteCourse) + "/{id}")]
    public async Task<IActionResult> DeleteCourse([FromRoute] int id)
    {
        var getCourse = await UnitOfWork.Courses.GetAsync(id);
        if (getCourse == null)
        {
            return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Post"));
        }

        await UnitOfWork.Courses.RemoveAsync(id);
        var result = await UnitOfWork.SaveAsync();
        /*
            remove here the sitemap 
        */
        if (result > 0)
        {
            return Ok(Constants.HttpResponses.Delete_Sucess($"Post({getCourse.Title})"));
        }
        return BadRequest(Constants.HttpResponses.Delete_Failed($"Post ({getCourse.Title})"));
    }
    [HttpGet]
    [Authorize(AuthenticationSchemes = "Custom")]
    [Route(nameof(IsSlugUnique) + "/{slug}")]
    public async Task<IActionResult> IsSlugUnique([FromRoute] string slug)
    {
        return Ok(await UnitOfWork.Courses.IsNotUnique(x => x.Slug == slug));
    }
    #endregion
    /******************************************************************************
    *                                   Categories CRUD
    *******************************************************************************/
    #region Categories CRUD
    [HttpGet]
    [Route(nameof(GetAllCategories))]
    public async Task<IActionResult> GetAllCategories()
    {
        try
        {
            var categories = await UnitOfWork.CourseCategories.GetAllAsync(includeProperties: "CoursesPerCategories");
            return Ok(categories);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetCategoryBySlug) + "/{slug}")]
    public async Task<IActionResult> GetCategoryBySlug([FromRoute] string slug)
    {
        try
        {
            var category = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Slug == slug, includeProperties: "CoursesPerCategories");
            return category != null ? Ok(category) : NotFound();
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                  e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpPost]
    [Route(nameof(AddCategory))]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    public async Task<IActionResult> AddCategory([FromBody] CourseCategory category)
    {
        try
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
                if (await UnitOfWork.CourseCategories.IsNotUnique(x => x.Slug == category.Slug))
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
    [Route(nameof(UpdateCategory))]
    public async Task<IActionResult> UpdateCategory([FromBody] CourseCategory category)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getCategory = await UnitOfWork.CourseCategories.GetAsync(category.Id);
                if (getCategory == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(category.Name));
                }
                if (getCategory.Slug != category.Slug && await UnitOfWork.CourseCategories.IsNotUnique(x => x.Slug == category.Slug))
                {
                    return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(category.Slug)));
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
    [Route(nameof(DeleteCategory) + "/{id}")]
    public async Task<IActionResult> DeleteCategory([FromRoute] int id)
    {
        try
        {
            var getCategory = await UnitOfWork.CourseCategories.GetAsync(id);
            if (getCategory == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Categroy"));
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
            await UnitOfWork.CourseCategories.RemoveAsync(id);
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
                await UnitOfWork.SaveAsync();
                return Ok(Constants.HttpResponses.Delete_Sucess($"Category ({getCategory.Name})"));
            }
            return BadRequest(Constants.HttpResponses.Delete_Failed($"Category ({getCategory.Name})"));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e);
        }
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
