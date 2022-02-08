using CodingBible.Models;
using CodingBible.ViewModels;
using System.Threading.Tasks;

namespace CodingBible.Services.AuthenticationService
{
    public interface IAuthService
    {
        Task<TokenResponseModel> Auth(LoginViewModel model);
    }
}
