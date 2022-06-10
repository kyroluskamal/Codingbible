using CodingBible.Models.SlugMap;

namespace CodingBible.UnitOfWork.IRepository.SlugMap;

public interface ISlugMap_CoursesRespositoryAsync : IRepositoryAsync<SlugMap_Courses>
{
    void Update(SlugMap_Courses slugMap_Courses);
}
