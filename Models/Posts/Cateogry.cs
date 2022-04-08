using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Posts
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Slug { get; set; }
        [Required]
        [StringLength(70, MinimumLength = 60, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Title_length)]
        public string Title { get; set; }
        [Required]
        [StringLength(160, MinimumLength = 50, ErrorMessage = Constants.DataAnotationErrorMessages.SEO_Description_length)]
        public string Description { get; set; }
        [Column(TypeName = "tinyint")]
        public int Level { get; set; }
        public int PostCount { get; set; }
        [ForeignKey(nameof(ParentKey))]
        public int? ParentKey { get; set; }
        public virtual Category Parent { get; set; }
        public ICollection<PostsCategory> PostsCategories { get; set; }
    }
}