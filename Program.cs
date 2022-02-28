using LoggingService;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using System.Diagnostics;

namespace CodingBible
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls("http://*.localhost:5000", "https://*.localhost:5001");
                }).UseSerilog((hostingContext, loggerConfiguration) => loggerConfiguration
                                  .Enrich.FromLogContext()
                                  .Enrich.WithProperty("Application", "Coding Bible")
                                  .Enrich.WithProperty("MachineName", Environment.MachineName)
                                  .Enrich.WithProperty("CurrentManagedThreadId", Environment.CurrentManagedThreadId)
                                  .Enrich.WithProperty("OSVersion", Environment.OSVersion)
                                  .Enrich.WithProperty("Version", Environment.Version)
                                  .Enrich.WithProperty("UserName", Environment.UserName)
                                  .Enrich.WithProperty("ProcessId", Environment.ProcessId)
                                  .Enrich.WithProperty("ProcessName", Process.GetCurrentProcess().ProcessName)
                                  .WriteTo.Console(theme: CustomConsoleTheme.VisualStudioMacLight)
                                  .WriteTo.File(formatter: new CustomTextFormatter(), path: Path.Combine(hostingContext.HostingEnvironment.ContentRootPath + $"{Path.DirectorySeparatorChar}Logs{Path.DirectorySeparatorChar}", $"codingBible{DateTime.Now:yyyyMMdd}.txt"))
                                 .ReadFrom.Configuration(hostingContext.Configuration));
    }
}
