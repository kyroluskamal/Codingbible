using CodingBible.Models;

namespace CodingBible.Services.CookieService
{
    public interface ICookieServ
    {
        void SetCookie(string key, string value, TimeSpan? expireTime, bool isSecure = true, bool isHttpOnly = true);
        void SetCookie(string key, string value, bool isSecure = true, bool isHttpOnly = true);
        void SetRequiredCookies(TokenResponseModel accessToken, ApplicationUser user, List<string> roles, TimeSpan expireTime, bool rememberMe);
        void DeleteCookie(string key);
        void DeleteAllCookies();
        string Get(string key);
        void SetSession(string key, string value);
        string GetUserIP();
        string GetUserCountry();
        string GetUserOS();
        string GetUserID();
    }
}
