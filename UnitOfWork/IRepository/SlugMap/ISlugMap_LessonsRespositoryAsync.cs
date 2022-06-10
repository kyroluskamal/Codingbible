using CodingBible.Models.SlugMap;

namespace CodingBible.UnitOfWork.IRepository.SlugMap;

public interface ISlugMap_LessonsRespositoryAsync : IRepositoryAsync<SlugMap_Lessons>
{
    void Update(SlugMap_Lessons slugMap_Lessons);
}
