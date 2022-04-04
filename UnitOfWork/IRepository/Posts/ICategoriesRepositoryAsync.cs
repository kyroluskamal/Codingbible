using CodingBible.Models.Posts;

namespace CodingBible.UnitOfWork.IRepository.Categories
{
    public interface ICategoriesRepositoryAsync : IRepositoryAsync<Category>
    {
        void Update(Category Category);
        Task<Category> GetBySlug(string slug);
    }
}