using CodingBible.Models;
using CodingBible.Models.Menus;
using CodingBible.Models.Identity;
using CodingBible.Models.Posts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CodingBible.Models.Courses;

namespace CodingBible.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationUserRole, int, IdentityUserClaim<int>, IdentityUserRole<int>,
    IdentityUserLogin<int>, IdentityRoleClaim<int>, ApplicationUserTokens>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            if (Database.GetPendingMigrationsAsync().GetAwaiter().GetResult().Any())
            {
                Database.MigrateAsync().GetAwaiter().GetResult();
            }
        }
        public DbSet<MailProviders> MailProviders { get; set; }
        public DbSet<Attachments> Attachments { get; set; }
        public DbSet<PostAttachments> PostAttachments { get; set; }
        public DbSet<PostsCategory> PostsCategories { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<MenuMenuItems> MenuMenuItems { get; set; }
        public DbSet<MenuLocations> MenuLocations { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseCategory> CourseCategories { get; set; }
        public DbSet<CoursesPerCategory> CoursesPerCategories { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<StudentsPerCourse> StudentsPerCourses { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<ApplicationUserRole>()
                .HasMany(x => x.RolePermission)
                .WithOne(x => x.ApplicationUserRole)
                .HasForeignKey(x => x.ApplicationUserRoleId);
            /*********************************************************************************
            *                               Self Referencing 
            **********************************************************************************/
            builder.Entity<Category>()
                .HasOne(e => e.Parent)
                .WithMany()
                .HasForeignKey(e => e.ParentKey);
            builder.Entity<MenuItem>()
                .HasOne(e => e.Parent)
                .WithMany()
                .HasForeignKey(e => e.ParentKey);
            /*********************************************************************************
            *                               One to many relationship
            **********************************************************************************/
            builder.Entity<ApplicationUser>()
                .HasMany(e => e.Post)
                .WithOne(e => e.Author)
                .HasForeignKey(e => e.AuthorId);
            builder.Entity<ApplicationUser>()
                .HasMany(e => e.Course)
                .WithOne(e => e.Author)
                .HasForeignKey(e => e.AuthorId);
            /*********************************************************************************
            *                               Many to many relationShip 
            **********************************************************************************/
            builder.Entity<PostsCategory>()
                .HasKey(x => new { x.PostId, x.CategoryId });
            builder.Entity<PostsCategory>()
                .HasOne(x => x.Posts)
                .WithMany(x => x.PostsCategories)
                .HasForeignKey(x => x.PostId);
            builder.Entity<PostsCategory>()
                .HasOne(x => x.Categories)
                .WithMany(x => x.PostsCategories)
                .HasForeignKey(x => x.CategoryId);

            builder.Entity<PostAttachments>()
                .HasKey(x => new { x.PostId, x.AttachmentId });
            builder.Entity<PostAttachments>()
                .HasOne(x => x.Post)
                .WithMany(x => x.Attachments)
                .HasForeignKey(x => x.PostId);
            builder.Entity<PostAttachments>()
                .HasOne(x => x.Attachment)
                .WithMany(x => x.Posts)
                .HasForeignKey(x => x.AttachmentId);

            builder.Entity<MenuMenuItems>()
                .HasKey(x => new { x.MenuId, x.MenuItemId });
            builder.Entity<MenuMenuItems>()
                .HasOne(x => x.Menu)
                .WithMany(x => x.MenuItems)
                .HasForeignKey(x => x.MenuId);
            builder.Entity<MenuMenuItems>()
                .HasOne(x => x.MenuItem)
                .WithMany(x => x.AssociatedMenus)
                .HasForeignKey(x => x.MenuItemId);

            builder.Entity<CoursesPerCategory>()
                .HasKey(x => new { x.CourseId, x.CourseCategoryId });
            builder.Entity<CoursesPerCategory>()
                .HasOne(x => x.Course)
                .WithMany(x => x.CoursesPerCategories)
                .HasForeignKey(x => x.CourseId);
            builder.Entity<CoursesPerCategory>()
                .HasOne(x => x.CourseCategory)
                .WithMany(x => x.CoursesPerCategories)
                .HasForeignKey(x => x.CourseCategoryId);

            builder.Entity<StudentsPerCourse>()
                .HasKey(x => new { x.CourseId, x.StudentId });
            builder.Entity<StudentsPerCourse>()
                .HasOne(x => x.Course)
                .WithMany(x => x.Students)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.NoAction);
            builder.Entity<StudentsPerCourse>()
                .HasOne(x => x.Student)
                .WithMany(x => x.Courses)
                .HasForeignKey(x => x.StudentId);
            /*************************************************************************
            *                            Set defalut values
            **************************************************************************/
            builder.Entity<Post>().Property(x => x.EditFrequency).HasDefaultValue("monthly");
            builder.Entity<Post>().Property(x => x.Priority).HasDefaultValue(0.5f);
            builder.Entity<Post>().Property(x => x.DateCreated).HasDefaultValue(DateTime.Now);
            builder.Entity<Post>().Property(x => x.LasModified).HasDefaultValue(DateTime.Now);
            builder.Entity<Course>().Property(x => x.NeedsEnrollment).HasDefaultValue(false);
            builder.Entity<Course>().Property(x => x.DateCreated).HasDefaultValue(DateTime.Now);
            builder.Entity<Course>().Property(x => x.LastModified).HasDefaultValue(DateTime.Now);
            builder.Entity<Section>().Property(x => x.IsLeafSection).HasDefaultValue(false);
            builder.Entity<Section>().Property(x => x.Status).HasDefaultValue(0);
            builder.Entity<Lesson>().Property(x => x.Status).HasDefaultValue(0);

            /*************************************************************************
            *                            Set Unique values
            ***************************************************************************/
            builder.Entity<Post>().HasIndex(x => x.Slug).IsUnique();
            builder.Entity<Course>().HasIndex(x => x.Slug).IsUnique();
            builder.Entity<Course>().HasIndex(x => x.Name).IsUnique();
            builder.Entity<Category>().HasIndex(x => x.Slug).IsUnique();
            builder.Entity<CourseCategory>().HasIndex(x => x.Slug).IsUnique();
            builder.Entity<CourseCategory>().HasIndex(x => x.Name).IsUnique();

            base.OnModelCreating(builder);
        }
    }
}