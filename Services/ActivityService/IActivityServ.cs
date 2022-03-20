using CodingBible.Models;

namespace CodingBible.Services.ActivityService
{
    public interface IActivityServ
    {
        Task AddUserActivity(ActivityModel model);

        Task<List<ActivityModel>> GetUserActivity(int userId);
    }
}
