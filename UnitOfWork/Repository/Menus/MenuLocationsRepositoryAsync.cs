using CodingBible.Data;
using CodingBible.Models.Menus;
using CodingBible.UnitOfWork.IRepository.Menus;

namespace CodingBible.UnitOfWork.Repository.Menus;

public class MenuLocationsRepositoryAsync : ApplicationUserRepositoryAsync<MenuLocations>, IMenuLocationsRespositoryAsync
{
    public ApplicationDbContext ApplicationDbContext { get; }
    public MenuLocationsRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public void Update(MenuLocations menuLocations)
    {
        ApplicationDbContext.MenuLocations.Update(menuLocations);
    }
}
