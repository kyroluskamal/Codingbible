using AutoMapper;
using CodingBible.Models.Identity;
using CodingBible.Models.Posts;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.FunctionalService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace CodingBible.Controllers.api.v1
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PostsController : ControllerBase
    {
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        private readonly IMapper Mapper;
        private ICookieServ CookierService { get; }
        private ApplicationUserManager UserManager { get; }
        private readonly IFunctionalService FunctionalService;
        public PostsController(IUnitOfWork_ApplicationUser unitOfWork, IMapper mapper, ICookieServ cookierService, ApplicationUserManager userManager, IFunctionalService functionalService)
        {
            UnitOfWork = unitOfWork;
            Mapper = mapper;
            CookierService = cookierService;
            UserManager = userManager;
            FunctionalService = functionalService;
        }
        /******************************************************************************
        *                                   Categories CRUD
        *******************************************************************************/
        #region Posts CRUD
        /// <summary>
        /// Get a list of all posts in the database
        /// </summary>
        /// <returns>List of posts</returns>
        [HttpGet]
        [Route(nameof(GetPosts))]
        [AllowAnonymous]
        public async Task<IActionResult> GetPosts()
        {
            var allPosts = await UnitOfWork.Posts.GetAllAsync(includeProperties: "Author");
            return Ok(allPosts.ToList());
        }
        /// <summary>
        /// Finds a post by its slug
        /// </summary>
        /// <param name="slug">a slug of the post</param>
        /// <returns>Post if it is found or null</returns>
        [HttpGet]
        [AllowAnonymous]
        [Route(nameof(GetPostBySlug) + "/{slug}")]
        public async Task<IActionResult> GetPostBySlug([FromRoute] string slug)
        {
            Post post = await UnitOfWork.Posts.GetBySlug(slug);
            return post != null ? Ok(post) : NotFound();
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [Route(nameof(GetPostById) + "/{id}")]
        public async Task<IActionResult> GetPostById([FromRoute] int id)
        {
            Post post = await UnitOfWork.Posts.GetAsync(id);
            return post != null ? Ok(post) : NotFound();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(AddPost))]
        public async Task<IActionResult> AddPost([FromBody] Post Post)
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
                if (await UnitOfWork.Posts.IsNotUnique(x => x.Slug == Post.Slug))
                {
                    return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(Post.Slug)));
                }
                var newPost = new Post();
                newPost = Mapper.Map(Post, newPost);
                newPost.DateCreated = DateTime.Now;
                newPost.LasModified = DateTime.Now;
                newPost.AuthorId = user.Id;
                newPost.CommentCount = 0;
                newPost.CommentStatus = true;
                await UnitOfWork.Posts.AddAsync(newPost);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(await UnitOfWork.Posts.GetFirstOrDefaultAsync(x => x.Slug == Post.Slug));
                }
                return BadRequest(Constants.HttpResponses.Addition_Failed($"The {Post.Title} post"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        [HttpPut]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(UpdatePost))]
        public async Task<IActionResult> UpdatePost([FromBody] Post Post)
        {
            if (ModelState.IsValid)
            {
                var getPost = await UnitOfWork.Posts.GetAsync(Post.Id);
                if (getPost == null)
                {
                    return NotFound();
                }
                getPost = Mapper.Map(Post, getPost);
                UnitOfWork.Posts.Update(getPost);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(Constants.HttpResponses.Update_Sucess(getPost.Title));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed(getPost.Title));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        [HttpPut]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(ChangStatus))]
        public async Task<IActionResult> ChangStatus([FromBody] Post Post)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var getPost = await UnitOfWork.Posts.GetAsync(Post.Id);
                    if (getPost == null)
                    {
                        return NotFound();
                    }
                    getPost.Status = Post.Status;
                    UnitOfWork.Posts.Update(getPost);
                    var result = await UnitOfWork.SaveAsync();
                    if (result > 0)
                    {
                        return Ok(Constants.HttpResponses.Update_Sucess($"{getPost.Title}"));
                    }
                    return BadRequest(Constants.HttpResponses.Update_Failed($"{getPost.Title}"));
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
        [Route(nameof(DeletePost) + "/{id}")]
        public async Task<IActionResult> DeletePost([FromRoute] int id)
        {
            var getPost = await UnitOfWork.Posts.GetAsync(id);
            if (getPost == null)
            {
                return NotFound();
            }
            await UnitOfWork.Posts.RemoveAsync(id);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Delete_Sucess($"Post({getPost.Title})"));
            }
            return BadRequest(Constants.HttpResponses.Delete_Failed($"Post ({getPost.Title})"));
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [Route(nameof(IsSlugUnique) + "/{slug}")]
        public async Task<IActionResult> IsSlugUnique([FromRoute] string slug)
        {
            return Ok(await UnitOfWork.Posts.IsNotUnique(x => x.Slug == slug));
        }
        #endregion

        #region Categories CRUD
        [HttpGet]
        [Route(nameof(GetAllCategories))]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await UnitOfWork.Categories.GetAllAsync();
            return Ok(categories);
        }
        [HttpGet]
        [Route(nameof(GetCategoryBySlug) + "/{slug}")]
        public async Task<IActionResult> GetCategoryBySlug([FromRoute] string slug)
        {
            var category = await UnitOfWork.Categories.GetBySlug(slug);
            return category != null ? Ok(category) : NotFound();
        }
        [HttpPost]
        [Route(nameof(AddCategory))]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
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
                var newCategory = new Category();
                newCategory = Mapper.Map(category, newCategory);

                await UnitOfWork.Categories.AddAsync(newCategory);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    return Ok(await UnitOfWork.Categories.GetFirstOrDefaultAsync(x => x.Slug == category.Slug));
                }
                return BadRequest(Constants.HttpResponses.Addition_Failed($"The {category.Name} category"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(UpdateCategory))]
        public async Task<IActionResult> UpdateCategory([FromBody] Category category)
        {
            if (ModelState.IsValid)
            {
                var getCategory = await UnitOfWork.Categories.GetAsync(category.Id);
                if (getCategory == null)
                {
                    return NotFound();
                }
                getCategory = Mapper.Map(category, getCategory);
                UnitOfWork.Categories.Update(getCategory);
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
            var getCategory = await UnitOfWork.Categories.GetAsync(id);
            if (getCategory == null)
            {
                return NotFound();
            }
            await UnitOfWork.Categories.RemoveAsync(id);
            var result = await UnitOfWork.SaveAsync();
            if (result > 0)
            {
                return Ok(Constants.HttpResponses.Delete_Sucess($"Category ({getCategory.Name})"));
            }
            return BadRequest(Constants.HttpResponses.Delete_Failed($"Category ({getCategory.Name})"));
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [Route(nameof(CatIsSlugUnique) + "/{slug}")]
        public async Task<IActionResult> CatIsSlugUnique([FromRoute] string slug)
        {
            return Ok(await UnitOfWork.Categories.IsNotUnique(x => x.Slug == slug));
        }
        #endregion
    }
}