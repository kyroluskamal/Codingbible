using CodingBible.Models;
using CodingBible.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
        public DbSet<ActivityModel> Activities { get; set; }
        public DbSet<MailProviders> MailProviders { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUserRole>().HasData(
                new { Id = 1, Name = "Administrator", NormalizedName = "ADMINISTRATOR", Handle = "administrator", RoleIcon = "/uploads/roles/icons/default/role.png", IsActive = true },
                new { Id = 2, Name = "Customer", NormalizedName = "CUSTOMER", Handle = "customer", RoleIcon = "/uploads/roles/icons/default/role.png", IsActive = true }
            );

            builder.Entity<ApplicationUserRole>()
                .HasMany(x => x.RolePermission)
                .WithOne(x => x.ApplicationUserRole)
                .HasForeignKey(x => x.ApplicationUserRoleId);

           
        }
    }
}