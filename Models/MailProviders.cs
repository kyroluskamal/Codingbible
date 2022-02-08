namespace CodingBible.Models
{
    public class MailProviders
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsService { get; set; }
        public string ServiceSecretKey { get; set; }
        public string ServiceEmail { get; set; }
        public string FromEmail { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool IsDefault { get; set; }
    }
}
