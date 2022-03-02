using CodingBible.Models;

namespace CodingBible.UnitOfWork.IRepository.MailProvider
{
    public interface IMailProvidersRepositoryAsync : IRepositoryAsync<MailProviders>
    {
        void Update(MailProviders provider);
    }
}
