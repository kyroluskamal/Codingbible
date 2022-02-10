using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models
{
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress(ErrorMessage =Constants.DataAnotationErrorMessages.Email_notValid)]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare(nameof(Password), ErrorMessage = Constants.DataAnotationErrorMessages.Confirm_Password_error)]
        public string ConfirmPassword { get; set; }
        [Required]
        public string Firstname { get; set; }
        [Required]
        public string Lastname { get; set; }
        public bool IsActive  { get; set; }
        public bool RememberMe  { get; set; }
        public string ClientUrl { get; set; }
    }
}
