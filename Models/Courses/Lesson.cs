using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Services.ConstantsService;

namespace CodingBible.Models.Courses;

public class Lesson
{
    public int Id { get; set; }
    [Required]
    [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
    public string Name { get; set; }
    public string Slug { get; set; }
    [Required]
    [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
    public string Description { get; set; }
    public string VedioUrl { get; set; }
    public string HtmlContent { get; set; }
    [ForeignKey(nameof(SectionId))]
    public int SectionId { get; set; }
    public Section Section { get; set; }
}
