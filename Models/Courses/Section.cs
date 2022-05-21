using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Courses;

public class Section
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public int Order { get; set; }
    [Column(TypeName = "tinyint")]
    public int Level { get; set; }
    public string FeatureImageUrl { get; set; }
    public bool IsLeafSection { get; set; }
    public string IntroductoryVideoUrl { get; set; }
    [ForeignKey(nameof(ParentKey))]
    public int? ParentKey { get; set; }
    public Section Parent { get; set; }
}
