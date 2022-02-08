using CodingBible.Models;

namespace CodingBible.Services.MailService
{
    public interface IEMailService
    {
        void SendMail(MailRequest mailRequest, MailProviders provider);
    }
}
