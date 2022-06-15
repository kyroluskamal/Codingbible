using CodingBible.Services.ConstantsService;
using CodingBible.Models.SlugMap;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace CodingBible.Models.Posts
{
    public class Post
    {
        public int Id { get; set; }
        [Required]
        [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
        public string Title { get; set; }
        [Required]
        public string Slug { get; set; }
        [Required]
        public string HtmlContent { get; set; }
        [ForeignKey(nameof(AuthorId))]
        public int? AuthorId { get; set; }
        public virtual ApplicationUser Author { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LasModified { get; set; }
        public DateTime PublishedDate { get; set; }
        [Column(TypeName = "tinyint")]
        public int Status { get; set; }
        [Required]
        public string Excerpt { get; set; }
        [Required]
        [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
        public string Description { get; set; }
        [Column(TypeName = "bit")]
        public bool CommentStatus { get; set; }
        public int CommentCount { get; set; }
        // [Required]
        public string FeatureImageUrl { get; set; }
        public string EditFrequency { get; set; }
        public float Priority { get; set; }
        [NotMapped]
        public int[] Categories { get; set; }
        [NotMapped]
        public int[] TempAttach { get; set; }
        public ICollection<PostsCategory> PostsCategories { get; set; }
        public ICollection<PostAttachments> Attachments { get; set; }
        public SlugMap_Posts SlugMap { get; set; }
        public bool IsArabic { get; set; }
        [NotMapped]
        public string OtherSlug { get; set; }
    }
}