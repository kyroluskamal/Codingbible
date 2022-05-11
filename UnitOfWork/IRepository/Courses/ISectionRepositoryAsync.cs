using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ISectionRepositoryAsync : IRepositoryAsync<Section>
{
    void Update(Section section);
}
