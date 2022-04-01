using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Posts
{
    public class Post
    {
        public int Id { get; set; }
        [Required]
        [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.Post_Title_length)]
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
        [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.Post_Description_length)]
        public string Description { get; set; }
        [Column(TypeName = "bit")]
        public bool CommentStatus { get; set; }
        public int CommentCount { get; set; }
        public ICollection<PostsCategory> PostsCategories { get; set; }
    }
}