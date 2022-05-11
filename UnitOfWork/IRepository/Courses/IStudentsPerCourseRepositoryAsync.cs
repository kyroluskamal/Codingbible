using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface IStudentsPerCourseRepositoryAsync : IRepositoryAsync<StudentsPerCourse>
{
    void Update(StudentsPerCourse studentsPerCourse);
}

