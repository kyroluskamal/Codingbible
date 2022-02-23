using System.Linq.Expressions;

namespace CodingBible.UnitOfWork.IRepository
{
    public interface IRepositoryAsync<T> where T : class
    {
        Task<T> GetAsync(int id);

        Task<IEnumerable<T>> GetAllAsync(
            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = null
            );
        Task<List<T>> GetAllAsync();
        Task<T> GetFirstOrDefaultAsync(
            Expression<Func<T, bool>> filter = null,
            string includeProperties = null
            );

        Task AddAsync(T entity);
        Task AddRangeAsync(T[] entity);
        Task RemoveAsync(int id);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entity);
        Task<bool> IsUnique(Expression<Func<T, bool>> filter);
    }
}
