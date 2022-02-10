
using CodingBible.Data;
using CodingBible.Models;
using CodingBible.Models.Identity;
using CodingBible.Services.ActivityService;
using CodingBible.Services.AuthenticationService;
using CodingBible.Services.ConstantsService;
using CodingBible.Services.CookieService;
using CodingBible.Services.FunctionalService;
using CodingBible.Services.MailService;
using CodingBible.Services.TokenService;
using DataService;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

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
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))
                );
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
            services.AddScoped<ApplicationUserRoleStore>();
            services.AddScoped<ApplicationUserStore>();
            services.AddDbContext<DataProtectionKeysContext>(options =>
    options.UseSqlServer(Configuration.GetConnectionString("DataProtectionKeys")));

            services.AddControllers();



            services.Configure<CookiePolicyOptions>(options =>
            {
                options.MinimumSameSitePolicy = SameSiteMode.None;

            });

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
            services.AddAuthentication(Constants.Roles.admin).AddScheme<AdminAuthenticationOptions, AdminAuthenticationHandler>(Constants.Roles.admin, null);

            services.AddControllersWithViews();
            services.AddRazorPages();

            /*---------------------------------------------------------------------------------------------------*/
            /*                             Adding new Services                                                    */
            /*---------------------------------------------------------------------------------------------------*/
            services.AddTransient<IFunctionalService, FunctionalService>();
            services.AddDataProtection().PersistKeysToDbContext<DataProtectionKeysContext>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IActivityServ, ActivityServ>();
            services.AddTransient<IEMailService, EMailService>();
            services.AddTransient<ITokenServ, TokenServ>();
            services.AddScoped<IDbContextInitializer, DbContextInitializer>();
            services.AddAutoMapper(typeof(Startup));
            /*--------------------------------------------------------------------------------------------------------------------*/
            /*                      Anti Forgery Token Validation Service                                                         */
            /* We use the option patterm to configure the Antiforgery feature through the AntiForgeryOptions Class                */
            /* The HeaderName property is used to specify the name of the header through which antiforgery token will be accepted */
            /*--------------------------------------------------------------------------------------------------------------------*/
            services.AddAntiforgery(options =>
            {
                options.Cookie.Name = "XSRF-TOKEN";
                options.HeaderName = "scfD1z5dp2";
                options.Cookie.HttpOnly = false;
                options.Cookie.MaxAge = TimeSpan.FromDays(10);
                options.Cookie.SecurePolicy = CookieSecurePolicy.None;
            });


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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IDbContextInitializer dbContextInitializer, IHostEnvironment env, IAntiforgery antiForgery)
        {
            //app.UseMiddleware<ExceptionMiddleware>();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                //The default HSTS value is 30 days.You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.Use(next => context =>
            {
                if (context.Request.Path.Value.IndexOf("/api", StringComparison.OrdinalIgnoreCase) != -1)
                {
                    var tokens = antiForgery.GetAndStoreTokens(context);
                    //context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken,
                    //    new CookieOptions() { HttpOnly = false, Secure = false });
                }

                return next(context);
            });

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseCookiePolicy();
            app.UseCors(policy =>
            {
                policy.AllowAnyOrigin();
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
            });

            app.UseAuthentication();
            app.UseAuthorization();
            dbContextInitializer.Initialize();
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

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";
                spa.Options.StartupTimeout = new TimeSpan(0, 5, 0);
                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
