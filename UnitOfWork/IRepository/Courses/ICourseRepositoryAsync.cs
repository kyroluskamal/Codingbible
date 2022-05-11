using CodingBible.Models.Courses;
namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ICourseRepositoryAsync : IRepositoryAsync<Course>
{
    void Update(Course course);
}
