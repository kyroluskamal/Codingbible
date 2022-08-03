using CodingBible.Data;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.MailService;
using CodingBible.Services.TokenService;
using CodingBible.UnitOfWork;
using DataService;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MintPlayer.AspNetCore.Hsts;
using MintPlayer.AspNetCore.SpaServices.Routing;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using CodingBible.Services.SitemapService;
using SixLabors.ImageSharp.Web.DependencyInjection;

namespace CodingBible
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options => options.AddPolicy("ApiCorsPolicy", builder =>
                builder.WithOrigins("http://localhost:4000").AllowAnyMethod().AllowAnyHeader().AllowCredentials()
            ));

            services.AddMvc();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                );
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                options.EnableDetailedErrors();
                options.EnableSensitiveDataLogging();
            });
            services.AddDatabaseDeveloperPageExceptionFilter();
            services.AddTransient<IRoleStore<ApplicationUserRole>, ApplicationUserRoleStore>();
            services.AddTransient<UserManager<ApplicationUser>, ApplicationUserManager>();
            services.AddTransient<SignInManager<ApplicationUser>, ApplicationUserSignIngManager>();
            services.AddTransient<RoleManager<ApplicationUserRole>, ApplicationUserRoleManager>();
            services.AddTransient<IUserStore<ApplicationUser>, ApplicationUserStore>();
            services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.SignIn.RequireConfirmedAccount = Constants.IdentityDefaultOptions.SignInRequireConfirmedEmail;
                // Password settings
                options.Password.RequireDigit = Constants.IdentityDefaultOptions.PasswordRequireDigit;
                options.Password.RequiredLength = Constants.IdentityDefaultOptions.PasswordRequiredLength;
                options.Password.RequireNonAlphanumeric = Constants.IdentityDefaultOptions.PasswordRequireNonAlphanumeric;
                options.Password.RequireUppercase = Constants.IdentityDefaultOptions.PasswordRequireUppercase;
                options.Password.RequireLowercase = Constants.IdentityDefaultOptions.PasswordRequireLowercase;
                options.Password.RequiredUniqueChars = Constants.IdentityDefaultOptions.PasswordRequiredUniqueChars;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(Constants.IdentityDefaultOptions.LockoutDefaultLockoutTimeSpanInMinutes);
                options.Lockout.MaxFailedAccessAttempts = Constants.IdentityDefaultOptions.LockoutMaxFailedAccessAttempts;
                options.Lockout.AllowedForNewUsers = Constants.IdentityDefaultOptions.LockoutAllowedForNewUsers;
                // User settings
                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddRoles<ApplicationUserRole>().AddRoleManager<ApplicationUserRoleManager>()
                .AddRoleValidator<RoleValidator<ApplicationUserRole>>().AddRoleStore<ApplicationUserRoleStore>()
                .AddUserManager<ApplicationUserManager>().AddUserStore<ApplicationUserStore>()
                .AddSignInManager<ApplicationUserSignIngManager>().AddDefaultTokenProviders();
            //.AddTokenProvider<CustomEmailConfirmationTokenProvider<ApplicationUser>>("ClientCustomEmailConfirmation");
            services.Configure<DataProtectionTokenProviderOptions>(o =>
                    o.TokenLifespan = TimeSpan.FromHours(5));
            services.AddTransient<ApplicationUserRoleStore>();
            services.AddTransient<ApplicationUserStore>();
            services.AddDbContext<DataProtectionKeysContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("DataProtectionKeys")));
            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                );

            /*---------------------------------------------------------------------------------------------------*/
            /*                              Cookie Helper SERVICE                                                */
            /*---------------------------------------------------------------------------------------------------*/
            services.AddHttpContextAccessor();
            services.AddTransient<CookieOptions>();
            services.AddTransient<ICookieServ, CookieServ>();
            /*---------------------------------------------------------------------------------------------------*/
            /*                                 AuthenticationSchemes SERVICE                                     */
            /*---------------------------------------------------------------------------------------------------*/
            services.AddAuthentication();
            services.AddAuthentication("Custom").AddScheme<CustomAuthenticationOptions, CustomAuthenticationHandler>("Custom", null);

            services.AddControllersWithViews();
            services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/dist");
            services.AddRazorPages();
            /*---------------------------------------------------------------------------------------------------*/
            /*                             Adding new Services                                                    */
            /*---------------------------------------------------------------------------------------------------*/
            services.AddTransient<IFunctionalService, FunctionalService>();
            services.AddDataProtection().PersistKeysToDbContext<DataProtectionKeysContext>();
            services.AddTransient<IEMailService, EMailService>();
            services.AddTransient<ITokenServ, TokenServ>();
            services.AddTransient<IDbContextInitializer, DbContextInitializer>();
            services.AddScoped<IUnitOfWork_ApplicationUser, ApplicationUserUnitOfWork>();
            services.AddAutoMapper(typeof(Startup));

            /*---------------------------------------------------------------------------------------------------*/
            /*                             Addid Sitemap serice                                                   */
            /*---------------------------------------------------------------------------------------------------*/
            services.AddTransient<ISitemapService, SitemapService>();

            /*--------------------------------------------------------------------------------------------------------------------*/
            /*                      Anti Forgery Token Validation Service                                                         */
            /* We use the option patterm to configure the Antiforgery feature through the AntiForgeryOptions Class                */
            /* The HeaderName property is used to specify the name of the header through which antiforgery token will be accepted */
            /*--------------------------------------------------------------------------------------------------------------------*/
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "scfD1z5dp2";
                options.Cookie.MaxAge = TimeSpan.FromDays(10);
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.HttpOnly = false;
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
            });
            // services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/dist/browser");
            /*---------------------------------------------------------------------------------------------------*/
            /*                                 JWT AUTHENTICATION SERVICE                                        */
            /*---------------------------------------------------------------------------------------------------*/
            var key = Encoding.ASCII.GetBytes(Constants.AppSettings.Secret);
            services.AddAuthentication(o =>
            {
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = Constants.AppSettings.ValidateIssuerSigningKey,
                    ValidateIssuer = Constants.AppSettings.ValidateIssuer,
                    ValidateAudience = Constants.AppSettings.ValidateAudience,
                    ValidIssuer = Constants.AppSettings.Site,
                    ValidAudience = Constants.AppSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };
            });
            /*---------------------------------------------------------------------------------------------------*/
            /*                              ENABLE API Versioning                                                */
            /*---------------------------------------------------------------------------------------------------*/
            services.AddApiVersioning(
               options =>
               {
                   options.ReportApiVersions = true;
                   options.AssumeDefaultVersionWhenUnspecified = true;
                   options.DefaultApiVersion = new ApiVersion(1, 0);
               });
            /*---------------------------------------------------------------------------------------------------*/
            /*                              ENABLE API Versioning                                                */
            /*---------------------------------------------------------------------------------------------------*/
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
            services.Configure<BrotliCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
            services.AddResponseCompression(options =>
            {
                IEnumerable<string> MimeTypes = new[]
                {
                    // General
                    "text/plain",
                    "text/html",
                    "text/css",
                    "font/woff2",
                    "application/javascript",
                    "image/x-icon",
                    "image/*"
                };

                options.EnableForHttps = false;
                options.MimeTypes = MimeTypes;
                options.Providers.Add<GzipCompressionProvider>();
                options.Providers.Add<BrotliCompressionProvider>();
            });
            services.AddImageSharp(
                    options => options.OnBeforeSaveAsync = f =>
                    {
                        f.Image.Metadata.ExifProfile = null;
                        return Task.CompletedTask;
                    });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IDbContextInitializer dbContextInitializer, IHostEnvironment env, IAntiforgery antiForgery)
        {
            //app.UseMiddleware<ExceptionMiddleware>();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseImprovedHsts();
            // app.UseHttpsRedirection();
            app.UseResponseCompression();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(policy =>
            {
                policy.WithOrigins("http://localhost:4200", "http://localhost:4000", "https://localhost:5001")
                .AllowAnyHeader().AllowAnyMethod().AllowCredentials()
                .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
            });
            app.UseAuthorization();
            app.Use(next => context =>
            {
                if (context.Request.Path.Value.IndexOf("/api", StringComparison.OrdinalIgnoreCase) != -1 || context.Request.Path.Value.IndexOf("/", StringComparison.OrdinalIgnoreCase) != -1)
                {
                    var tokens = antiForgery.GetAndStoreTokens(context);
                    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken,
                        new CookieOptions()
                        {
                            HttpOnly = false,
                            Secure = true,
                            IsEssential = true,
                            SameSite = SameSiteMode.None,
                            MaxAge = TimeSpan.FromDays(10)
                        });
                }

                return next(context);
            });
            dbContextInitializer.Initialize().GetAwaiter().GetResult();
            //app.UseMvc(endpoints =>
            //{
            //    endpoints.MapSpaFallbackRoute(
            //    name: "spa-fallback",
            //    defaults: new { controller = "Home", action = "Index" });
            //});
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "versioning",
                    pattern: "api/v{version:apiVersion}/{controller}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "areas",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
                );
                endpoints.MapRazorPages();
            });

            // app.UseSpa(spa =>
            // {
            //     spa.Options.SourcePath = "ClientApp";

            //      //spa.UseSpaPrerendering(options =>
            //      //{
            //      //   //options.BootModuleBuilder = env.IsDevelopment() ? new AngularCliBuilder(npmScript: "build:ssr") : null;
            //      //   options.BootModulePath = $"{spa.Options.SourcePath}/dist/ClientApp/server/main.js";
            //      //   options.ExcludeUrls = new[] { "/sockjs-node" };
            //      //});

            //     if (env.IsDevelopment())
            //     {
            //         spa.UseAngularCliServer(npmScript: "start");
            //          // spa.UseProxyToSpaDevelopmentServer("http://localhost:4000");
            //     }
            // });
        }
    }
}
