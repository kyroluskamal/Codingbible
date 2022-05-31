using CodingBible.Models.Courses;

namespace CodingBible.UnitOfWork.IRepository.Courses;

public interface ILessonAttachmentsRespositoryAsync : IRepositoryAsync<LessonAttachments>
{
    void Update(LessonAttachments lessonAttachment);
}