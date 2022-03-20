using Microsoft.AspNetCore.Identity;

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
