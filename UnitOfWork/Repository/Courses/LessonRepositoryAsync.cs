using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class LessonRepositoryAsync : ApplicationUserRepositoryAsync<Lesson>, ILessonRepositoryAsync
{
    public LessonRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(Lesson lesson)
    {
        ApplicationDbContext.Lessons.Update(lesson);
    }
}
