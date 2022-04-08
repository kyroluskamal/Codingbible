namespace CodingBible.Models.Posts;

public class PostAttachments
{
    public int PostId { get; set; }
    public Post Post { get; set; }
    public int AttachmentId { get; set; }
    public Attachments Attachment { get; set; }
}
