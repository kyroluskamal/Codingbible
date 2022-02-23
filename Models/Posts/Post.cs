using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Services.ConstantsService;
namespace CodingBible.Models.Posts{
    public class Post{
        public int Id{get;set;}
        [Required(ErrorMessage =Constants.DataAnotationErrorMessages.Field_required_error)]
        [Range(60,70, ErrorMessage = @"Post title should be between 60 to 70 characters")]
        public string Title { get; set; }
        [Required(ErrorMessage =Constants.DataAnotationErrorMessages.Field_required_error)]
        public string Slug { get; set; }
        public string HtmlContent {get; set;}
        [ForeignKey(nameof(AuthorId))]
        public int? AuthorId { get; set; }
        public virtual ApplicationUser Author{get;set;}
        public DateTime DateCreated { get; set; }
        [Column(TypeName ="tinyint")]
        public int Status { get; set; }
        public string Excerpt { get; set; }
        [Column(TypeName ="bit")]
        public bool CommentStatus{get;set;}
        public int CommentCount { get; set; }
        public ICollection<PostsCategory> PostsCategories { get; set; }
    }
}