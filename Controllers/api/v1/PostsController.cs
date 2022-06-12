using AutoMapper;
using CodingBible.Models.Identity;
using CodingBible.Models.Posts;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.SitemapService;
using CodingBible.Services.FunctionalService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Microsoft.AspNetCore.Cors;

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
        private readonly ISitemapService SitemapService;
        public PostsController(IUnitOfWork_ApplicationUser unitOfWork,
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

        /******************************************************************************
        *                                   Posts CRUD
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
            var allPosts = await UnitOfWork.Posts.GetAllAsync(includeProperties: "Author,PostsCategories,Attachments,SlugMap");
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
            Post post = await UnitOfWork.Posts.GetFirstOrDefaultAsync(x => x.Slug == slug, includeProperties: "Author,PostsCategories,Attachments,SlugMap");
            return post != null ? Ok(post) : NotFound(Constants.HttpResponses.NotFound_ERROR_Response(post.Title));
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = "Custom")]
        [Route(nameof(GetPostById) + "/{id}")]
        public async Task<IActionResult> GetPostById([FromRoute] int id)
        {
            Post post = await UnitOfWork.Posts.GetFirstOrDefaultAsync(x => x.Id == id, includeProperties: "Author,PostsCategories,Attachments,SlugMap");
            return post != null ? Ok(post) : NotFound(Constants.HttpResponses.NotFound_ERROR_Response(post.Title));
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
                if (newPost.Status == (int)Constants.PostStatus.Published)
                {
                    newPost.PublishedDate = DateTime.Now;
                }
                newPost.AuthorId = user.Id;
                newPost.CommentCount = 0;
                newPost.CommentStatus = true;
                await UnitOfWork.Posts.AddAsync(newPost);

                var result = await UnitOfWork.SaveAsync();
                //add the post to the sitemap if it is published

                if (result > 0)
                {
                    if (Post.Categories.Length > 0)
                    {
                        List<PostsCategory> postCategories = new();
                        foreach (var cat in Post.Categories)
                        {
                            postCategories.Add(new PostsCategory()
                            {
                                PostId = newPost.Id,
                                CategoryId = cat,
                            });
                        }
                        await UnitOfWork.PostsCategories.AddRangeAsync(postCategories.ToArray());
                    }
                    if (Post.TempAttach.ToArray().Length > 0)
                    {
                        List<PostAttachments> postAttachments = new();
                        foreach (var p in Post.TempAttach)
                        {
                            postAttachments.Add(new PostAttachments()
                            {
                                PostId = newPost.Id,
                                AttachmentId = p
                            });
                        }
                        await UnitOfWork.PostAttachments.AddRangeAsync(postAttachments.ToArray());
                    }
                    await UnitOfWork.SaveAsync();
                    var postToResturn = await UnitOfWork.Posts
                    .GetFirstOrDefaultAsync(x => x.Slug == Post.Slug, includeProperties: "Author,PostsCategories,Attachments,SlugMap");
                    postToResturn.Categories = Post.Categories;
                    if (newPost.Status == (int)Constants.PostStatus.Published)
                        await SitemapService.AddPostToSitemap(newPost, $"{Request.Scheme}://{Request.Host}");
                    return Ok(postToResturn);
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
                var getPost = await UnitOfWork.Posts.GetFirstOrDefaultAsync(x => x.Id == Post.Id, includeProperties: "Author,PostsCategories,Attachments,SlugMap");
                if (getPost == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(Post.Title));
                }
                if (getPost.Slug != Post.Slug && await UnitOfWork.Posts.IsNotUnique(x => x.Slug == Post.Slug))
                {
                    return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(Post.Slug)));
                }
                var oldFeatureImageUrl = getPost.FeatureImageUrl;
                getPost.CommentStatus = Post.CommentStatus;
                getPost.HtmlContent = Post.HtmlContent;
                getPost.LasModified = DateTime.Now;
                getPost.Description = Post.Description;
                getPost.Excerpt = Post.Excerpt;
                getPost.FeatureImageUrl = Post.FeatureImageUrl;
                getPost.Title = Post.Title;
                getPost.Slug = Post.Slug;
                if (getPost.Status == (int)Constants.PostStatus.Draft && Post.Status == (int)Constants.PostStatus.Published)
                {
                    getPost.PublishedDate = DateTime.Now;
                }
                UnitOfWork.Posts.Update(getPost);
                var result = await UnitOfWork.SaveAsync();
                if (result > 0)
                {
                    getPost = await UnitOfWork.Posts.GetFirstOrDefaultAsync(x => x.Id == Post.Id, includeProperties: "Author,PostsCategories,Attachments,SlugMap");
                    foreach (var cat in getPost.PostsCategories)
                    {
                        UnitOfWork.PostsCategories.Remove(cat);
                    }
                    if (Post.Categories.Length > 0)
                    {
                        List<PostsCategory> postCategories = new();
                        foreach (var cat in Post.Categories)
                        {
                            postCategories.Add(new PostsCategory()
                            {
                                PostId = getPost.Id,
                                CategoryId = cat,
                            });
                        }
                        await UnitOfWork.PostsCategories.AddRangeAsync(postCategories.ToArray());
                    }
                    foreach (var att in getPost.Attachments)
                    {
                        UnitOfWork.PostAttachments.Remove(att);
                    }
                    await UnitOfWork.SaveAsync();

                    if (Post.TempAttach.ToArray().Length > 0)
                    {
                        List<PostAttachments> postAttachments = new();
                        foreach (var p in Post.TempAttach)
                        {
                            postAttachments.Add(new PostAttachments()
                            {
                                PostId = getPost.Id,
                                AttachmentId = p
                            });
                        }
                        await UnitOfWork.PostAttachments.AddRangeAsync(postAttachments.ToArray());
                    }
                    await UnitOfWork.SaveAsync();
                    await SitemapService.CreatePostSiteMap($"{Request.Scheme}://{Request.Host}");
                    return Ok(Constants.HttpResponses.Update_Sucess(getPost.Title, getPost));
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
                    var getPost = await UnitOfWork.Posts.GetFirstOrDefaultAsync(x => x.Id == Post.Id, includeProperties: "Author,PostsCategories,Attachments,SlugMap");
                    if (getPost == null)
                    {
                        return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(Post.Title));
                    }
                    getPost.Status = Post.Status;
                    UnitOfWork.Posts.Update(getPost);
                    var result = await UnitOfWork.SaveAsync();
                    if (Post.Status == (int)Constants.PostStatus.Published)
                    {
                        if (!SitemapService.IsPostFoundInSitemap(Post.Slug))
                        {
                            await SitemapService.AddPostToSitemap(getPost, $"{Request.Scheme}://{Request.Host}");
                        }
                    }
                    else if (Post.Status == (int)Constants.PostStatus.Draft)
                    {
                        if (SitemapService.IsPostFoundInSitemap(Post.Slug))
                            await SitemapService.DeletePostFromSitemap(Post, $"{Request.Scheme}://{Request.Host}");
                    }

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
                return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Post"));
            }

            await UnitOfWork.Posts.RemoveAsync(id);
            var result = await UnitOfWork.SaveAsync();
            if (SitemapService.IsPostFoundInSitemap(getPost.Slug))
                await SitemapService.DeletePostFromSitemap(getPost, $"{Request.Scheme}://{Request.Host}");
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
        /******************************************************************************
        *                                   Categories CRUD
        *******************************************************************************/
        #region Categories CRUD
        [HttpGet]
        [Route(nameof(GetAllCategories))]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await UnitOfWork.Categories.GetAllAsync(includeProperties: "SlugMap,PostsCategories,Parent");
            return Ok(categories);
        }
        [HttpGet]
        [Route(nameof(GetCategoryBySlug) + "/{slug}")]
        public async Task<IActionResult> GetCategoryBySlug([FromRoute] string slug)
        {
            var category = await UnitOfWork.Categories.GetFirstOrDefaultAsync(x => x.Slug == slug, includeProperties: "SlugMap,PostsCategories,Parent");
            return category != null ? Ok(category) : NotFound(Constants.HttpResponses.NotFound_ERROR_Response(category.Name));
        }
        [HttpPost]
        [Route(nameof(AddCategory))]
        [Authorize(AuthenticationSchemes = "Custom")]
        [ValidateAntiForgeryTokenCustom]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
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
        public async Task<IActionResult> UpdateCategory([FromBody] Category category)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var getCategory = await UnitOfWork.Categories.GetFirstOrDefaultAsync(x => x.Id == category.Id, includeProperties: "SlugMap,PostsCategories,Parent");
                    if (getCategory == null)
                    {
                        return NotFound(Constants.HttpResponses.NotFound_ERROR_Response(category.Name));
                    }
                    if (getCategory.Slug != category.Slug && await UnitOfWork.Categories.IsNotUnique(x => x.Slug == category.Slug))
                    {
                        return BadRequest(Constants.HttpResponses.NotUnique_ERROR_Response(nameof(category.Slug)));
                    }
                    var catToDeleteId = getCategory.Id;
                    var oldLevel = getCategory.Level;
                    getCategory = Mapper.Map(category, getCategory);

                    UnitOfWork.Categories.Update(getCategory);
                    var result = await UnitOfWork.SaveAsync();
                    if (result > 0)
                    {
                        if (category.Level != oldLevel)
                        {
                            await UpdateCategoryLevel(getCategory);
                        }
                        var allPostsInDeletedCategory = await UnitOfWork.PostsCategories.GetAllAsync(x => x.CategoryId == catToDeleteId);
                        allPostsInDeletedCategory = allPostsInDeletedCategory.ToList();
                        var Uncategorized = await UnitOfWork.CourseCategories.GetFirstOrDefaultAsync(x => x.Name == "uncategorized");
                        if (allPostsInDeletedCategory.Any())
                        {
                            foreach (var post in allPostsInDeletedCategory)
                            {
                                post.CategoryId = Uncategorized.Id;
                                UnitOfWork.PostsCategories.Update(post);
                            }
                        }
                        await UnitOfWork.SaveAsync();
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
                var getCategory = await UnitOfWork.Categories.GetAsync(id);
                if (getCategory == null)
                {
                    return NotFound(Constants.HttpResponses.NotFound_ERROR_Response("Category"));
                }
                var catToDeleteId = getCategory.Id;
                var catToDelete_Level = getCategory.Level;
                var catToDelete_ParentKey = getCategory.ParentKey;
                var children = await UnitOfWork.Categories.GetAllAsync(x => x.ParentKey == getCategory.Id);
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
                    await UnitOfWork.SaveAsync();
                    return Ok(Constants.HttpResponses.Delete_Sucess($"Category ({getCategory.Name})"));
                }
                return BadRequest(Constants.HttpResponses.Delete_Failed($"Category ({getCategory.Name})"));
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
        [Route(nameof(IsCatSlug_NOT_Unique) + "/{slug}")]
        public async Task<IActionResult> IsCatSlug_NOT_Unique([FromRoute] string slug)
        {
            return Ok(await UnitOfWork.Categories.IsNotUnique(x => x.Slug == slug));
        }
        private async Task UpdateCategoryLevel(Category Category)
        {
            var children = await UnitOfWork.Categories.GetAllAsync(x => x.ParentKey == Category.Id);
            foreach (var child in children)
            {
                child.Level = Category.Level + 1;
                UnitOfWork.Categories.Update(child);
                await UpdateCategoryLevel(child);
            }
        }
        #endregion
    }
}