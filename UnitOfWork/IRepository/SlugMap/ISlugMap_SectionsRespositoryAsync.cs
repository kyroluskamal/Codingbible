using CodingBible.Models.SlugMap;

namespace CodingBible.UnitOfWork.IRepository.SlugMap;

public interface ISlugMap_SectionsRespositoryAsync : IRepositoryAsync<SlugMap_Sections>
{
    void Update(SlugMap_Sections slugMap_Sections);
}