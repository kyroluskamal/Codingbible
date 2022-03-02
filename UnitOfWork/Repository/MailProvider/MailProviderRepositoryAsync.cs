using CodingBible.Data;
using CodingBible.Models;
using CodingBible.UnitOfWork.IRepository.MailProvider;

namespace CodingBible.UnitOfWork.Repository.MailProvider
{
    public class MailProviderRepositoryAsync : ApplicationUserRepositoryAsync<MailProviders>, IMailProvidersRepositoryAsync
    {
        public MailProviderRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
            ApplicationDbContext = applicationDbContext;
        }

        public ApplicationDbContext ApplicationDbContext { get; }

        public void Update(MailProviders provider)
        {
            ApplicationDbContext.MailProviders.Update(provider);
        }
    }
}
