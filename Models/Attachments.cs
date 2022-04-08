using CodingBible.Models.Posts;

namespace CodingBible.Models;

public class Attachments
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public string FileUrl { get; set; }
    public string FileType { get; set; }
    public string FileExtension { get; set; }
    public string Caption { get; set; }
    public string Title { get; set; }
    public long FileSize { get; set; }
    public DateTime CreatedDate { get; set; }
    public ICollection<PostAttachments> Posts { get; set; }

}
