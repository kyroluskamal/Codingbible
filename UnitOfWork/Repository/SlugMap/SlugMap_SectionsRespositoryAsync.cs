using CodingBible.Data;
using CodingBible.Models.SlugMap;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork.Repository.SlugMap;

public class SlugMap_SectionsRespositoryAsync : ApplicationUserRepositoryAsync<SlugMap_Sections>, ISlugMap_SectionsRespositoryAsync
{
    public SlugMap_SectionsRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(SlugMap_Sections slugMap_Sections)
    {
        ApplicationDbContext.SlugMap_Sections.Update(slugMap_Sections);
    }
}
