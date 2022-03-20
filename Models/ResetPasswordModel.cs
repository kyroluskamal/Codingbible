using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models
{
    public class ResetPasswordModel
    {
        [Required]
        [EmailAddress(ErrorMessage = Constants.DataAnotationErrorMessages.Email_notValid)]
        public string Email { get; set; }
        public string Token { get; set; }
        [Required]
        [StringLength(int.MaxValue, MinimumLength = 8, ErrorMessage = Constants.DataAnotationErrorMessages.PasswordMinLength_Error)]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [StringLength(int.MaxValue, MinimumLength = 8, ErrorMessage = Constants.DataAnotationErrorMessages.PasswordMinLength_Error)]
        [Compare(nameof(Password), ErrorMessage = Constants.DataAnotationErrorMessages.Confirm_Password_error)]
        public string ConfirmPassword { get; set; }
    }
}
