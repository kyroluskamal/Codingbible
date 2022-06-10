using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.Courses;

namespace CodingBible.Models.SlugMap;

public class SlugMap_Lessons
{
    public int Id { get; set; }
    public string EnSlug { get; set; }
    public string ArSlug { get; set; }
    [ForeignKey(nameof(LessonId))]
    public int LessonId { get; set; }
    public Lesson Lesson { get; set; }
}
