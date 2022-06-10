using CodingBible.Data;
using CodingBible.Models.SlugMap;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork.Repository.SlugMap;

public class SlugMap_CourseCategoryRespositoryAsync : ApplicationUserRepositoryAsync<SlugMap_CourseCategory>, ISlugMap_CourseCategoryRespositoryAsync
{
    public SlugMap_CourseCategoryRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(SlugMap_CourseCategory slugMap_CourseCategory)
    {
        ApplicationDbContext.SlugMap_CourseCategories.Update(slugMap_CourseCategory);
    }
}
