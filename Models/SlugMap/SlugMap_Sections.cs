using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.Courses;

namespace CodingBible.Models.SlugMap;

public class SlugMap_Sections
{
    public int Id { get; set; }
    public string EnSlug { get; set; }
    public string ArSlug { get; set; }
    [ForeignKey(nameof(SectionId))]
    public int SectionId { get; set; }
    public Section Section { get; set; }
}
