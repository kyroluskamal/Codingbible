using CodingBible.Data;
using CodingBible.Models.Courses;
using CodingBible.UnitOfWork.IRepository.Courses;

namespace CodingBible.UnitOfWork.Repository.Courses;

public class LessonAttachmentsRespositoryAsync : ApplicationUserRepositoryAsync<LessonAttachments>, ILessonAttachmentsRespositoryAsync
{
    public LessonAttachmentsRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
    }
    public ApplicationDbContext ApplicationDbContext { get; }
    public void Update(LessonAttachments lessonAttachments)
    {
        ApplicationDbContext.LessonAttachments.Update(lessonAttachments);
    }
}
