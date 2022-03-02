using CodingBible.Models.Identity;

namespace CodingBible.UnitOfWork.IRepository.Tokens
{
    public interface ITokensRepositoryAsync : IRepositoryAsync<ApplicationUserTokens>
    {
        void Update(ApplicationUserTokens token);
    }
}
