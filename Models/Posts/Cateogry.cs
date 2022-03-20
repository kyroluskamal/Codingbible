using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Posts
{
    public class Category
    {
        public int Id { get; set; }
        [Required(ErrorMessage = Constants.DataAnotationErrorMessages.Field_required_error)]
        public string Name { get; set; }
        [Required(ErrorMessage = Constants.DataAnotationErrorMessages.Field_required_error)]
        public string Sulg { get; set; }
        public string Description { get; set; }
        public int PostCount { get; set; }
        [ForeignKey(nameof(ParentKey))]
        public int? ParentKey { get; set; }
        public virtual Category Parent { get; set; }
        public ICollection<PostsCategory> PostsCategories { get; set; }
    }
}