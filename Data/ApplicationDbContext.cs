using CodingBible.Models;
using CodingBible.Models.Menus;
using CodingBible.Models.Identity;
using CodingBible.Models.Posts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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

            builder.Entity<Post>().HasIndex(x => x.Slug).IsUnique();

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

            /*************************************************************************
            *                            Set defalut values
            **************************************************************************/
            builder.Entity<Post>().Property(x => x.EditFrequency).HasDefaultValue("monthly");
            builder.Entity<Post>().Property(x => x.Priority).HasDefaultValue(0.5f);
            builder.Entity<Post>().Property(x => x.DateCreated).HasDefaultValue(DateTime.Now);
            builder.Entity<Post>().Property(x => x.LasModified).HasDefaultValue(DateTime.Now);
            base.OnModelCreating(builder);
        }
    }
}