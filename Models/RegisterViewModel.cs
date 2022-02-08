namespace CodingBible.Models
{
    public class RegisterViewModel
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public bool IsActive = false;
        public bool RememberMe = false;
        public bool Gender { get; set; }
        public string ClientUrl { get; set; }
    }
}
