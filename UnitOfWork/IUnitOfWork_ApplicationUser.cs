using System;
using System.Threading.Tasks;
using CodingBible.UnitOfWork.IRepository.MailProvider;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.UnitOfWork.IRepository.Tokens;

namespace CodingBible.UnitOfWork
{
    public interface IUnitOfWork_ApplicationUser : IDisposable
    {
        IPostsRepositoryAsync Posts{get;}
        ITokensRepositoryAsync UserTokens{get;}
        IMailProvidersRepositoryAsync MailProviders{get;}
        Task<int> SaveAsync();
        int Save();
    }
}
