using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class SectionRepositoryAsync : ApplicationUserRepositoryAsync<Section>, ISectionRepositoryAsync
{
    public SectionRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(Section section)
    {
        ApplicationDbContext.Sections.Update(section);
    }
}
