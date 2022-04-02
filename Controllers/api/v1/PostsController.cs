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
using System.Linq;


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
        /// <summary>
        /// Get a list of all posts in the database
        /// </summary>
        /// <returns>List of posts</returns>
        [HttpGet]
        [Route(nameof(GetPosts))]
        [AllowAnonymous]
        public async Task<ActionResult<List<Post>>> GetPosts()
        {
            await Task.Delay(0);
            var allPosts = UnitOfWork.Posts.GetAllAsync(includeProperties: "Author").GetAwaiter().GetResult().ToList();
            return allPosts;
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
            if (post == null) return NotFound();
            return Ok(post);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [Route(nameof(GetPostById) + "/{id}")]
        public async Task<IActionResult> GetPostById([FromRoute] int id)
        {
            Post post = await UnitOfWork.Posts.GetAsync(id);
            if (post == null) return NotFound();
            return Ok(post);
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
                    return StatusCode(600,Constants.HttpResponses.NullUser_Error_Response());
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
    }
}