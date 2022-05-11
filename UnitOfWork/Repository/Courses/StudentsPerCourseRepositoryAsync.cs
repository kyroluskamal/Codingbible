using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class StudentsPerCourseRepositoryAsync : ApplicationUserRepositoryAsync<StudentsPerCourse>, IStudentsPerCourseRepositoryAsync
{
    public StudentsPerCourseRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(StudentsPerCourse studentsPerCourse)
    {
        ApplicationDbContext.StudentsPerCourses.Update(studentsPerCourse);
    }
}
