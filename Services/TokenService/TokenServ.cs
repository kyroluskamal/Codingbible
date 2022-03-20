using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.UnitOfWork;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CodingBible.Services.TokenService
{
    public class TokenServ : ITokenServ
    {
        private readonly ICookieServ CookieServ;
        private readonly IServiceProvider Provider;
        public IUnitOfWork_ApplicationUser UnitOfWork { get; set; }
        //private IDataProtector Protector;
        private TokenValidationParameters validationParameters;
        private JwtSecurityTokenHandler handler;
        private string unProtectedToken;
        private ClaimsPrincipal validateToken;

        public TokenServ(ICookieServ cookieServ, IServiceProvider provider, IUnitOfWork_ApplicationUser unitOfWork)
        {
            CookieServ = cookieServ;
            Provider = provider;
            UnitOfWork = unitOfWork;
        }

        public async Task<TokenResponseModel> GenerateNewToken(ApplicationUser user, List<string> roles)
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

            // Create a key to encrypt the JWT 
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Constants.AppSettings.Secret));

            // Creating JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName), // Sub - Identifies principal that issued the JWT
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Jti - Unique identifier of the token
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Unique Identifier of the user
                        new Claim(ClaimTypes.Role, String.Join(",", roles)), // Role of the user
                        new Claim("LoggedOn", DateTime.Now.ToString(CultureInfo.InvariantCulture)), // Time When Created
                 }),

                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = Constants.AppSettings.Site, // Issuer - Identifies principal that issued the JWT.
                Audience = Constants.AppSettings.Audience, // Audience - Identifies the recipients that the JWT is intended for.
                Expires = roles.Contains(Constants.Roles.admin) ? DateTime.Now.AddMinutes(60) : DateTime.Now.AddMinutes(tokenExpiryTime)
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
            ApplicationUserTokens newRtoken = new();

            /* Create refresh token instance */
            newRtoken = CreateRefreshToken(Constants.AppSettings.ClientId, user, Convert.ToInt32(rtTokenExpiryTime));

            /* assign the tne JWT encryption key */
            newRtoken.EncryptionKeyJwt = encryptionKeyJwt;

            newRtoken.EncryptionKeyRt = encryptionKeyRt;

            /* Add Refresh Token with Encryption Key for JWT to DB */
            try
            {
                // First we need to check if the user has already logged in and has tokens in DB
                var rt = await UnitOfWork.UserTokens.GetFirstOrDefaultAsync(t => t.UserId == user.Id);

                if (rt != null)
                {
                    // invalidate the old refresh token (by deleting it)
                    UnitOfWork.UserTokens.Remove(rt);

                    // add the new refresh token
                    await UnitOfWork.UserTokens.AddAsync(newRtoken);
                }
                else
                {
                    await UnitOfWork.UserTokens.AddAsync(newRtoken);
                }
                // persist changes in the DB
                object p = await UnitOfWork.SaveAsync();
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
                Expiration = token.ValidTo.TimeOfDay,
                RefreshToken = protectorRt.Protect(newRtoken.Value),
                RefreshTokenExpiration = TimeSpan.FromMinutes(rtTokenExpiryTime),
                Role = String.Join(",", roles),
                Username = user.UserName,
                UserId = layerOneProtector.Protect(user.Id.ToString()),
            };
            return encAuthToken;
        }

        public async Task<TokenResponseModel> RefreshToken(ApplicationUser user, List<string> roles, ApplicationUserTokens RtFromDb)
        {
            try
            {
                if (Constants.AppSettings.AllowSiteWideTokenRefresh)
                {
                    // STEP 1: Validate JWT Token 
                    // check if the received refreshToken exists for the given clientId
                    /* Get the Data protection service instance */
                    var protectorProvider = Provider.GetService<IDataProtectionProvider>();
                    /* Create a protector instance */
                    var protectorRt = protectorProvider.CreateProtector(RtFromDb.EncryptionKeyRt);
                    var decryptedToken = protectorRt.Unprotect(CookieServ.Get("refreshToken"));

                    if (RtFromDb.Value != decryptedToken)
                        return null;

                    var accessToken = await GenerateNewToken(user, roles);
                    accessToken.Principal = validateToken;
                    return accessToken;
                }
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                return null;
            }
        }

        public async Task<ResponseObject> ValidateAuthTokenAsync(ApplicationUser user, ApplicationUserTokens userOldToken, string UsernameFromCookie)
        {
            await Task.Delay(0);
            var response = new ResponseObject();
            try
            {
                var authToken = CookieServ.Get(Constants.CookieName.Access_token);
                if (!string.IsNullOrEmpty(authToken))
                {
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
                        var decryptedUsername = validateToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;

                        if (decryptedUsername == UsernameFromCookie)
                        {
                            response.IsValid = true;
                            response.Message = "Token Valid";
                            return response;
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
                        if ((securityToken is not JwtSecurityToken jwtSecurityToken) ||
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

                Log.Error("An error occurred while Validating tokens {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }
            response.IsValid = false;
            response.Message = "Token Invalid";
            return response;
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
                CreatedDate = DateTime.Now,
                ExpiryTime = DateTime.Now.AddMinutes(expireTime),
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
