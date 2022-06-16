using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.SlugMap;
using CodingBible.Services.ConstantsService;

namespace CodingBible.Models.Courses;

public class Section
{
    public int Id { get; set; }
    public string Name { get; set; }
    [Required]
    [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
    public string Title { get; set; }
    [Required]
    [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
    public string Description { get; set; }
    public string Slug { get; set; }
    public int CourseId { get; set; }
    public Course Course { get; set; }
    public int Order { get; set; }
    [Column(TypeName = "tinyint")]
    public int Level { get; set; }
    public string FeatureImageUrl { get; set; }
    public bool IsLeafSection { get; set; }
    public string WhatWillYouLearn { get; set; }
    public string IntroductoryVideoUrl { get; set; }
    [Column(TypeName = "tinyint")]
    public int Status { get; set; }
    [ForeignKey(nameof(ParentKey))]
    public int? ParentKey { get; set; }
    public Section Parent { get; set; }
    public bool IsArabic { get; set; }
    [NotMapped]
    public string OtherSlug { get; set; }
}
