using CodingBible.Models.Posts;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.Data;
namespace CodingBible.UnitOfWork.Repository.Posts;

public class PostsCategoryRepositoryAsync : ApplicationUserRepositoryAsync<PostsCategory>, IPostsCategoryRepositoryAsync
{
    public PostsCategoryRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(PostsCategory postsCategory)
    {
        ApplicationDbContext.PostsCategories.Update(postsCategory);
    }
}
