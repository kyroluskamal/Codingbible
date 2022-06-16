using System.ComponentModel.DataAnnotations.Schema;
using CodingBible.Models.Posts;

namespace CodingBible.Models.SlugMap;

public class SlugMap_Category
{
    public int Id { get; set; }
    public string EnSlug { get; set; }
    public string ArSlug { get; set; }
}
