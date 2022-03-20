using CodingBible.Models.Posts;
using Microsoft.AspNetCore.Identity;

namespace CodingBible.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public bool IsActive { get; set; }
        public bool RememberMe { get; set; }
        public virtual ICollection<Post> Post { get; set; }
    }
}