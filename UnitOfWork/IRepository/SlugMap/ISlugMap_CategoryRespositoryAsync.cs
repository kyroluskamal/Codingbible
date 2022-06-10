using CodingBible.Models.SlugMap;

namespace CodingBible.UnitOfWork.IRepository.SlugMap;

public interface ISlugMap_CategoryRespositoryAsync : IRepositoryAsync<SlugMap_Category>
{
    void Update(SlugMap_Category slugMap_Category);
}

