using CodingBible.Data;
using CodingBible.Models.Posts;
using CodingBible.UnitOfWork.IRepository.Posts;
using Microsoft.EntityFrameworkCore;

namespace CodingBible.UnitOfWork.Repository.Posts
{
    public class CategoriesRepositoryAsync : ApplicationUserRepositoryAsync<Category>, ICategoriesRepositoryAsync
    {
        public CategoriesRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
            ApplicationDbContext = applicationDbContext;
        }

        public ApplicationDbContext ApplicationDbContext { get; }

        public void Update(Category Category)
        {
            ApplicationDbContext.Categories.Update(Category);
        }

        public async Task<Category> GetBySlug(string slug)
        {
            return await ApplicationDbContext.Categories.FirstOrDefaultAsync(x => x.Slug == slug);
        }
    }
}