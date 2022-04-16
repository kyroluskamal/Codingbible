using CodingBible.Models.Posts;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.Data;
namespace CodingBible.UnitOfWork.Repository.Posts;

public class PostAttachmentsRepositoryAsync : ApplicationUserRepositoryAsync<PostAttachments>, IPostAttachmentsRepositoryAsync
{
    public PostAttachmentsRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(PostAttachments postAttachment)
    {
        ApplicationDbContext.PostAttachments.Update(postAttachment);
    }
}
