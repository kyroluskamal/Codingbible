namespace CodingBible.Models.Courses;

public class CoursesPerCategory
{
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public int CourseCategoryId { get; set; }
    public CourseCategory CourseCategory { get; set; }
}
