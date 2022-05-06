using CodingBible.UnitOfWork.IRepository.MailProvider;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.UnitOfWork.IRepository.Tokens;
using CodingBible.UnitOfWork.IRepository.AttachmentRepo;
using CodingBible.UnitOfWork.IRepository.MenuItems;
using CodingBible.UnitOfWork.IRepository.Menus;

namespace CodingBible.UnitOfWork
{
    public interface IUnitOfWork_ApplicationUser : IDisposable
    {
        IPostsRepositoryAsync Posts { get; }
        ITokensRepositoryAsync UserTokens { get; }
        IMailProvidersRepositoryAsync MailProviders { get; }
        ICategoriesRepositoryAsync Categories { get; }
        IAttachmentsRepositoryAsync Attachments { get; }
        IPostAttachmentsRepositoryAsync PostAttachments { get; }
        IPostsCategoryRepositoryAsync PostsCategories { get; }
        IMenuItemsRepositoryAsync MenuItems { get; }
        IMenuRepositoryAsync Menus { get; }
        IMenuMenuItemsRepositoryAsync MenuMenuItems { get; }
        IMenuLocationsRespositoryAsync MenuLocations { get; }
        Task<int> SaveAsync();
        int Save();
    }
}
