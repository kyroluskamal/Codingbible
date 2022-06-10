using CodingBible.Data;
using CodingBible.Models.SlugMap;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork.Repository.SlugMap;

public class SlugMap_PostsRepositoryAsync : ApplicationUserRepositoryAsync<SlugMap_Posts>, ISlugMap_PostsRespositoryAsync
{
    public SlugMap_PostsRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(SlugMap_Posts slugMap_Posts)
    {
        ApplicationDbContext.SlugMap_Posts.Update(slugMap_Posts);
    }
}
