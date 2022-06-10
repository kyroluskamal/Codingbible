using CodingBible.Models.SlugMap;

namespace CodingBible.UnitOfWork.IRepository.SlugMap;

public interface ISlugMap_CourseCategoryRespositoryAsync : IRepositoryAsync<SlugMap_CourseCategory>
{
    void Update(SlugMap_CourseCategory slugMap_CourseCategory);
}

