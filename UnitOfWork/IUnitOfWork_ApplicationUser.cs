using System;
using System.Threading.Tasks;
using CodingBible.UnitOfWork.IRepository.Posts;

namespace CodingBible.UnitOfWork
{
    public interface IUnitOfWork_ApplicationUser : IDisposable
    {
        IPostsRepositoryAsync Posts{get;}
        Task<int> SaveAsync();
        int Save();
    }
}
