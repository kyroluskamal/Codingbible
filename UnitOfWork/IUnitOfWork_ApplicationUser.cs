using System;
using System.Threading.Tasks;

namespace CodingBible.UnitOfWork
{
    public interface IUnitOfWork_ApplicationUser : IDisposable
    {
        Task<int> SaveAsync();
        int Save();
    }
}
