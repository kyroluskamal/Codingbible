using Newtonsoft.Json;
using Serilog;
using System.Globalization;
using CodingBible.Services.ConstantsService;
using CodingBible.Models;
using Microsoft.AspNetCore.DataProtection;
using CodingBible.Models.Identity;
using CodingBible.Data;

namespace CodingBible.Services.CookieService
{
    public class CookieServ : ICookieServ
    {
        private readonly CookieOptions _cookieOptions;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IServiceProvider Provider;

        public CookieServ(CookieOptions cookieOptions, IHttpContextAccessor httpContextAccessor, IServiceProvider provider)
        {
            _cookieOptions = cookieOptions;
            _httpContextAccessor = httpContextAccessor;
            Provider = provider;
        }

        public string Get(string key)
        {
            return _httpContextAccessor.HttpContext.Request.Cookies[key];
        }

        public void SetCookie(string key, string value, TimeSpan? expireTime, bool isSecure=true, bool isHttpOnly=true)
        {
            if (expireTime.HasValue)
            {
                _cookieOptions.MaxAge = expireTime;
            }
            _cookieOptions.Secure = isSecure;
            _cookieOptions.HttpOnly = isHttpOnly;
            _cookieOptions.IsEssential = true;
            _cookieOptions.SameSite = SameSiteMode.Strict;
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, _cookieOptions);
        }
        public void SetCookie(string key, string value, bool isSecure=true, bool isHttpOnly=true)
        {
            _cookieOptions.Secure = isSecure;
            _cookieOptions.HttpOnly = isHttpOnly;
            _cookieOptions.IsEssential = true;
            _cookieOptions.SameSite = SameSiteMode.Strict;
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, _cookieOptions);
        }

        public void DeleteCookie(string key)
        {
            _httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
        }
        public void SetSession(string key, string value)
        {
            _cookieOptions.Secure = true;
            _cookieOptions.HttpOnly = true;
            _cookieOptions.SameSite = SameSiteMode.Strict;
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, _cookieOptions);
        }
        public void DeleteAllCookies()
        {
            string[] cookiesToDelete = { Constants.CookieName.TwoFactorToken,
            Constants.CookieName.MemberId, Constants.CookieName.RememberDevice,
            Constants.CookieName.User_id, Constants.CookieName.Access_token,Constants.CookieName.TwoFactorToken,
            Constants.CookieName.userRole,Constants.CookieName.refreshToken, Constants.CookieName.Username};
            foreach (var key in cookiesToDelete)
            {
                if(_httpContextAccessor.HttpContext.Request.Cookies.ContainsKey(key))
                _httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
            }
            _httpContextAccessor.HttpContext.Response.Cookies.Append(Constants.CookieName.loginStatus, "0", new CookieOptions() { HttpOnly=false, Secure=false});
            _httpContextAccessor.HttpContext.Response.Cookies.Append(Constants.CookieName.refershTokenExpire, "0", new CookieOptions() { HttpOnly = false, Secure=false });
        }

        public string GetUserIP()
        {
            string userIp = "unknown";
            try
            {
                userIp = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return userIp;
        }
        public string GetUserID(){
            var protectedUserId = Get(Constants.CookieName.User_id);
             var protectorProvider = Provider.GetService<IDataProtectionProvider>();

                /* STEP 5. create a protector instance */
                var protector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);

                /* STEP 6. Layer One Unprotect the user id */
                var decryptedUid = protector.Unprotect(protectedUserId);
                return decryptedUid;
        }
        public string GetUserCountry()
        {
            try
            {
                string userIp = GetUserIP();
                string info = new HttpClient().GetAsync("http://ipinfo.io/" + userIp).GetAwaiter().GetResult().ToString();
                var ipInfo = JsonConvert.DeserializeObject<IpInfo>(info);
                RegionInfo regionalInfo = new (ipInfo.Country);
                ipInfo.Country = regionalInfo.EnglishName;

                if (!string.IsNullOrEmpty(userIp))
                {
                    return ipInfo.Country;
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return "unknown";
        }
        public void SetRequiredCookies(TokenResponseModel accessToken, ApplicationUser user, List<string> roles, TimeSpan expireTime, bool rememberMe)
        {
            var exp = (DateTime.Now + accessToken.RefreshTokenExpiration);
            var refExp = $"{exp.Year}-{exp.Month}-{exp.Day} {exp.Hour}:{exp.Minute}:{exp.Second}";
            if (rememberMe) {
                SetCookie(Constants.CookieName.Access_token, accessToken.Token, expireTime);
                SetCookie(Constants.CookieName.refreshToken, accessToken.RefreshToken, accessToken.RefreshTokenExpiration);
                SetCookie(Constants.CookieName.loginStatus, "1", accessToken.RefreshTokenExpiration, false, false);
                SetCookie(Constants.CookieName.Username, user.UserName, accessToken.RefreshTokenExpiration);
                SetCookie(Constants.CookieName.userRole, string.Join(",", roles), accessToken.RefreshTokenExpiration);
                SetCookie(Constants.CookieName.User_id, accessToken.UserId, accessToken.RefreshTokenExpiration);
                SetCookie(Constants.CookieName.refershTokenExpire, refExp, accessToken.RefreshTokenExpiration, true, false);
            }
            else
            {
                SetCookie(Constants.CookieName.Access_token, accessToken.Token);
                SetCookie(Constants.CookieName.refreshToken, accessToken.RefreshToken);
                SetCookie(Constants.CookieName.loginStatus, "1", false, false);
                SetCookie(Constants.CookieName.Username, user.UserName, true, true);
                SetCookie(Constants.CookieName.userRole, string.Join(",", roles),  true, true);
                SetCookie(Constants.CookieName.User_id, accessToken.UserId);
                SetCookie(Constants.CookieName.refershTokenExpire, "0", true, false);
            }
        }
        public string GetUserOS()
        {
            string userOs = "unknown";
            try
            {
                userOs = _httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
            return userOs;
        }
    }
}
