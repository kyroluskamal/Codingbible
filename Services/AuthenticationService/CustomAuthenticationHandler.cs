using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.TokenService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace CodingBible.Services.AuthenticationService
{
    public class CustomAuthenticationHandler : AuthenticationHandler<CustomAuthenticationOptions>
    {
        private readonly ApplicationUserManager UserManager;
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        private readonly IServiceProvider Provider;
        private readonly ITokenServ TokenService;
        private readonly ICookieServ CookieService;

        public CustomAuthenticationHandler(IOptionsMonitor<CustomAuthenticationOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock
            , IServiceProvider provider, ITokenServ tokenService, ICookieServ cookieService, ApplicationUserManager userManager, IUnitOfWork_ApplicationUser unitOfWork) : base(options, logger, encoder, clock)
        {
            Provider = provider;
            TokenService = tokenService;
            CookieService = cookieService;
            UserManager = userManager;
            UnitOfWork = unitOfWork;
        }
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Cookies.ContainsKey(Constants.CookieName.Access_token) || !Request.Cookies.ContainsKey(Constants.CookieName.User_id))
            {
                Log.Error("No Access Token or User Id found.");
                return await Task.FromResult(AuthenticateResult.NoResult());
            }

            if (!AuthenticationHeaderValue.TryParse($"{"Bearer " + Request.Cookies[Constants.CookieName.Access_token]}",
               out AuthenticationHeaderValue headerValue))
            {
                Log.Error("Could not Parse Token from Authentication Header.");
                return await Task.FromResult(AuthenticateResult.NoResult());
            }

            if (!AuthenticationHeaderValue.TryParse($"{"Bearer " + Request.Cookies[Constants.CookieName.User_id]}",
                out AuthenticationHeaderValue headerValueUid))
            {
                Log.Error("Could not Parse User Id from Authentication Header.");
                return await Task.FromResult(AuthenticateResult.NoResult());
            }

            try
            {
                /* STEP 1. Get the Validation Parameters for our applications JWT Token */
                var key = Encoding.ASCII.GetBytes(Constants.AppSettings.Secret);

                /* STEP 2. Create an instance of Jwt token handler */
                var handler = new JwtSecurityTokenHandler();

                /* STEP 3. Create an instance of Jwt token  validation parameters */
                TokenValidationParameters validationParameters =
                   new()
                   {
                       ValidateIssuerSigningKey = true,
                       ValidateIssuer = true,
                       ValidateAudience = true,
                       ValidIssuer = Constants.AppSettings.Site,
                       ValidAudience = Constants.AppSettings.Audience,
                       IssuerSigningKey = new SymmetricSecurityKey(key),
                       ValidateLifetime = true,
                       ClockSkew = TimeSpan.Zero
                   };

                /* STEP 4. Get the Data protection service instance */
                var protectorProvider = Provider.GetService<IDataProtectionProvider>();

                /* STEP 5. create a protector instance */
                var protector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);

                /* STEP 6. Layer One Unprotect the user id */
                var decryptedUid = protector.Unprotect(headerValueUid.Parameter);

                /* STEP 7. Layer One Unprotect the user token */
                var decryptedToken = protector.Unprotect(headerValue.Parameter);

                /* STEP 8. Create an instance of the user tokenModel */
                ApplicationUserTokens tokenModel = new();

                /* STEP 9 Get the existing token for the user from Database using a scoped request */

                var userFromDb = await UserManager.FindByIdAsync(decryptedUid);

                tokenModel = await UnitOfWork.UserTokens.GetFirstOrDefaultAsync(ut => ut.UserId.ToString() == decryptedUid
                                         && userFromDb.UserName == Request.Cookies[Constants.CookieName.Username]
                                         && userFromDb.Id.ToString() == decryptedUid
                                         );

                /* Step 11. Check if tokenmodel is null */
                if (tokenModel == null)
                {
                    return await Task.FromResult(AuthenticateResult.Fail("You are not authorized to View this Page"));
                }

                /* STEP 12. Apply second layer of decryption using the key store in the token model */
                /* STEP 12.1 Create Protector instance for layer two using token model key */
                /* IMPORTANT - If no key exists or key is invalid - exception will be thrown */
                IDataProtector layerTwoProtector = protectorProvider.CreateProtector(tokenModel?.EncryptionKeyJwt);
                string decryptedTokenLayerTwo = layerTwoProtector.Unprotect(decryptedToken);
                /* STEP 13. Validate the token we received - using validation parameters set in step 3 */
                /* IMPORTANT - If the validation fails - the method ValidateToken will throw exception */
                var validateToken = handler.ValidateToken(decryptedTokenLayerTwo, validationParameters, out var securityToken);
                /* STEP 14. Checking Token Signature */
                if ((securityToken is not JwtSecurityToken jwtSecurityToken) ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                        StringComparison.InvariantCultureIgnoreCase))
                {
                    return await Task.FromResult(AuthenticateResult.Fail("Your are not authorized"));
                }

                /* STEP 15. Extract the username from the validated token */
                var username = validateToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;

                if (Request.Cookies[Constants.CookieName.Username] != username)
                {
                    return await Task.FromResult(AuthenticateResult.Fail("You are not authorized to View this Page"));
                }
                /* STEP 16. Get User by their email */
                var user = await UserManager.FindByNameAsync(username);
                var userRoles = await UserManager.GetRolesAsync(user);
                /* STEP 17. If user does not exist return authentication failed result */
                if (user == null)
                {
                    return await Task.FromResult(AuthenticateResult.Fail("You are not authorized to View this Page"));
                }

                /* STEP 19. Now we will create an authentication ticket, as the token is valid */
                var identity = new ClaimsIdentity(validateToken.Claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                return await Task.FromResult(AuthenticateResult.Success(ticket));
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                if (ex.GetType() == typeof(SecurityTokenExpiredException))
                {
                    if (Constants.AppSettings.AllowSiteWideTokenRefresh)
                    {
                        var refreshToken = Request.Cookies[Constants.CookieName.refreshToken];
                        var accessToken = Request.Cookies[Constants.CookieName.Access_token];
                        var userId = Request.Cookies[Constants.CookieName.User_id];
                        var username = Request.Cookies[Constants.CookieName.Username];
                        var role = Request.Cookies[Constants.CookieName.userRole];

                        if (accessToken != null && userId != null && username != null)
                        {
                            var user = await UserManager.FindByNameAsync(username);
                            var roles = await UserManager.GetRolesAsync(user);
                            var OldToken = await UnitOfWork.UserTokens.GetFirstOrDefaultAsync(x => x.Name == username);
                            // Call the refresh token method if it is valid
                            var tokenValidations = await TokenService.ValidateAuthTokenAsync(user, OldToken, username);
                            var NewAccessToken = new TokenResponseModel();
                            if ((OldToken.ExpiryTime < DateTime.Now || tokenValidations.Message == "Token Expired") &&
                                 Constants.AppSettings.AllowSiteWideTokenRefresh)
                            {
                                NewAccessToken = await TokenService.RefreshToken(user, roles.ToList(), OldToken);
                                var expireTime = roles.Contains(Constants.Roles.admin) ? TimeSpan.FromMinutes(180) : NewAccessToken.Expiration;

                                // set cookie for jwt and refresh token
                                CookieService.SetRequiredCookies(NewAccessToken, user, roles.ToList(), expireTime, user.RememberMe);
                            }
                            var identity = new ClaimsIdentity(NewAccessToken.Principal.Claims, Scheme.Name);
                            var principal = new ClaimsPrincipal(identity);
                            var ticket = new AuthenticationTicket(principal, Scheme.Name);
                            return await Task.FromResult(AuthenticateResult.Success(ticket));
                        }
                    }
                }
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return await Task.FromResult(AuthenticateResult.Fail("Your are not authorized"));
            }
        }

        /* The purpose of this method is to handle the situation when the authentication fails. */
        protected override Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            /* Logic handling failed requests */

            // Delete any invalid cookies
            CookieService.DeleteAllCookies();
            Response.Headers["WWW-Authenticate"] = "Not Authorized";
            Response.Redirect(Constants.IdentityDefaultOptions.AccessDeniedPath);
            return Task.CompletedTask;
        }
    }
}
