using CodingBible.Models.Posts;

namespace CodingBible.UnitOfWork.IRepository.Posts
{
    public interface ICategoriesRepositoryAsync : IRepositoryAsync<Category>
    {
        void Update(Category Category);
        Task<Category> GetBySlug(string slug);
    }
}