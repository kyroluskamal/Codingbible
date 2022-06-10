using CodingBible.UnitOfWork.IRepository.MailProvider;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.UnitOfWork.IRepository.Tokens;
using CodingBible.UnitOfWork.IRepository.AttachmentRepo;
using CodingBible.UnitOfWork.IRepository.MenuItems;
using CodingBible.UnitOfWork.IRepository.Menus;
using CodingBible.UnitOfWork.IRepository.Courses;
using CodingBible.UnitOfWork.IRepository.SlugMap;

namespace CodingBible.UnitOfWork
{
    public interface IUnitOfWork_ApplicationUser : IDisposable
    {
        IPostsRepositoryAsync Posts { get; }
        ITokensRepositoryAsync UserTokens { get; }
        IMailProvidersRepositoryAsync MailProviders { get; }
        ICategoriesRepositoryAsync Categories { get; }
        IAttachmentsRepositoryAsync Attachments { get; }
        IPostAttachmentsRepositoryAsync PostAttachments { get; }
        IPostsCategoryRepositoryAsync PostsCategories { get; }
        IMenuItemsRepositoryAsync MenuItems { get; }
        IMenuRepositoryAsync Menus { get; }
        IMenuMenuItemsRepositoryAsync MenuMenuItems { get; }
        IMenuLocationsRespositoryAsync MenuLocations { get; }
        ICourseCategoryRepositoryAsync CourseCategories { get; }
        ICourseRepositoryAsync Courses { get; }
        ICoursesPerCategoryRepositoryAsync CoursesPerCategories { get; }
        ILessonRepositoryAsync Lessons { get; }
        ISectionRepositoryAsync Sections { get; }
        IStudentsPerCourseRepositoryAsync StudentsPerCourses { get; }
        ILessonAttachmentsRespositoryAsync LessonAttachments { get; }
        ISlugMap_CoursesRespositoryAsync SlugMap_Courses { get; }
        ISlugMap_PostsRespositoryAsync SlugMap_Posts { get; }
        ISlugMap_LessonsRespositoryAsync SlugMap_Lessons { get; }
        ISlugMap_SectionsRespositoryAsync SlugMap_Sections { get; }
        ISlugMap_CategoryRespositoryAsync SlugMap_Categories { get; }
        ISlugMap_CourseCategoryRespositoryAsync SlugMap_CourseCategories { get; }
        Task<int> SaveAsync();
        int Save();
    }
}
