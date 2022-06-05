using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;
using Microsoft.EntityFrameworkCore;

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
    public async Task<bool> IsSlugNotUniqueInSection(string slug, int sectionId, int courseId)
    {
        return await ApplicationDbContext.Lessons.FirstOrDefaultAsync(x => x.Slug == slug && x.SectionId == sectionId && x.CourseId == courseId) != null;
    }
    public void UpdateRange(IEnumerable<Lesson> lessons)
    {
        ApplicationDbContext.Lessons.UpdateRange(lessons);
    }
}
