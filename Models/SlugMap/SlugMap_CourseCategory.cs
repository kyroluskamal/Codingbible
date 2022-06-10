using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.Courses;

namespace CodingBible.Models.SlugMap;

public class SlugMap_CourseCategory
{
    public int Id { get; set; }
    public string EnSlug { get; set; }
    public string ArSlug { get; set; }
    [ForeignKey(nameof(CourseCategoryId))]
    public int CourseCategoryId { get; set; }
    public CourseCategory CourseCategory { get; set; }
}
