using CodingBible.Data;
using CodingBible.Models.Posts;
using CodingBible.UnitOfWork.IRepository.Posts;
using Microsoft.EntityFrameworkCore;

namespace CodingBible.UnitOfWork.Repository.Posts
{
    public class PostsRepoAsync : ApplicationUserRepositoryAsync<Post>, IPostsRepositoryAsync
    {
        public PostsRepoAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
            ApplicationDbContext = applicationDbContext;
        }

        public ApplicationDbContext ApplicationDbContext { get; }

        public void Update(Post post)
        {
            ApplicationDbContext.Posts.Update(post);
        }

        public async Task<Post> GetBySlug(string slug)
        {
            return await ApplicationDbContext.Posts.FirstOrDefaultAsync(x => x.Slug == slug);
        }
    }
}