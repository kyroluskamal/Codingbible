using CodingBible.Models.Identity;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public bool IsActive { get; set; }
        public bool RememberMe { get; set; }
    }
}