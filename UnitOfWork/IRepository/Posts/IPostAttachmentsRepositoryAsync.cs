using CodingBible.Models.Posts;
using CodingBible.UnitOfWork.IRepository;
namespace CodingBible.UnitOfWork.IRepository.Posts;

public interface IPostAttachmentsRepositoryAsync : IRepositoryAsync<PostAttachments>
{
    void Update(PostAttachments PostAttachment);
}
