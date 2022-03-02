using CodingBible.Data;
using CodingBible.Models.Identity;
using CodingBible.UnitOfWork.IRepository.Tokens;

namespace CodingBible.UnitOfWork.Repository.Tokens
{
    public class TokensRepositoryAsync : ApplicationUserRepositoryAsync<ApplicationUserTokens>, ITokensRepositoryAsync
    {
        public TokensRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
            ApplicationDbContext = applicationDbContext;
        }

        public ApplicationDbContext ApplicationDbContext { get; }

        public void Update(ApplicationUserTokens token)
        {
            ApplicationDbContext.UserTokens.Update(token);
        }
    }
}
