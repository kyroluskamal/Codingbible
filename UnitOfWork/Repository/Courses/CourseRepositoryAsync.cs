using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class CourseRepositoryAsync : ApplicationUserRepositoryAsync<Course>, ICourseRepositoryAsync
{
    public CourseRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(Course course)
    {
        ApplicationDbContext.Courses.Update(course);
    }
}
