using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.ViewModels;
using System.Net;

namespace CodingBible.Services.TokenService
{
    public interface ITokenServ
    {
        //Task<TokenResponseModel> GenerateNewToken();
        Task<TokenResponseModel> RefreshToken(ApplicationUser user, List<string> roles, ApplicationUserTokens RtFromDb);
        Task<TokenResponseModel> GenerateNewToken(ApplicationUser user, List<string> roles);
        //TokenResponseModel CreateErrorResponseToken(string errorMessage, HttpStatusCode statusCode);
        //ResponseStatusInfoModel CreateResponse(string errorMessage, HttpStatusCode statusCode);
        ApplicationUserTokens CreateRefreshToken(string clientId, ApplicationUser user, int expireTime);
        Task<ResponseObject> ValidateAuthTokenAsync(ApplicationUser user, ApplicationUserTokens userOldToken, string UsernameFromCookie);
        string GetLoggedInUserId();
    }
}
