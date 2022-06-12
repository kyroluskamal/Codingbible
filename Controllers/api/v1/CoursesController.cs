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
using System.Collections.Generic;

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
            var courses = await UnitOfWork.Courses.GetAllAsync(includeProperties: "Author,CoursesPerCategories,Students,SlugMap");
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
            var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Id == id, includeProperties: "Author,CoursesPerCategories,Students,SlugMap");
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
            var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Name == name, includeProperties: "Author,CoursesPerCategories,Students,SlugMap");
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
            var course = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Slug == slug, includeProperties: "Author,CoursesPerCategories,Students,SlugMap");
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
                var getCourse = await UnitOfWork.Courses.GetFirstOrDefaultAsync(x => x.Id == course.Id, includeProperties: "Author,CoursesPerCategories,Students,SlugMap");
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
                var allCoursesInDeletedCategory = await UnitOfWork.CoursesPerCategories.GetAllAsync(x => x.CourseCategoryId == catToDeleteId);
                allCoursesInDeletedCategory = allCoursesInDeletedCategory.ToList();
                var Uncategorized = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Name == "uncategorized");
                if (allCoursesInDeletedCategory.Any())
                {
                    foreach (var course in allCoursesInDeletedCategory)
                    {
                        course.CourseCategoryId = Uncategorized.Id;
                        UnitOfWork.CoursesPerCategories.Update(course);
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

    #endregion
    /******************************************************************************
    *                                   Sections CRUD
    *******************************************************************************/
    #region Sections CRUD
    [HttpGet]
    [Route(nameof(GetSections))]
    public async Task<IActionResult> GetSections()
    {
        try
        {
            var sections = await UnitOfWork.Sections.GetAllAsync(includeProperties: "Course,Parent,SlugMap");
            return Ok(sections);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetSectionsByCourseId) + "/{courseId}")]
    public async Task<IActionResult> GetSectionsByCourseId([FromRoute] int courseId)
    {
        try
        {
            var section = await UnitOfWork.Sections.GetAllAsync(x => x.CourseId == courseId, includeProperties: "Course,Parent,SlugMap");
            return Ok(section);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpPost]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(AddSection))]
    public async Task<IActionResult> AddSection([FromBody] Section section)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getCourse = await UnitOfWork.Courses.GetAsync(section.CourseId);
                if (getCourse == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Course"));
                }
                var getSection = await UnitOfWork.Sections.GetAllAsync(x => x.CourseId == section.CourseId && x.Name == section.Name);
                if (getSection.Any())
                {
                    return BadRequest(Constants.HttpResponses.Already_Exists_ERROR_Response("Section"));
                }
                var newSection = new Section();
                newSection = Mapper.Map(section, newSection);
                await UnitOfWork.Sections.AddAsync(newSection);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(await UnitOfWork.Sections.GetFirstOrDefaultAsync(x => x.Id == newSection.Id, includeProperties: "Course,Parent,SlugMap"));
                }
                return BadRequest(Constants.HttpResponses.Addition_Failed("Section"));
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
    [Route(nameof(UpdateSection))]
    public async Task<IActionResult> UpdateSection([FromBody] Section section)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getSection = await UnitOfWork.Sections.GetFirstOrDefaultAsync(x => x.Id == section.Id, includeProperties: "Course,Parent,SlugMap");
                if (getSection == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Section"));
                }
                var getCourse = await UnitOfWork.Courses.GetAsync(section.CourseId);
                if (getCourse == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Course"));
                }
                if (getSection.Name != section.Name)
                {
                    var getSection_ = await UnitOfWork.Sections.GetAllAsync(x => x.CourseId == section.CourseId && x.Name == section.Name);
                    if (getSection_.Any())
                    {
                        return BadRequest(Constants.HttpResponses.Already_Exists_ERROR_Response("Section"));
                    }
                }
                var oldLevel = getSection.Level;
                getSection.Name = section.Name;
                getSection.Title = section.Title;
                getSection.Description = section.Description;
                getSection.Level = section.Level;
                getSection.Slug = section.Slug;
                getSection.Order = section.Order;
                getSection.ParentKey = section.ParentKey;
                getSection.FeatureImageUrl = section.FeatureImageUrl;
                getSection.IsLeafSection = section.IsLeafSection;
                getSection.WhatWillYouLearn = section.WhatWillYouLearn;
                getSection.IntroductoryVideoUrl = section.IntroductoryVideoUrl;
                getSection.Status = 0;
                UnitOfWork.Sections.Update(getSection);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    if (section.Level != oldLevel)
                    {
                        await UpdateSectionLevel(getSection);
                    }
                    await UnitOfWork.SaveAsync();
                    return Ok(Constants.HttpResponses.Update_Sucess(getSection.Name, getSection));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed("Section"));
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
    [Route(nameof(DeleteSection) + "/{id}")]
    public async Task<IActionResult> DeleteSection([FromRoute] int id)
    {
        try
        {
            var getSection = await UnitOfWork.Sections.GetAsync(id);
            if (getSection == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Section"));
            }
            var SecToDeleteId = getSection.Id;
            var SecToDelete_Level = getSection.Level;
            var SecToDelete_ParentKey = getSection.ParentKey;
            var children = await UnitOfWork.Sections.GetAllAsync(x => x.ParentKey == getSection.Id);
            children = children.ToList();
            if (children.Any())
            {
                foreach (var child in children)
                {
                    child.ParentKey = getSection.ParentKey;
                    child.Level = getSection.Level;
                }
            }
            await UnitOfWork.Sections.RemoveAsync(id);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                if (children.Any())
                {
                    foreach (var child in children)
                    {
                        await UpdateSectionLevel(child);
                    }
                }
                await UnitOfWork.SaveAsync();
                return Ok(Constants.HttpResponses.Delete_Sucess($"Section ({getSection.Name})"));
            }
            return BadRequest(Constants.HttpResponses.Delete_Failed("Section"));
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
    [Route(nameof(ChangSectionStatus))]
    public async Task<IActionResult> ChangSectionStatus([FromBody] Section section)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getSection = await UnitOfWork.Sections.GetFirstOrDefaultAsync(x => x.Id == section.Id, includeProperties: "Course,Parent,SlugMap");
                if (getSection == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(section.Title));
                }
                getSection.Status = section.Status;
                UnitOfWork.Sections.Update(getSection);
                var result = await UnitOfWork.SaveAsync();
                /*
                    ADD here the sitemap code
                */
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Update_Sucess($"{getSection.Title}", getSection));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed($"{getSection.Title}"));
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
    [HttpPut]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(UpdateSectionOrder))]
    public async Task<IActionResult> UpdateSectionOrder([FromBody] Section[] sections)
    {
        try
        {
            var getSections = await UnitOfWork.Sections.GetAllAsync(x => x.CourseId == sections[0].CourseId && x.ParentKey == sections[0].ParentKey, includeProperties: "Course,Parent,SlugMap");

            foreach (var section in sections)
            {
                var getSection = getSections.FirstOrDefault(x => x.Id == section.Id);
                if (getSection != null)
                {
                    getSection.Order = section.Order;
                }
            }
            UnitOfWork.Sections.UpdateRange(getSections);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Update_Sucess("Section Order", getSections));
            }
            return BadRequest(Constants.HttpResponses.Update_Failed("Section Order"));
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
              ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return BadRequest(ex);
        }
    }

    #endregion
    /******************************************************************************
    *                                   Lessons CRUD
    *******************************************************************************/
    #region Lessons CRUD
    [HttpGet]
    [Authorize(AuthenticationSchemes = "Custom")]
    [Route(nameof(GetLessons))]
    public async Task<IActionResult> GetLessons()
    {
        try
        {
            var lessons = await UnitOfWork.Lessons.GetAllAsync(includeProperties: "Section,Attachments,SlugMap");
            return Ok(lessons);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Authorize(AuthenticationSchemes = "Custom")]
    [Route(nameof(GetLessonsByCourseId) + "/{courseId}")]
    public async Task<IActionResult> GetLessonsByCourseId([FromRoute] int courseId)
    {
        try
        {
            var lessons = await UnitOfWork.Lessons.GetAllAsync(x => x.CourseId == courseId, includeProperties: "Section,Attachments,SlugMap");
            return Ok(lessons);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetLessonById) + "/{id}")]
    public async Task<IActionResult> GetLessonById([FromRoute] int id)
    {
        try
        {
            var lesson = await UnitOfWork.Lessons.GetFirstOrDefaultAsync(x => x.Id == id, includeProperties: "Section,Attachments,SlugMap");
            if (lesson == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Lesson"));
            }
            return Ok(lesson);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(GetLessonByCourseId) + "/{courseId}")]
    public async Task<IActionResult> GetLessonByCourseId([FromRoute] int courseId)
    {
        try
        {
            var lesson = await UnitOfWork.Lessons.GetAllAsync(x => x.CourseId == courseId, includeProperties: "Section,Attachments,SlugMap");
            if (lesson == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Lesson"));
            }
            return Ok(lesson);
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpPost]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(AddLesson))]
    public async Task<IActionResult> AddLesson([FromBody] Lesson lesson)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getSection = await UnitOfWork.Sections.GetAsync(lesson.SectionId);
                if (getSection == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Section"));
                }
                var getCourse = await UnitOfWork.Courses.GetAsync(getSection.CourseId);
                if (getCourse == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Course"));
                }
                var getLesson = await UnitOfWork.Lessons.GetAllAsync(x => x.SectionId == lesson.SectionId && x.Name == lesson.Name);
                if (getLesson.Any())
                {
                    return BadRequest(Constants.HttpResponses.Already_Exists_ERROR_Response("Lesson"));
                }
                Lesson newLesson = new()
                {
                    Name = lesson.Name,
                    Title = lesson.Title,
                    Slug = lesson.Slug,
                    Description = lesson.Description,
                    VedioUrl = lesson.VedioUrl,
                    OrderWithinSection = lesson.OrderWithinSection,
                    Status = lesson.Status,
                    HtmlContent = lesson.HtmlContent,
                    FeatureImageUrl = lesson.FeatureImageUrl,
                    SectionId = lesson.SectionId,
                    DateCreated = DateTime.Now,
                    LasModified = DateTime.Now,
                    Attachments = lesson.Attachments,
                    CourseId = lesson.CourseId
                };
                if (lesson.Status == (int)Constants.PostStatus.Published)
                {
                    newLesson.PublishedDate = DateTime.Now;
                }

                await UnitOfWork.Lessons.AddAsync(newLesson);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    if (lesson.Attachments.ToArray().Length > 0)
                    {
                        List<LessonAttachments> lessonAttachments = new();
                        foreach (var l in lesson.Attachments)
                        {
                            lessonAttachments.Add(new LessonAttachments()
                            {
                                LessonId = newLesson.Id,
                                AttachmentId = l.AttachmentId
                            });
                        }
                        await UnitOfWork.LessonAttachments.AddRangeAsync(lessonAttachments.ToArray());
                    }
                    await UnitOfWork.SaveAsync();
                    return Ok(await UnitOfWork.Lessons.GetFirstOrDefaultAsync(x => x.Id == newLesson.Id, includeProperties: "Section,Attachments"));
                }
                return BadRequest(Constants.HttpResponses.Addition_Failed("Lesson"));
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
    [Route(nameof(UpdateLesson))]
    public async Task<IActionResult> UpdateLesson([FromBody] Lesson lesson)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getLesson = await UnitOfWork.Lessons.GetFirstOrDefaultAsync(x => x.Id == lesson.Id, includeProperties: "Section,Attachments,SlugMap");
                if (getLesson == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Lesson"));
                }
                var getSection = await UnitOfWork.Sections.GetAsync(lesson.SectionId);
                if (getSection == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Section"));
                }
                var getCourse = await UnitOfWork.Courses.GetAsync(getSection.CourseId);
                if (getCourse == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Course"));
                }

                getLesson.Name = lesson.Name;
                getLesson.Title = lesson.Title;
                getLesson.Slug = lesson.Slug;
                getLesson.Description = lesson.Description;
                getLesson.VedioUrl = lesson.VedioUrl;
                getLesson.OrderWithinSection = lesson.OrderWithinSection;
                getLesson.Status = lesson.Status;
                getLesson.HtmlContent = lesson.HtmlContent;
                getLesson.FeatureImageUrl = lesson.FeatureImageUrl;
                getLesson.SectionId = lesson.SectionId;
                getLesson.LasModified = DateTime.Now;
                getLesson.Attachments = lesson.Attachments;
                getLesson.CourseId = lesson.CourseId;
                if (getLesson.Status == (int)Constants.PostStatus.Draft && lesson.Status == (int)Constants.PostStatus.Published)
                {
                    getLesson.PublishedDate = DateTime.Now;
                }
                getLesson.LasModified = DateTime.Now;
                getLesson.Attachments = lesson.Attachments;
                UnitOfWork.Lessons.Update(getLesson);
                foreach (var att in getLesson.Attachments)
                {
                    UnitOfWork.LessonAttachments.Remove(att);
                }
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    if (lesson.Attachments.ToArray().Length > 0)
                    {
                        List<LessonAttachments> lessonAttachments = new();
                        foreach (var l in lesson.Attachments)
                        {
                            lessonAttachments.Add(new LessonAttachments()
                            {
                                LessonId = getLesson.Id,
                                AttachmentId = l.AttachmentId
                            });
                        }
                        await UnitOfWork.LessonAttachments.AddRangeAsync(lessonAttachments.ToArray());
                    }
                    await UnitOfWork.SaveAsync();
                    return Ok(Constants.HttpResponses.Update_Sucess("Lesson"));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed("Lesson"));
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
    [Route(nameof(DeleteLesson) + "/{id}")]
    public async Task<IActionResult> DeleteLesson([FromRoute] int id)
    {
        try
        {
            var getLesson = await UnitOfWork.Lessons.GetAsync(id);
            if (getLesson == null)
            {
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Lesson"));
            }
            UnitOfWork.Lessons.Remove(getLesson);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Delete_Sucess("Lesson"));
            }
            return BadRequest(Constants.HttpResponses.Delete_Failed("Lesson"));
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
    [Route(nameof(ChangLessonStatus))]
    public async Task<IActionResult> ChangLessonStatus([FromBody] Lesson lesson)
    {
        try
        {
            if (ModelState.IsValid)
            {
                var getLesson = await UnitOfWork.Lessons.GetFirstOrDefaultAsync(x => x.Id == lesson.Id, includeProperties: "Section,Attachments,SlugMap");
                if (getLesson == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(lesson.Title));
                }
                getLesson.Status = lesson.Status;
                UnitOfWork.Lessons.Update(getLesson);
                var result = await UnitOfWork.SaveAsync();
                /*
                    ADD here the sitemap code
                */
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Update_Sucess($"{getLesson.Title}", getLesson));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed($"{getLesson.Title}"));
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
    [HttpPut]
    [Authorize(AuthenticationSchemes = "Custom")]
    [ValidateAntiForgeryTokenCustom]
    [Route(nameof(ChangeLessonOrder))]
    public async Task<IActionResult> ChangeLessonOrder([FromBody] Lesson[] lessons)
    {
        try
        {
            var getLessons = await UnitOfWork.Lessons.GetAllAsync(x => x.SectionId == lessons[0].SectionId && x.CourseId == lessons[0].CourseId, includeProperties: "Section,Attachments,SlugMap");
            foreach (var l in lessons)
            {
                getLessons.FirstOrDefault(x => x.Id == l.Id).OrderWithinSection = l.OrderWithinSection;
            }
            UnitOfWork.Lessons.UpdateRange(getLessons);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Update_Sucess("Lesson", getLessons));
            }
            return BadRequest(Constants.HttpResponses.Update_Failed("Lesson"));
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
              ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            return BadRequest(ex);
        }
    }
    [HttpGet]
    [Authorize(AuthenticationSchemes = "Custom")]
    [Route(nameof(IsLessonSlug_NOT_Unique) + "/{slug}/{sectionId}/{courseId}")]
    public async Task<IActionResult> IsLessonSlug_NOT_Unique([FromRoute] string slug, [FromRoute] int sectionId, [FromRoute] int courseId)
    {
        return Ok(await UnitOfWork.Lessons.IsSlugNotUniqueInSection(slug, sectionId, courseId));
    }
    #endregion

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
    private async Task UpdateSectionLevel(Section section)
    {
        var children = await UnitOfWork.Sections.GetAllAsync(x => x.ParentKey == section.Id);
        foreach (var child in children)
        {
            child.Level = section.Level + 1;
            UnitOfWork.Sections.Update(child);
            await UpdateSectionLevel(child);
        }
    }
    /******************************************************************************
    *                                  SlugMap
    *******************************************************************************/
    #region SlugMap
    [HttpGet]
    [Route(nameof(Get_All_SlugMap_Courses))]
    public async Task<IActionResult> Get_All_SlugMap_Courses()
    {
        try
        {
            return Ok(await UnitOfWork.SlugMap_Courses.GetAllAsync());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_All_SlugMap_Sections))]
    public async Task<IActionResult> Get_All_SlugMap_Sections()
    {
        try
        {
            return Ok(await UnitOfWork.SlugMap_Sections.GetAllAsync());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_All_SlugMap_Lessons))]
    public async Task<IActionResult> Get_All_SlugMap_Lessons()
    {
        try
        {
            return Ok(await UnitOfWork.SlugMap_Lessons.GetAllAsync());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_All_SlugMap_Categories))]
    public async Task<IActionResult> Get_All_SlugMap_Categories()
    {
        try
        {
            return Ok(await UnitOfWork.SlugMap_Categories.GetAllAsync());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_All_SlugMap_CourseCategories))]
    public async Task<IActionResult> Get_All_SlugMap_CourseCategories()
    {
        try
        {
            return Ok(await UnitOfWork.SlugMap_CourseCategories.GetAllAsync());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_All_SlugMap_Posts))]
    public async Task<IActionResult> Get_All_SlugMap_Posts()
    {
        try
        {
            return Ok(await UnitOfWork.SlugMap_Posts.GetAllAsync());
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route(nameof(Get_SlugMap_Courses_By_SlugAndLang))]
    public async Task<IActionResult> Get_SlugMap_Courses_By_SlugAndLang([FromQuery] string slug, [FromQuery] bool isArabic)
    {
        try
        {
            if (isArabic)
                return Ok(await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x => x.ArSlug == slug));
            else
                return Ok(await UnitOfWork.SlugMap_Courses.GetFirstOrDefaultAsync(x => x.EnSlug == slug));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_SlugMap_Sections_By_SlugAndLang))]
    public async Task<IActionResult> Get_SlugMap_Sections_By_SlugAndLang([FromQuery] string slug, [FromQuery] bool isArabic)
    {
        try
        {
            if (isArabic)
                return Ok(await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x => x.ArSlug == slug));
            else
                return Ok(await UnitOfWork.SlugMap_Sections.GetFirstOrDefaultAsync(x => x.EnSlug == slug));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_SlugMap_Lessons_By_SlugAndLang))]
    public async Task<IActionResult> Get_SlugMap_Lessons_By_SlugAndLang([FromQuery] string slug, [FromQuery] bool isArabic)
    {
        try
        {
            if (isArabic)
                return Ok(await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x => x.ArSlug == slug));
            else
                return Ok(await UnitOfWork.SlugMap_Lessons.GetFirstOrDefaultAsync(x => x.EnSlug == slug));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_SlugMap_Categories_By_SlugAndLang))]
    public async Task<IActionResult> Get_SlugMap_Categories_By_SlugAndLang([FromQuery] string slug, [FromQuery] bool isArabic)
    {
        try
        {
            if (isArabic)
                return Ok(await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x => x.ArSlug == slug));
            else
                return Ok(await UnitOfWork.SlugMap_Categories.GetFirstOrDefaultAsync(x => x.EnSlug == slug));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_SlugMap_CourseCategories_By_SlugAndLang))]
    public async Task<IActionResult> Get_SlugMap_CourseCategories_By_SlugAndLang([FromQuery] string slug, [FromQuery] bool isArabic)
    {
        try
        {
            if (isArabic)
                return Ok(await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x => x.ArSlug == slug));
            else
                return Ok(await UnitOfWork.SlugMap_CourseCategories.GetFirstOrDefaultAsync(x => x.EnSlug == slug));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    [HttpGet]
    [Route(nameof(Get_SlugMap_Posts_By_SlugAndLang))]
    public async Task<IActionResult> Get_SlugMap_Posts_By_SlugAndLang([FromQuery] string slug, [FromQuery] bool isArabic)
    {
        try
        {
            if (isArabic)
                return Ok(await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x => x.ArSlug == slug));
            else
                return Ok(await UnitOfWork.SlugMap_Posts.GetFirstOrDefaultAsync(x => x.EnSlug == slug));
        }
        catch (Exception e)
        {
            Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                              e.Message, e.StackTrace, e.InnerException, e.Source);
            return BadRequest(e.Message);
        }
    }
    #endregion
}
