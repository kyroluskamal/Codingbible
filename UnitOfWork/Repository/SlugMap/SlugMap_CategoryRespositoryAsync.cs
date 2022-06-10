using CodingBible.Data;
using CodingBible.Models.SlugMap;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork.Repository.SlugMap;

public class SlugMap_CategoryRespositoryAsync : ApplicationUserRepositoryAsync<SlugMap_Category>, ISlugMap_CategoryRespositoryAsync
{
    public SlugMap_CategoryRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(SlugMap_Category slugMap_Category)
    {
        ApplicationDbContext.SlugMap_Categories.Update(slugMap_Category);
    }
}
