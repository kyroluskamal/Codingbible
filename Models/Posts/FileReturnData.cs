namespace CodingBible.Models.Posts;

public class FileReturnData
{
    public string FilePath { get; set; }
    public string FileName { get; set; }
    public long FileSize { get; set; }
    public string FileType { get; set; }
    public string FileExtension { get; set; }
    public DateTime CreatedAt { get; set; }
}
