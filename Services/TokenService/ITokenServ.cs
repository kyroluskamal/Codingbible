using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.ViewModels;
using System.Net;

namespace CodingBible.Services.TokenService
{
    public interface ITokenServ
    {
        Task<TokenResponseModel> GenerateNewToken();
        Task<TokenResponseModel> GenerateNewToken(TokenRequestModel model);
        Task<TokenResponseModel> CreateAccessToken(ApplicationUser user);
        Task<TokenResponseModel> RefreshToken(TokenRequestModel model);
        Task<TokenResponseModel> GenerateNewToken(ApplicationUser user, LoginViewModel model);
        TokenResponseModel CreateErrorResponseToken(string errorMessage, HttpStatusCode statusCode);
        ResponseStatusInfoModel CreateResponse(string errorMessage, HttpStatusCode statusCode);
        ApplicationUserTokens CreateRefreshToken(string clientId, ApplicationUser user, int expireTime);
        string GetLoggedInUserId();
    }
}
