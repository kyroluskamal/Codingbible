using CodingBible.Services.ConstantsService;
using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models
{
    public class ForgetPasswordModel
    {
        [Required]
        [EmailAddress(ErrorMessage = Constants.DataAnotationErrorMessages.Email_notValid)]
        public string Email { get; set; }
        public string ClientUrl { get; set; }
    }
}
