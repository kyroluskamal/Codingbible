using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Services.ConstantsService;

namespace CodingBible.Models.Courses;

public class Course
{
    public int Id { get; set; }
    [Required]
    [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
    public string Name { get; set; }
    public string Slug { get; set; }
    public bool Status { get; set; } //draft of published
    public int NumberOfStudents { get; set; }
    public int Max_NumberOfStudents { get; set; }
    public bool NeedsEnrollment { get; set; }
    public bool HasQASection { get; set; }
    [Required]
    [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
    public string Description { get; set; }
    [Required]
    public string WhatWillYouLearn { get; set; }
    [Required]
    public string TargetAudience { get; set; }
    public string RequirementsOrInstructions { get; set; }
    public string CourseFeatures { get; set; }
    [Column(TypeName = "tinyint")]
    public int DifficultyLevel { get; set; }
    [Required]
    public string FeatureImageUrl { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime LastModified { get; set; }
    public string IntroductoryVideoUrl { get; set; }
    [ForeignKey(nameof(AuthorId))]
    public int AuthorId { get; set; }
    public virtual ApplicationUser Author { get; set; }
    public ICollection<CoursesPerCategory> CoursesPerCategories { get; set; }
    public ICollection<StudentsPerCourse> Students { get; set; }
}