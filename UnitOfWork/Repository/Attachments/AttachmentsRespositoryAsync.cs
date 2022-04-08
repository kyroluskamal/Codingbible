using CodingBible.Models;
using CodingBible.UnitOfWork.IRepository.AttachmentRepo;
using CodingBible.Data;
namespace CodingBible.UnitOfWork.Repository.AttachmentRepo;

public class AttachmentsRespositoryAsync : ApplicationUserRepositoryAsync<Attachments>, IAttachmentsRepositoryAsync
{
    public ApplicationDbContext ApplicationDbContext { get; }
    public AttachmentsRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public void Update(Attachments attachment)
    {
        ApplicationDbContext.Attachments.Update(attachment);
    }
}
