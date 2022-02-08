using CodingBible.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CodingBible.Services.ActivityService
{
    public interface IActivityServ
    {
        Task AddUserActivity(ActivityModel model);

        Task<List<ActivityModel>> GetUserActivity(int userId);
    }
}
