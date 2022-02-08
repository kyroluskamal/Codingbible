using CodingBible.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CodingBible.Models.Identity
{
    public class ApplicationUserRoleStore : RoleStore<ApplicationUserRole, ApplicationDbContext, int, IdentityUserRole<int>, IdentityRoleClaim<int>>
    {
        public ApplicationUserRoleStore(ApplicationDbContext context,
            IdentityErrorDescriber describer = null) : base(context, describer)
        {
        }
    }
}
