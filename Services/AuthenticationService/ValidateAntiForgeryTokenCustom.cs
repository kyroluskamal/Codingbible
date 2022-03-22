using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;
namespace CodingBible.Services.AuthenticationService
{
    public class ValidateAntiForgeryTokenCustom : ActionFilterAttribute
    {
        private const string XsrfCookieName = "XSRF-TOKEN";

        private const string XsrfHeaderName = "scfD1z5dp2";

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string requestMethod = filterContext.HttpContext.Request.Method;

            bool isValid = true;

            if (requestMethod != "GET")
            {
                var headerToken = filterContext.HttpContext.Request.Headers.TryGetValue(XsrfHeaderName, out var hToken);
                Trace.WriteLine(headerToken);
                var cookieToken = filterContext.HttpContext.Request.Cookies.TryGetValue(XsrfCookieName, out var cookie_Token);
                Trace.WriteLine(cookieToken);
                // check for missing cookie or header
                if (!cookieToken || !headerToken)
                {
                    isValid = false;
                }

                //ensure that the cookie matches the header
                if (isValid && !hToken.ToString().Contains(cookie_Token.ToString()))
                {
                    isValid = false;
                }

                if (!isValid)
                {
                    filterContext.Result = new UnauthorizedObjectResult(new { cookieToken = hToken, headerToken = cookie_Token });
                    return;
                }
            }

            base.OnActionExecuting(filterContext);
        }

        //public override void OnActionExecuted(ActionExecutedContext actionExecutedContext)
        //{
        //    string textToHash = RandomString(30);
        //    Debug.WriteLine("Called");
        //    string cookieText = HashText(textToHash, CsrfTokenSalt);

        //    var cookie = new CookieHeaderValue(XsrfCookieName, HttpUtility.UrlEncode(cookieText));

        //    /* don't use this flag if you're not using HTTPS */
        //    cookie.Secure = true;
        //    cookie.HttpOnly = false; // javascript needs to be able to get this in order to pass it back in the headers in the next request

        //    /* if you have different environments on the same domain (which I did in one application using this code) make sure you set the path to be ApplicationPath of the request. Case sensitivity does matter in Chrome and IE, so be wary of that. */
        //    cookie.Path = "/";

        //    actionExecutedContext.HttpContext.Response.Cookies.Append(XsrfCookieName, cookieText, new CookieOptions() { HttpOnly = false, Secure = false, Path = "/" });

        //    base.OnActionExecuted(actionExecutedContext);
        //}
        //public static string HashText(string text, string salt)
        //{
        //    SHA512Managed hashString = new SHA512Managed();

        //    byte[] textWithSaltBytes = Encoding.UTF8.GetBytes(string.Concat(text, salt));
        //    byte[] hashedBytes = hashString.ComputeHash(textWithSaltBytes);

        //    hashString.Clear();

        //    return Convert.ToBase64String(hashedBytes);
        //}
        //public static string RandomString(int length)
        //{
        //    Random random = new Random();
        //    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        //    return new string(Enumerable.Repeat(chars, length)
        //        .Select(s => s[random.Next(s.Length)]).ToArray());
        //}
    }
}
