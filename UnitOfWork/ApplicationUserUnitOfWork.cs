using CodingBible.Data;
using CodingBible.Models.Identity;
using CodingBible.UnitOfWork.IRepository.MailProvider;
using CodingBible.UnitOfWork.IRepository.Posts;
using CodingBible.UnitOfWork.IRepository.Tokens;
using CodingBible.UnitOfWork.Repository.MailProvider;
using CodingBible.UnitOfWork.Repository.Posts;
using CodingBible.UnitOfWork.Repository.Tokens;
using CodingBible.UnitOfWork.IRepository.AttachmentRepo;
using CodingBible.UnitOfWork.Repository.AttachmentRepo;
using CodingBible.UnitOfWork.IRepository.MenuItems;
using CodingBible.UnitOfWork.Repository.MenuItems;
using CodingBible.UnitOfWork.IRepository.Menus;
using CodingBible.UnitOfWork.Repository.Menus;
using CodingBible.UnitOfWork.IRepository.Courses;
using CodingBible.UnitOfWork.Repository.Courses;

namespace CodingBible.UnitOfWork
{
    public class ApplicationUserUnitOfWork : IUnitOfWork_ApplicationUser
    {
        public IPostsRepositoryAsync Posts { get; }
        public ApplicationDbContext ApplicationDbContext { get; }
        public ApplicationUserRoleManager RoleManager { get; set; }
        public ICategoriesRepositoryAsync Categories { get; }
        public ITokensRepositoryAsync UserTokens { get; }
        public IMailProvidersRepositoryAsync MailProviders { get; }
        public IAttachmentsRepositoryAsync Attachments { get; }
        public IPostAttachmentsRepositoryAsync PostAttachments { get; }
        public IPostsCategoryRepositoryAsync PostsCategories { get; }
        public IMenuItemsRepositoryAsync MenuItems { get; }
        public IMenuRepositoryAsync Menus { get; }
        public IMenuMenuItemsRepositoryAsync MenuMenuItems { get; }
        public IMenuLocationsRespositoryAsync MenuLocations { get; }
        public ICourseCategoryRepositoryAsync CourseCategories { get; }
        public ICourseRepositoryAsync Courses { get; }
        public ICoursesPerCategoryRepositoryAsync CoursesPerCategories { get; }
        public ILessonRepositoryAsync Lessons { get; }
        public ISectionRepositoryAsync Sections { get; }
        public IStudentsPerCourseRepositoryAsync StudentsPerCourses { get; }
        public ApplicationUserUnitOfWork(ApplicationDbContext applicationDbContext,
            ApplicationUserRoleManager roleManager)
        {
            ApplicationDbContext = applicationDbContext;
            RoleManager = roleManager;
            Posts = new PostsRepoAsync(applicationDbContext);
            UserTokens = new TokensRepositoryAsync(applicationDbContext);
            MailProviders = new MailProviderRepositoryAsync(applicationDbContext);
            Categories = new CategoriesRepositoryAsync(applicationDbContext);
            Attachments = new AttachmentsRespositoryAsync(applicationDbContext);
            PostAttachments = new PostAttachmentsRepositoryAsync(applicationDbContext);
            PostsCategories = new PostsCategoryRepositoryAsync(applicationDbContext);
            MenuItems = new MenuItemRepositoryAsync(applicationDbContext);
            Menus = new MenuRespositoryAsync(applicationDbContext);
            MenuMenuItems = new MenuMenuItemsRepositoryAsync(applicationDbContext);
            MenuLocations = new MenuLocationsRepositoryAsync(applicationDbContext);
            CourseCategories = new CourseCategoryRepositoryAsync(applicationDbContext);
            Courses = new CourseRepositoryAsync(applicationDbContext);
            CoursesPerCategories = new CoursesPerCategoryRepositoryAsync(applicationDbContext);
            Lessons = new LessonRepositoryAsync(applicationDbContext);
            Sections = new SectionRepositoryAsync(applicationDbContext);
            StudentsPerCourses = new StudentsPerCourseRepositoryAsync(applicationDbContext);
        }
        public async void Dispose()
        {
            await ApplicationDbContext.DisposeAsync();
        }

        public async Task<int> SaveAsync()
        {
            return await ApplicationDbContext.SaveChangesAsync();
        }

        public int Save()
        {
            return ApplicationDbContext.SaveChanges();
        }
    }
}
