using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models.Identity
{
    public class ApplicationUserTokens : IdentityUserToken<int>
    {
        [Required]
        public string ClientId { get; set; }

        // Get the Token Creation Date
        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public DateTime LastModifiedDate { get; set; }

        [Required]
        public DateTime ExpiryTime { get; set; }
        [Required]
        public string EncryptionKeyRt { get; set; }
        [Required]
        public string EncryptionKeyJwt { get; set; }
    }
}
