using CodingBible.Data;
using CodingBible.Models.Menus;
using CodingBible.UnitOfWork.IRepository.Menus;

namespace CodingBible.UnitOfWork.Repository.Menus;

public class MenuLocationsRepositoryAsync : ApplicationUserRepositoryAsync<MenuLocations>, IMenuLocationsRepositoryAsync
{
    public MenuLocationsRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }

    public ApplicationDbContext ApplicationDbContext { get; }

    public void Update(MenuLocations menuLocation)
    {
        ApplicationDbContext.MenuLocations.Update(menuLocation);
    }
}
