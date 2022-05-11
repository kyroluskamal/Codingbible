using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ICourseCategoryRepositoryAsync : IRepositoryAsync<CourseCategory>
{
    void Update(CourseCategory courseCategory);
}
