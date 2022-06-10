using CodingBible.Data;
using CodingBible.Models.SlugMap;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork.Repository.SlugMap;

public class SlugMap_CoursesRespositoryAsync : ApplicationUserRepositoryAsync<SlugMap_Courses>, ISlugMap_CoursesRespositoryAsync
{
    public SlugMap_CoursesRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(SlugMap_Courses slugMap_Courses)
    {
        ApplicationDbContext.SlugMap_Courses.Update(slugMap_Courses);
    }
}