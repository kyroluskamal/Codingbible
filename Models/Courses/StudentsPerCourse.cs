using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Courses;

public class StudentsPerCourse
{
    [ForeignKey(nameof(CourseId))]
    public int CourseId { get; set; }
    public Course Course { get; set; }
    [ForeignKey(nameof(StudentId))]
    public int StudentId { get; set; }
    public ApplicationUser Student { get; set; }
}
