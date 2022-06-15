using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.SlugMap;
using CodingBible.Services.ConstantsService;

namespace CodingBible.Models.Courses;

public class CourseCategory
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string Slug { get; set; }
    [Required]
    [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
    public string Title { get; set; }
    [Required]
    [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
    public string Description { get; set; }
    [Column(TypeName = "tinyint")]
    public int Level { get; set; }
    public int CourseCount { get; set; }
    [ForeignKey(nameof(ParentKey))]
    public int? ParentKey { get; set; }
    public virtual CourseCategory Parent { get; set; }
    public ICollection<CoursesPerCategory> CoursesPerCategories { get; set; }
    public SlugMap_CourseCategory SlugMap { get; set; }
    public bool IsArabic { get; set; }
    [NotMapped]
    public string OtherSlug { get; set; }
}
