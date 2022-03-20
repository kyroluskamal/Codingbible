namespace CodingBible.Services.FunctionalService
{
    public interface IFunctionalService
    {
        Task CreateDefaultAdminUser();
        Task<bool> Logout();
    }
}
