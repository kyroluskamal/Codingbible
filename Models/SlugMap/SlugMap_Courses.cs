using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.Courses;

namespace CodingBible.Models.SlugMap;

public class SlugMap_Courses
{
    public int Id { get; set; }
    public string EnSlug { get; set; }
    public string ArSlug { get; set; }
    [ForeignKey(nameof(CourseId))]
    public int CourseId { get; set; }
    public Course Course { get; set; }
}
