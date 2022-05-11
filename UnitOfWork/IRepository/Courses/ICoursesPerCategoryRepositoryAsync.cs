using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ICoursesPerCategoryRepositoryAsync : IRepositoryAsync<CoursesPerCategory>
{
    void Update(CoursesPerCategory coursesPerCategory);
}
