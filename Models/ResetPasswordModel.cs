using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models
{
    public class ResetPasswordModel
    {
        public string Email { get; set; }
        public string Token { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = Constants.DataAnotationErrorMessages.Confirm_Password_error)]
        public string ConfirmPassword { get; set; }
    }
}
