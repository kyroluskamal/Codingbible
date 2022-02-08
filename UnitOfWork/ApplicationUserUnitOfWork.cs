using CodingBible.Data;
using CodingBible.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CodingBible.UnitOfWork
{
    public class ApplicationUserUnitOfWork : IUnitOfWork_ApplicationUser
    {
        public ApplicationDbContext ApplicationDbContext { get; }
        public ApplicationUserRoleManager RoleManager { get; set; }

        public ApplicationUserUnitOfWork(ApplicationDbContext applicationDbContext,
            ApplicationUserRoleManager roleManager)
        {
            ApplicationDbContext = applicationDbContext;
            RoleManager = roleManager;
         
        }


        public async void Dispose()
        {
            await ApplicationDbContext.DisposeAsync();
        }

        public async Task<int> SaveAsync()
        {
            return await ApplicationDbContext.SaveChangesAsync();
        }

        public int Save()
        {
            return ApplicationDbContext.SaveChanges();
        }

    }
}
