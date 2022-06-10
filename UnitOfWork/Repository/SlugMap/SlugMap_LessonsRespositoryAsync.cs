using CodingBible.Data;
using CodingBible.Models.SlugMap;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork.Repository.SlugMap;

public class SlugMap_LessonsRespositoryAsync : ApplicationUserRepositoryAsync<SlugMap_Lessons>, ISlugMap_LessonsRespositoryAsync
{
    public SlugMap_LessonsRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(SlugMap_Lessons slugMap_Lessons)
    {
        ApplicationDbContext.SlugMap_Lessons.Update(slugMap_Lessons);
    }
}
