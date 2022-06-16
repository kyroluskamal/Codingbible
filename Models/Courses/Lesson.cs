using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.SlugMap;
using CodingBible.Services.ConstantsService;

namespace CodingBible.Models.Courses;

public class Lesson
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
    public string Title { get; set; }
    public string Slug { get; set; }
    [Required]
    [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
    public string Description { get; set; }
    public string VedioUrl { get; set; }
    public int OrderWithinSection { get; set; }
    [Column(TypeName = "tinyint")]
    public int Status { get; set; }
    public string HtmlContent { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime LasModified { get; set; }
    public string FeatureImageUrl { get; set; }
    public DateTime PublishedDate { get; set; }
    [ForeignKey(nameof(SectionId))]
    public int SectionId { get; set; }
    public Section Section { get; set; }
    public int CourseId { get; set; }
    public ICollection<LessonAttachments> Attachments { get; set; }
    public bool IsArabic { get; set; }
    [NotMapped]
    public string OtherSlug { get; set; }
}
