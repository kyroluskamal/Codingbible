namespace CodingBible.Models.Courses;

public class LessonAttachments
{
    public int LessonId { get; set; }
    public Lesson Lesson { get; set; }
    public int AttachmentId { get; set; }
    public Attachments Attachments { get; set; }
}
