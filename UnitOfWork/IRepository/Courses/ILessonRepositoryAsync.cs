using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ILessonRepositoryAsync : IRepositoryAsync<Lesson>
{
    void Update(Lesson lesson);
}
