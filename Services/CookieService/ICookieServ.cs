using System.Collections.Generic;

namespace CodingBible.Services.CookieService
{
    public interface ICookieServ
    {
        void SetCookie(string key, string value, int? expireTime, bool isSecure, bool isHttpOnly);
        void SetCookie(string key, string value, int? expireTime);
        void DeleteCookie(string key);
        void DeleteAllCookies(IEnumerable<string> cookiesToDelete);
        string Get(string key);
        string GetUserIP();
        string GetUserCountry();
        string GetUserOS();
    }
}
