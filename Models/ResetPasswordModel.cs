using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models
{
    public class ResetPasswordModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string Token { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = Constants.DataAnotationErrorMessages.Confirm_Password_error)]
        public string ConfirmPassword { get; set; }
    }
}
