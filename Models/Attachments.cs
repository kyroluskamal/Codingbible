using CodingBible.Models.Courses;
using CodingBible.Models.Posts;

namespace CodingBible.Models;

public class Attachments
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public string FileUrl_xl { get; set; }
    public string FileUrl_md_lg { get; set; }
    public string FileUrl_sm { get; set; }
    public string ThumbnailUrl { get; set; }
    public string FileType { get; set; }
    public string FileExtension { get; set; }
    public string Caption { get; set; }
    public string Title { get; set; }
    public string Width { get; set; }
    public string Height { get; set; }
    public string AltText { get; set; }
    public string Description { get; set; }
    public long FileSize { get; set; }
    public DateTime CreatedDate { get; set; }
    public ICollection<PostAttachments> Posts { get; set; }
    public ICollection<LessonAttachments> Lessons { get; set; }
}
