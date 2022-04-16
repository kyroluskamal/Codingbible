using CodingBible.Models;

namespace CodingBible.ViewModels;

public interface IFileMetaData
{
    public IFormFile File { get; set; }
    public Attachments Details { get; set; }
}
