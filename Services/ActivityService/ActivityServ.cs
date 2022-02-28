using CodingBible.Data;
using CodingBible.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;

namespace CodingBible.Services.ActivityService
{
    public class ActivityServ : IActivityServ
    {
        private readonly ApplicationDbContext ApplicationDbContext;

        public ActivityServ(ApplicationDbContext applicationDbContext)
        {
            ApplicationDbContext = applicationDbContext;
        }

        public async Task AddUserActivity(ActivityModel model)
        {
            await using var dbContextTransaction = await ApplicationDbContext.Database.BeginTransactionAsync();
            try
            {
                await ApplicationDbContext.Activities.AddAsync(model);
                await ApplicationDbContext.SaveChangesAsync();
                await dbContextTransaction.CommitAsync();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                   ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
                await dbContextTransaction.RollbackAsync();
            }
        }

        public async Task<List<ActivityModel>> GetUserActivity(int userId)
        {
            List<ActivityModel> userActivities = new ();

            try
            {
                await using var dbContextTransaction = await ApplicationDbContext.Database.BeginTransactionAsync();
                userActivities = await ApplicationDbContext.Activities.Where(x => x.UserId == userId).ToListAsync();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while seeding the database  {Error} {StackTrace} {InnerException} {Source}",
                    ex.Message, ex.StackTrace, ex.InnerException, ex.Source);
            }

            return userActivities;
        }
    }
}
