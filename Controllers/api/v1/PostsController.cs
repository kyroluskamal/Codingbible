using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using CodingBible.Models.Posts;
using Microsoft.AspNetCore.Authorization;
using CodingBible.Services.ConstantsService;
using AutoMapper;
namespace CodingBible.Controllers.api.v1
{
    [ApiVersion("1.0")]
    [ApiController]
    [Route("api/v1/[controller]")]
    [AutoValidateAntiforgeryToken]
    public class PostsController : ControllerBase
    {
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        private readonly IMapper Mapper;
        public PostsController(IUnitOfWork_ApplicationUser unitOfWork, IMapper mapper)
        {
            UnitOfWork = unitOfWork;
            Mapper = mapper;
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

        [HttpPost]
        [Authorize]
        [Route(nameof(AddPost))]
        public async Task<IActionResult> AddPost([FromBody] Post Post){
            if(ModelState.IsValid)
            {
                var newPost = new Post();
                await UnitOfWork.Posts.AddAsync(Mapper.Map<Post,Post>(Post, newPost));
                var result = await UnitOfWork.SaveAsync();
                if(result > 0){
                    return Ok(await UnitOfWork.Posts.GetFirstOrDefaultAsync(x=>x.Slug==Post.Slug));
                }
               return BadRequest(Constants.HttpResponses.Addition_Failed($"The {Post.Title} post"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }
        [HttpPut]
        [Authorize]
        [Route(nameof(UpdatePost))]
        public async Task<IActionResult> UpdatePost([FromBody] Post Post){
            if(ModelState.IsValid)
            {
                var getPost =await UnitOfWork.Posts.GetAsync(Post.Id);
                if(getPost==null){
                    return NotFound();
                }
                UnitOfWork.Posts.Update(Mapper.Map<Post, Post>(Post, getPost));
                var result = await UnitOfWork.SaveAsync();
                if(result>0){
                    return Ok(Constants.HttpResponses.Update_Sucess($"{getPost.Title}"));
                }
                return BadRequest(Constants.HttpResponses.Update_Failed($"{getPost.Title}"));
            }
            return BadRequest(Constants.HttpResponses.ModelState_Errors(ModelState));
        }

        [HttpDelete]
        [Authorize]
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
    }
}