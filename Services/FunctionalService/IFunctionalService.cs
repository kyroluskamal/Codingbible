using CodingBible.Models.Posts;

namespace CodingBible.Services.FunctionalService
{
    public interface IFunctionalService
    {
        Task CreateDefaultAdminUser();
        Task<bool> Logout();
        Task CompressImage(string FilPath_Origina, string FilePath_optimised);
        //string UpdatePostSitemap(string HostNme, Post post);
        //Task<string> CreatePostSitemap(string HostNme);
        Task ResizeImage_SCALE(string FilPath_Origina, string FilePath_optimised, int width, string scaleMethod = "scale");
        Task ResizeImage_OtherMedthods(string FilPath_Original, string FilePath_optimised, int Width, int Height, string scaleMethod = "fit");
    }
}
