using CodingBible.Models;
namespace CodingBible.UnitOfWork.IRepository.AttachmentRepo;

public interface IAttachmentsRepositoryAsync : IRepositoryAsync<Attachments>
{
    void Update(Attachments attachment);
}
