using CodingBible.Data;
using CodingBible.Models.Identity;
using CodingBible.UnitOfWork.IRepository.MailProvider;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.UnitOfWork.IRepository.Tokens;
using CodingBible.UnitOfWork.Repository.MailProvider;
using CodingBible.UnitOfWork.Repository.Posts;
using CodingBible.UnitOfWork.Repository.Tokens;

namespace CodingBible.UnitOfWork
{
    public class ApplicationUserUnitOfWork : IUnitOfWork_ApplicationUser
    {
        public IPostsRepositoryAsync Posts { get; }
        public ApplicationDbContext ApplicationDbContext { get; }
        public ApplicationUserRoleManager RoleManager { get; set; }

        public ITokensRepositoryAsync UserTokens { get; }

        public IMailProvidersRepositoryAsync MailProviders { get; }

        public ApplicationUserUnitOfWork(ApplicationDbContext applicationDbContext,
            ApplicationUserRoleManager roleManager)
        {
            ApplicationDbContext = applicationDbContext;
            RoleManager = roleManager;
            Posts = new PostsRepoAsync(applicationDbContext);
            UserTokens = new TokensRepositoryAsync(applicationDbContext);
            MailProviders = new MailProviderRepositoryAsync(applicationDbContext);
        }
        public async void Dispose()
        {
            await ApplicationDbContext.DisposeAsync();
        }

        public async Task<int> SaveAsync()
        {
            return await ApplicationDbContext.SaveChangesAsync();
        }

        public int Save()
        {
            return ApplicationDbContext.SaveChanges();
        }
    }
}
