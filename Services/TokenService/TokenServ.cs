using CodingBible.Data;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ActivityService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.ViewModels;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace CodingBible.Services.TokenService
{
    public class TokenServ : ITokenServ
    {
        private readonly ApplicationUserManager UserManager;
        private readonly ApplicationDbContext ApplicationDbContext;
        private readonly ICookieServ CookieServ;
        private readonly IServiceProvider Provider;
        private readonly IActivityServ ActivityServ;
        private readonly ApplicationUserSignIngManager SignIngManager;


        //private IDataProtector Protector;
        private string[] UserRoles = new[] { Constants.Roles.admin, Constants.Roles.Reader };
        private TokenValidationParameters validationParameters;
        private JwtSecurityTokenHandler handler;
        private string unProtectedToken;
        private ClaimsPrincipal validateToken;

        public TokenServ(ApplicationUserManager userManager,
            ApplicationDbContext applicationDbContext,
            ICookieServ cookieServ, IServiceProvider provider, IActivityServ activityServ, ApplicationUserSignIngManager signIngManager)
        {
            UserManager = userManager;
            ApplicationDbContext = applicationDbContext;
            CookieServ = cookieServ;
            Provider = provider;
            ActivityServ = activityServ;
            SignIngManager = signIngManager;
        }

        public TokenServ()
        {
        }

        public async Task<TokenResponseModel> GenerateNewToken()
        {
            try
            {
                var loggedInUserId = GetLoggedInUserId();
                var user = await UserManager.FindByIdAsync(loggedInUserId);

                // password was already validated - therefore we need to check if the two-factor token exists
                if (user == null) return CreateErrorResponseToken("Something went wrong. Please try again later", HttpStatusCode.Unauthorized);

                var accessToken = await CreateAccessToken(user);

                var refreshTokenExpireTime = accessToken.RefreshTokenExpiration.Subtract(DateTime.UtcNow).TotalMinutes;
                // set cookie for jwt and refresh token
                // Expiry time for cookie - When Refresh token expires all other cookies should expire
                // therefor set all the cookie expiry time to refresh token expiry time
                CookieServ.SetCookie("access_token", accessToken.Token.ToString(), Convert.ToInt32(refreshTokenExpireTime));
                CookieServ.SetCookie("refreshToken", accessToken.RefreshToken, Convert.ToInt32(refreshTokenExpireTime));
                CookieServ.SetCookie("loginStatus", "1", Convert.ToInt32(refreshTokenExpireTime), false, false);
                CookieServ.SetCookie("username", user.UserName, Convert.ToInt32(refreshTokenExpireTime), false, false);
                CookieServ.SetCookie("userRole", UserManager.GetRolesAsync(user).GetAwaiter().GetResult().ToString(), Convert.ToInt32(refreshTokenExpireTime), false, false);
                CookieServ.SetCookie("user_id", accessToken.UserId, Convert.ToInt32(refreshTokenExpireTime));

                return accessToken;

            }
            catch (Exception ex)
            {
                Log.Error("An error occurred at GenerateNewToken(TwoFactorResponseModel model)  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
        }


        // Private Methods

        public async Task<TokenResponseModel> GenerateNewToken(TokenRequestModel model)
        {
            try
            {
                // check if there's an user with the given username
                var user = await UserManager.FindByNameAsync(model.UserName);

                // Validate credentials
                if (user != null && await UserManager.CheckPasswordAsync(user, model.Password) && await UserManager.IsInRoleAsync(user, Constants.Roles.admin))
                {
                    // If the user account is locked

                    if (user.LockoutEnabled)
                    {
                        return CreateErrorResponseToken("Account Locked", HttpStatusCode.Unauthorized);
                    }

                    // If the user has confirmed his email
                    if (!await UserManager.IsEmailConfirmedAsync(user))
                    {
                        return CreateErrorResponseToken("Email Not Confirmed", HttpStatusCode.Unauthorized);
                    }

                    // Create & Return the access token which contains JWT and Refresh Token
                    user.RememberMe = model.RememberMe;
                    var accessToken = await CreateAccessToken(user);

                    var expireTime = accessToken.Expiration.Subtract(DateTime.UtcNow).TotalMinutes;
                    var refreshTokenExpireTime = accessToken.RefreshTokenExpiration.Subtract(DateTime.UtcNow).TotalMinutes;

                    // set cookie for jwt and refresh token
                    CookieServ.SetCookie("access_token", accessToken.Token.ToString(), Convert.ToInt32(refreshTokenExpireTime));
                    CookieServ.SetCookie("refreshToken", accessToken.RefreshToken, Convert.ToInt32(refreshTokenExpireTime));
                    CookieServ.SetCookie("loginStatus", "1", Convert.ToInt32(refreshTokenExpireTime), false, false);
                    CookieServ.SetCookie("username", user.UserName, Convert.ToInt32(refreshTokenExpireTime), false, false);
                    CookieServ.SetCookie("userRole", UserManager.GetRolesAsync(user).GetAwaiter().GetResult().ToString(), Convert.ToInt32(refreshTokenExpireTime), false, false);
                    CookieServ.SetCookie("user_id", accessToken.UserId, Convert.ToInt32(refreshTokenExpireTime));
                    return accessToken;

                }
                return CreateErrorResponseToken("Invalid Username/Password", HttpStatusCode.Unauthorized);
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return CreateErrorResponseToken("There was an Error While Processing this request", HttpStatusCode.InternalServerError);
            }
        }

        public async Task<TokenResponseModel> CreateAccessToken(ApplicationUser user)
        {

            var tokenExpiryTime = Convert.ToDouble(Constants.AppSettings.ExpireTime);
            var rtTokenExpiryTime = Convert.ToDouble(Constants.AppSettings.RtExpireTime);

            // To validate if remember me is checked
            if (user.RememberMe)
            {
                tokenExpiryTime = 1440; // 1 day
                rtTokenExpiryTime = 1560; // + 2hours
            }


            // Check if two-factor authentication has been enabled by user
            // If enables - we will increase the token expiry time by 5 minutes so user can - Login to email/Phone 
            // Security Code and token both should expire at same time
            if (user.TwoFactorEnabled)
            {
                // Reset the token expiry time
                tokenExpiryTime = 1;
                // Add 5 more minutes to the user to login  into his email and ge the two-factor code
                // Here I am giving the user 5 + 1 minutes to do this.
                tokenExpiryTime = Convert.ToDouble(tokenExpiryTime + 5);
                // set the rt token expiry time to same as token expiry - as we need to verify code before we increase the expiry time
                rtTokenExpiryTime = tokenExpiryTime;
            }

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Constants.AppSettings.Secret));

            var roles = await UserManager.GetRolesAsync(user);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)),

                     }),

                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = Constants.AppSettings.Site,
                Audience = Constants.AppSettings.Audience,
                Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
            };

            // Generate token
            /* Create the unique encryption key for token - 2nd layer protection */
            var encryptionKeyRt = Guid.NewGuid().ToString();
            var encryptionKeyJwt = Guid.NewGuid().ToString();
            /* Get the Data protection service instance */
            var protectorProvider = Provider.GetService<IDataProtectionProvider>();
            /* Create a protector instance */
            var protectorJwt = protectorProvider.CreateProtector(encryptionKeyJwt);
            /* Generate Token and Protect the user token */
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encryptedToken = protectorJwt.Protect(tokenHandler.WriteToken(token));

            /* Create and update the token table */
            ApplicationUserTokens newRtoken = new ApplicationUserTokens();

            /* Create refresh token instance */
            newRtoken = CreateRefreshToken(Constants.AppSettings.ClientId, user, Convert.ToInt32(rtTokenExpiryTime));

            /* assign the tne JWT encryption key */
            newRtoken.EncryptionKeyJwt = encryptionKeyJwt;

            newRtoken.EncryptionKeyRt = encryptionKeyRt;

            /* Add Refresh Token with Encryption Key for JWT to DB */
            try
            {
                // First we need to check if the user has already logged in and has tokens in DB
                var rt = await ApplicationDbContext.UserTokens
                    .Where(t => t.UserId == user.Id).ToListAsync();

                if (rt != null)
                {
                    // invalidate the old refresh token (by deleting it)
                    foreach (var oldRt in rt)
                    {
                        ApplicationDbContext.UserTokens.Remove(oldRt);
                    }

                    // add the new refresh token
                    await ApplicationDbContext.UserTokens.AddAsync(newRtoken);

                }
                else
                {
                    await ApplicationDbContext.UserTokens.AddAsync(newRtoken);
                }

                // persist changes in the DB
                await ApplicationDbContext.SaveChangesAsync();


            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            // Return Response containing encrypted token
            var protectorRt = protectorProvider.CreateProtector(encryptionKeyRt);
            var layerOneProtector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);

            var encAuthToken = new TokenResponseModel
            {
                Token = layerOneProtector.Protect(encryptedToken),
                Expiration = token.ValidTo,
                RefreshToken = protectorRt.Protect(newRtoken.Value),
                RefreshTokenExpiration = newRtoken.ExpiryTime,
                Role = roles.FirstOrDefault(),
                Username = user.UserName,
                UserId = layerOneProtector.Protect(user.Id.ToString()),
                TwoFactorLoginOn = user.TwoFactorEnabled,
                ResponseInfo = CreateResponse("Login Success", HttpStatusCode.OK)
            };

            return encAuthToken;
        }

        public async Task<TokenResponseModel> RefreshToken(TokenRequestModel model)
        {
            try
            {
                if (Constants.AppSettings.AllowSiteWideTokenRefresh)
                {
                    // STEP 1: Validate JWT Token 
                    var jwtValidationResult = await ValidateAuthTokenAsync();

                    if (jwtValidationResult.IsValid && jwtValidationResult.Message == "Token Expired")
                    {
                        // check if there's an user with the refresh token's userId
                        var user = await UserManager.FindByNameAsync(model.UserName);

                        // also check if user is not admin / using admin cookie
                        if (user == null || await UserManager.IsInRoleAsync(user, Constants.Roles.admin))
                        {
                            // UserId not found or invalid
                            return CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
                        }

                        // check if the received refreshToken exists for the given clientId
                        var rt = ApplicationDbContext.UserTokens.FirstOrDefault(t =>
                                t.ClientId == Constants.AppSettings.ClientId
                                && t.UserId == user.Id);

                        if (rt == null)
                        {
                            return CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
                        }

                        // check if refresh token is expired
                        if (rt.ExpiryTime < DateTime.UtcNow)
                        {
                            CookieServ.DeleteCookie("access_token");
                            CookieServ.DeleteCookie("refreshToken");
                            CookieServ.DeleteCookie("loginStatus");
                            CookieServ.DeleteCookie("username");
                            CookieServ.DeleteCookie("userRole");
                            return CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
                        }
                        /* Get the Data protection service instance */
                        var protectorProvider = Provider.GetService<IDataProtectionProvider>();
                        /* Create a protector instance */
                        var protectorRt = protectorProvider.CreateProtector(rt.EncryptionKeyRt);
                        var unprotectedToken = protectorRt.Unprotect(CookieServ.Get("refreshToken"));
                        var decryptedToken = unprotectedToken.ToString();

                        if (rt.Value != decryptedToken)
                            return CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);

                        user.RememberMe = model.RememberMe;
                        var accessToken = await CreateAccessToken(user);
                        var expireTime = accessToken.Expiration.Subtract(DateTime.UtcNow).TotalMinutes;
                        var refreshTokenExpireTime = accessToken.RefreshTokenExpiration.Subtract(DateTime.UtcNow).TotalMinutes;
                        // set cookie for jwt and refresh token
                        // Expiry time for cookie - When Refresh token expires all other cookies should expire
                        // therefor set all the cookie expiry time to refresh token expiry time
                        CookieServ.SetCookie("access_token", accessToken.Token.ToString(), Convert.ToInt32(refreshTokenExpireTime));
                        CookieServ.SetCookie("refreshToken", accessToken.RefreshToken, Convert.ToInt32(refreshTokenExpireTime));
                        CookieServ.SetCookie("loginStatus", "1", Convert.ToInt32(refreshTokenExpireTime), false, false);
                        CookieServ.SetCookie("username", user.UserName, Convert.ToInt32(refreshTokenExpireTime), false, false);
                        CookieServ.SetCookie("userRole", UserManager.GetRolesAsync(user).GetAwaiter().GetResult().ToString(), Convert.ToInt32(refreshTokenExpireTime), false, false);
                        CookieServ.SetCookie("user_id", accessToken.UserId, Convert.ToInt32(refreshTokenExpireTime));
                        accessToken.Principal = validateToken;
                        return accessToken;
                    }
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return CreateErrorResponseToken($"Error => {ex.Message}", HttpStatusCode.Unauthorized);
            }

            return CreateErrorResponseToken("Request Not Supported", HttpStatusCode.Unauthorized);
        }

        private async Task<ResponseObject> ValidateAuthTokenAsync()
        {
            var response = new ResponseObject();
            try
            {
                var authToken = CookieServ.Get("access_token");
                var userName = CookieServ.Get("username");

                if (!string.IsNullOrEmpty(authToken))
                {
                    /* Get the user from db */
                    var user = await UserManager.FindByNameAsync(userName);

                    if (user != null)
                    {
                        var userOldToken = await ApplicationDbContext.UserTokens.Where(x => x.UserId == user.Id).FirstOrDefaultAsync();

                        if (userOldToken != null)
                        {

                            var protectorProvider = Provider.GetService<IDataProtectionProvider>();
                            var layerOneUnProtector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);
                            var unprotectedTokenLayerOne = layerOneUnProtector.Unprotect(authToken);
                            var protectorJwt = protectorProvider.CreateProtector(userOldToken.EncryptionKeyJwt);
                            unProtectedToken = protectorJwt.Unprotect(unprotectedTokenLayerOne);
                            var key = Encoding.ASCII.GetBytes(Constants.AppSettings.Secret);

                            handler = new JwtSecurityTokenHandler();

                            validationParameters = new TokenValidationParameters
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

                            validateToken = handler.ValidateToken(unProtectedToken, validationParameters, out var securityToken);

                            /* This is called pattern matching => is */
                            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                                    StringComparison.InvariantCultureIgnoreCase))
                            {
                                response.IsValid = false;
                                response.Message = "Token Invalid";
                                return response;
                            }
                            foreach (var role in UserRoles)
                            {
                                if (await UserManager.IsInRoleAsync(user, role))
                                {
                                    var decryptedUsername = validateToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;

                                    if (decryptedUsername == userName)
                                    {
                                        response.IsValid = true;
                                        response.Message = "Token Valid";
                                        return response;
                                    }
                                }
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex.GetType() == typeof(SecurityTokenExpiredException))
                {
                    if (Constants.AppSettings.AllowSiteWideTokenRefresh)
                    {
                        validationParameters.ValidateLifetime = false;
                        validateToken = handler.ValidateToken(unProtectedToken, validationParameters, out var securityToken);

                        /* This is called pattern matching => is */
                        if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
                            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                                StringComparison.InvariantCultureIgnoreCase))
                        {
                            response.IsValid = false;
                            response.Message = "Token Invalid";
                            return response;
                        }

                        response.IsValid = true;
                        response.Message = "Token Expired";
                        return response;
                    }
                }

                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
            response.IsValid = false;
            response.Message = "Token Invalid";
            return response;
        }

        public async Task<TokenResponseModel> GenerateNewToken(ApplicationUser user, LoginViewModel model)
        {

            // Create a key to encrypt the JWT 
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Constants.AppSettings.Secret));

            // Get user role => check if user is admin
            var roles = await UserManager.GetRolesAsync(user);

            // Creating JWT token
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName), // Sub - Identifies principal that issued the JWT
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Jti - Unique identifier of the token
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Unique Identifier of the user
                        new Claim(ClaimTypes.Role, roles.ToList().ToString()), // Role of the user
                        new Claim("LoggedOn", DateTime.Now.ToString(CultureInfo.InvariantCulture)), // Time When Created
                 }),

                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = Constants.AppSettings.Site, // Issuer - Identifies principal that issued the JWT.
                Audience = Constants.AppSettings.Audience, // Audience - Identifies the recipients that the JWT is intended for.
                Expires = (string.Equals(roles.FirstOrDefault(), Constants.Roles.admin, StringComparison.CurrentCultureIgnoreCase)) ? DateTime.UtcNow.AddMinutes(60) : DateTime.UtcNow.AddMinutes(Convert.ToDouble(Constants.AppSettings.ExpireTime))
            };

            /* Create the unique encryption key for token - 2nd layer protection */
            var encryptionKeyRt = Guid.NewGuid().ToString();
            var encryptionKeyJwt = Guid.NewGuid().ToString();

            /* Get the Data protection service instance */
            var protectorProvider = Provider.GetService<IDataProtectionProvider>();

            /* Create a protector instance */
            var protectorJwt = protectorProvider.CreateProtector(encryptionKeyJwt);

            /* Generate Token and Protect the user token */
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encryptedToken = protectorJwt.Protect(tokenHandler.WriteToken(token));

            /* Create and update the token table */
            ApplicationUserTokens newRtoken = new ApplicationUserTokens();

            /* Create refresh token instance */
            newRtoken = CreateRefreshToken(Constants.AppSettings.ClientId, user, Convert.ToInt32(Constants.AppSettings.RtExpireTime));

            /* assign the tne JWT encryption key */
            newRtoken.EncryptionKeyJwt = encryptionKeyJwt;

            newRtoken.EncryptionKeyRt = encryptionKeyRt;

            /* Add Refresh Token with Encryption Key for JWT to DB */
            try
            {
                // First we need to check if the user has already logged in and has tokens in DB
                var rt = ApplicationDbContext.UserTokens
                    .FirstOrDefault(t => t.UserId == user.Id);

                if (rt != null)
                {
                    // invalidate the old refresh token (by deleting it)
                    ApplicationDbContext.UserTokens.Remove(rt);

                    // add the new refresh token
                    ApplicationDbContext.UserTokens.Add(newRtoken);
                }
                else
                {
                    await ApplicationDbContext.UserTokens.AddAsync(newRtoken);
                }
                // persist changes in the DB
                object p = await ApplicationDbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            // Return Response containing encrypted token
            var protectorRt = protectorProvider.CreateProtector(encryptionKeyRt);
            var layerOneProtector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);

            var encAuthToken = new TokenResponseModel
            {
                Token = layerOneProtector.Protect(encryptedToken),
                Expiration = token.ValidTo,
                RefreshToken = protectorRt.Protect(newRtoken.Value),
                Role = roles.FirstOrDefault(),
                Username = user.UserName,
                UserId = layerOneProtector.Protect(user.Id.ToString()),
                ResponseInfo = CreateResponse("Auth Token Created", HttpStatusCode.OK)
            };

            return encAuthToken;


        }

        public TokenResponseModel CreateErrorResponseToken(string errorMessage, HttpStatusCode statusCode)
        {
            var errorToken = new TokenResponseModel
            {
                Token = null,
                Username = null,
                Role = null,
                RefreshTokenExpiration = DateTime.Now,
                RefreshToken = null,
                Expiration = DateTime.Now,
                ResponseInfo = CreateResponse(errorMessage, statusCode)
            };

            return errorToken;
        }

        public ResponseStatusInfoModel CreateResponse(string errorMessage, HttpStatusCode statusCode)
        {
            var responseStatusInfo = new ResponseStatusInfoModel
            {
                Message = errorMessage,
                StatusCode = statusCode
            };

            return responseStatusInfo;
        }

        public ApplicationUserTokens CreateRefreshToken(string clientId, ApplicationUser user, int expireTime)
        {

            return new ApplicationUserTokens()
            {
                ClientId = clientId,
                UserId = user.Id,
                Name = user.UserName,
                LoginProvider = "CodingBible",
                Value = Guid.NewGuid().ToString("N"),
                CreatedDate = DateTime.UtcNow,
                ExpiryTime = DateTime.UtcNow.AddMinutes(expireTime),
                EncryptionKeyRt = "",
                EncryptionKeyJwt = ""
            };
        }
        public string GetLoggedInUserId()
        {
            try
            {
                var protectorProvider = Provider.GetService<IDataProtectionProvider>();
                var protector = protectorProvider.CreateProtector(Constants.DataProtectionKeys.ApplicationUserKey);
                var unprotectUserId = protector.Unprotect(CookieServ.Get("user_id"));
                return unprotectUserId;
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while decrypting user Id  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return null;

        }
    }
}
