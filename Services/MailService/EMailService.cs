using CodingBible.Data;
using CodingBible.Models;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CodingBible.Services.MailService
{
    public class EMailService : IEMailService
    {
        public EMailService()
        {

        }

        public void SendMail(MailRequest mailRequest, MailProviders provider)
        {
            if (provider.Name.ToLower() != "sendgrid" && !provider.IsService)
            {
                NotServiceProvider(mailRequest, provider);
            }
            if (provider.Name.ToLower() == "sendgrid" && provider.IsService)
            {
                SendGridProvider(mailRequest, provider);
            }
        }

        public void NotServiceProvider(MailRequest mailRequest, MailProviders provider)
        {

            MailMessage myMessage = new MailMessage();
            myMessage.From = new MailAddress(provider.FromEmail, provider.DisplayName);
            myMessage.To.Add(mailRequest.ToEmail);
            myMessage.Subject = mailRequest.Subject;
            myMessage.IsBodyHtml = true;
            if (mailRequest.Attachments != null)
            {
                byte[] fileBytes;
                foreach (var file in mailRequest.Attachments)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        //(Stream contentStream, string? name, string ? mediaType
                        var attachment = new System.Net.Mail.Attachment(file.FileName);
                        myMessage.Attachments.Add(attachment);
                    }
                }
            }
            myMessage.Body = mailRequest.Body;

            SmtpClient mySmtpClient = new SmtpClient();
            NetworkCredential myCredential = new NetworkCredential(provider.FromEmail, provider.Password);
            mySmtpClient.Host = provider.Host;
            mySmtpClient.Port = provider.Port;

            mySmtpClient.UseDefaultCredentials = false;
            mySmtpClient.Credentials = myCredential;
            mySmtpClient.ServicePoint.MaxIdleTime = 1;

            mySmtpClient.Send(myMessage);
            myMessage.Dispose();
        }

        public Task SendGridProvider(MailRequest mailRequest, MailProviders provider)
        {
            var client = new SendGridClient(provider.ServiceSecretKey);
            var from = new EmailAddress(provider.FromEmail, provider.DisplayName);
            var to = new EmailAddress(mailRequest.ToEmail, "End User");
            var msg = MailHelper.CreateSingleEmail(from, to, mailRequest.Subject, "", mailRequest.Body);
            return client.SendEmailAsync(msg);
        }
    }
}
