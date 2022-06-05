using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ILessonRepositoryAsync : IRepositoryAsync<Lesson>
{
    void Update(Lesson lesson);
    Task<bool> IsSlugNotUniqueInSection(string slug, int sectionId, int courseId);
    void UpdateRange(IEnumerable<Lesson> lessons);
}
