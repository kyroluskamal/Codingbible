using CodingBible.Models.SlugMap;

namespace CodingBible.UnitOfWork.IRepository.SlugMap;

public interface ISlugMap_PostsRespositoryAsync : IRepositoryAsync<SlugMap_Posts>
{
    void Update(SlugMap_Posts slugMap_Posts);
}
