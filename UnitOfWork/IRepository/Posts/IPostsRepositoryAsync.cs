using CodingBible.Models.Posts;

namespace CodingBible.UnitOfWork.IRepository.Posts
{
    public interface IPostsRepositoryAsync : IRepositoryAsync<Post>
    {
        void Update(Post post);
        Task<Post> GetBySlug(string slug);
    }
}