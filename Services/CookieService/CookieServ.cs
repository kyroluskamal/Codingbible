using CodingBible.Models;
using CodingBible.Services.ConstantsService;
using Microsoft.AspNetCore.DataProtection;
using Newtonsoft.Json;
using Serilog;
using System.Globalization;

namespace CodingBible.Services.CookieService
{
    public class CookieServ : ICookieServ
    {
        private readonly CookieOptions _cookieOptions;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IServiceProvider Provider;
        private IWebHostEnvironment Env { get; }

        public CookieServ(CookieOptions cookieOptions, IWebHostEnvironment env,
         IHttpContextAccessor httpContextAccessor, IServiceProvider provider)
        {
            _cookieOptions = cookieOptions;
            _httpContextAccessor = httpContextAccessor;
            Provider = provider;
            Env = env;
        }

        public string Get(string key)
        {
            return _httpContextAccessor.HttpContext.Request.Cookies[key];
        }

        public void SetCookie(string key, string value, TimeSpan? expireTime,
         bool isSecure = true, bool isHttpOnly = true)
        {
            if (expireTime.HasValue)
            {
                _cookieOptions.MaxAge = expireTime;
            }
            _cookieOptions.Secure = isSecure;
            _cookieOptions.HttpOnly = isHttpOnly;
            _cookieOptions.IsEssential = true;
            _cookieOptions.Domain = Env.IsDevelopment() ? "" : "coding-bible.com";
            _cookieOptions.SameSite = SameSiteMode.None;
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, _cookieOptions);
        }
        public void SetCookie(string key, string value, bool isSecure = true, bool isHttpOnly = true)
        {
            _cookieOptions.Secure = isSecure;
            _cookieOptions.HttpOnly = isHttpOnly;
            _cookieOptions.Domain = Env.IsDevelopment() ? "" : "coding-bible.com";
            // _cookieOptions.Path = "/";
            _cookieOptions.SameSite = SameSiteMode.None;
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
            _cookieOptions.SameSite = SameSiteMode.None;
            _cookieOptions.Domain = Env.IsDevelopment() ? "" : "coding-bible.com";
            // _cookieOptions.Path = "/";
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
                if (_httpContextAccessor.HttpContext.Request.Cookies.ContainsKey(key))
                {
                    _httpContextAccessor.HttpContext.Response.Cookies.Delete(key);
                    _httpContextAccessor.HttpContext.Response.Cookies.Append(key, "", new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(-1),
                        HttpOnly = false,
                        SameSite = SameSiteMode.None,
                        Domain = Env.IsDevelopment() ? "" : "coding-bible.com",
                        Secure = true
                    });
                }
            }
            _httpContextAccessor.HttpContext.Response.Cookies.Append(Constants.CookieName.loginStatus, "0", new CookieOptions()
            {
                HttpOnly = false,
                SameSite = SameSiteMode.None,
                Domain = Env.IsDevelopment() ? "" : "coding-bible.com",
                Secure = true
            });
            _httpContextAccessor.HttpContext.Response.Cookies.Append(Constants.CookieName.refershTokenExpire, "0", new CookieOptions()
            {
                HttpOnly = false,
                SameSite = SameSiteMode.None,
                Domain = Env.IsDevelopment() ? "" : "coding-bible.com",
                Secure = true
            });
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
        public string GetUserID()
        {
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
                RegionInfo regionalInfo = new(ipInfo.Country);
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
            if (rememberMe)
            {
                SetCookie(Constants.CookieName.Access_token, accessToken.Token, expireTime, true, false);
                SetCookie(Constants.CookieName.refreshToken, accessToken.RefreshToken, accessToken.RefreshTokenExpiration, true, false);
                SetCookie(Constants.CookieName.loginStatus, "1", accessToken.RefreshTokenExpiration, true, false);
                SetCookie(Constants.CookieName.Username, user.UserName, accessToken.RefreshTokenExpiration, true, false);
                SetCookie(Constants.CookieName.userRole, string.Join(",", roles), accessToken.RefreshTokenExpiration, true, false);
                SetCookie(Constants.CookieName.User_id, accessToken.UserId, accessToken.RefreshTokenExpiration, true, false);
                SetCookie(Constants.CookieName.refershTokenExpire, refExp, accessToken.RefreshTokenExpiration, true, false);
            }
            else
            {
                SetCookie(Constants.CookieName.Access_token, accessToken.Token, true, false);
                SetCookie(Constants.CookieName.refreshToken, accessToken.RefreshToken, true, false);
                SetCookie(Constants.CookieName.loginStatus, "1", true, false);
                SetCookie(Constants.CookieName.Username, user.UserName, true, false);
                SetCookie(Constants.CookieName.userRole, string.Join(",", roles), true, false);
                SetCookie(Constants.CookieName.User_id, accessToken.UserId, true, false);
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
