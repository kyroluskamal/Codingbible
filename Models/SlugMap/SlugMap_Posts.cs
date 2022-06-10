using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.Posts;

namespace CodingBible.Models.SlugMap;

public class SlugMap_Posts
{
    public int Id { get; set; }
    public string EnSlug { get; set; }
    public string ArSlug { get; set; }
    [ForeignKey(nameof(Post))]
    public int PostId { get; set; }
    public Post Post { get; set; }
}
