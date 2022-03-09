using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using CodingBible.Models.Posts;
using Microsoft.AspNetCore.Authorization;
using CodingBible.Services.ConstantsService;
using AutoMapper;
using CodingBible.Services.CookieService;
using CodingBible.Models.Identity;
using Serilog;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.FunctionalService;

namespace CodingBible.Controllers.api.v1
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PostsController : ControllerBase
    {
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        private readonly IMapper Mapper;
        private ICookieServ CookierService { get;}
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

        [HttpGet]
        [Route(nameof(GetPosts))]
        [AllowAnonymous]
        public async Task<ActionResult<List<Post>>> GetPosts(){
            var allPosts= await UnitOfWork.Posts.GetAllAsync();
            return allPosts;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route(nameof(GetPostBySlug)+"/{slug}")]
        public async Task<ActionResult<Post>> GetPostBySlug([FromRoute] string slug){
            return await UnitOfWork.Posts.GetBySlug(slug);
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(GetPostById)+"/{id}")]
        public async Task<ActionResult<Post>> GetPostById([FromRoute] int id){
            var post = await UnitOfWork.Posts.GetAsync(id);
            if (post == null) return NotFound();
            return post;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(AddPost))]
        public async Task<IActionResult> AddPost([FromBody] Post Post){
            try{
                if(ModelState.IsValid)
                {
                    var user = await UserManager.FindByIdAsync(CookierService.GetUserID());
                    if(user==null){
                        await this.FunctionalService.Logout();
                        return BadRequest(Constants.HttpResponses.NullUser_Error_Response());
                    }
                    if(!await UnitOfWork.Posts.IsUnique(x => x.Slug == Post.Slug))
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
                    if(result > 0){
                        return Ok(await UnitOfWork.Posts.GetFirstOrDefaultAsync(x=>x.Slug==Post.Slug));
                    }
                    return BadRequest(Constants.HttpResponses.Addition_Failed($"The {Post.Title} post"));
                }
                return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
            }catch(Exception ex){
                 Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                   return BadRequest();
            }
        }
        [HttpPut]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(UpdatePost))]
        public async Task<IActionResult> UpdatePost([FromBody] Post Post){
            try
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
                        return Ok(Constants.HttpResponses.Update_Sucess($"{getPost.Title}"));
                    }
                    return BadRequest(Constants.HttpResponses.Update_Failed($"{getPost.Title}"));
                }
                return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
            }
            catch (Exception ex) {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                  ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return BadRequest(ex);
            }
        }
        [HttpPut]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(ChangStatus))]
        public async Task<IActionResult> ChangStatus([FromBody] Post Post){
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
            catch (Exception ex) {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                  ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return BadRequest(ex);
            }
        }

        [HttpDelete]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(DeletePost)+"/{id}")]
        public async Task<IActionResult> DeletePost([FromRoute] int id){
            if(ModelState.IsValid)
            {
                var getPost =await UnitOfWork.Posts.GetAsync(id);
                if(getPost==null){
                    return NotFound();
                }
                await UnitOfWork.Posts.RemoveAsync(id);
                var result = await UnitOfWork.SaveAsync();
                if(result>0){
                    return Ok(Constants.HttpResponses.Delete_Sucess($"Post({getPost.Title})"));
                }
                return BadRequest(Constants.HttpResponses.Delete_Failed($"Post ({getPost.Title})"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        [Route(nameof(IsSlugUnique)+"/{slug}")]
        public async Task<ActionResult<bool>> IsSlugUnique([FromRoute]string slug){
            return await UnitOfWork.Posts.IsUnique(x=>x.Slug==slug);
        }
    }
}