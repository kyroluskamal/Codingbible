using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace CodingBible.Models.Identity
{
    public class ApplicationUserRole : IdentityRole<int>
    {
        public ApplicationUserRole()
        {
        }

        public ApplicationUserRole(string roleName) : base(roleName)
        {
        }
        public string RoleIcon { get; set; }
        public string Handle { get; set; }
        public bool IsActive { get; set; }
        public ICollection<RolePermission> RolePermission { get; set; }
    }
}
