using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.ViewModels
{
    public class RegisterViewModel
    {
        [Required]
        [EmailAddress(ErrorMessage = Constants.DataAnotationErrorMessages.Email_notValid)]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        [StringLength(int.MaxValue, MinimumLength = 8, ErrorMessage = Constants.DataAnotationErrorMessages.PasswordMinLength_Error)]
        public string Password { get; set; }
        [Required]
        [StringLength(int.MaxValue, MinimumLength = 8, ErrorMessage = Constants.DataAnotationErrorMessages.PasswordMinLength_Error)]
        [Compare(nameof(Password), ErrorMessage = Constants.DataAnotationErrorMessages.Confirm_Password_error)]
        public string ConfirmPassword { get; set; }
        [Required]
        public string Firstname { get; set; }
        [Required]
        public string Lastname { get; set; }
        public bool IsActive { get; set; }
        public bool RememberMe { get; set; }
        public string ClientUrl { get; set; }
    }
}
