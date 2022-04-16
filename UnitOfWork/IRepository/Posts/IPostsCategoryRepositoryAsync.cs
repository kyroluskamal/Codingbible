using CodingBible.Models.Posts;

namespace CodingBible.UnitOfWork.IRepository.Posts;

public interface IPostsCategoryRepositoryAsync : IRepositoryAsync<PostsCategory>
{
    void Update(PostsCategory entity);
}
