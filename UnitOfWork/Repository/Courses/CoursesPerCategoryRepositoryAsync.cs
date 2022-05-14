using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class CoursesPerCategoryRepositoryAsync : ApplicationUserRepositoryAsync<CoursesPerCategory>, ICoursesPerCategoryRepositoryAsync
{
    public CoursesPerCategoryRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(CoursesPerCategory coursesPerCategory)
    {
        ApplicationDbContext.CoursesPerCategories.Update(coursesPerCategory);
    }
}
