using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class CourseCategoryRepositoryAsync : ApplicationUserRepositoryAsync<CourseCategory>, ICourseCategoryRepositoryAsync
{
    public CourseCategoryRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(CourseCategory courseCategory)
    {
        ApplicationDbContext.CourseCategories.Update(courseCategory);
    }
}
