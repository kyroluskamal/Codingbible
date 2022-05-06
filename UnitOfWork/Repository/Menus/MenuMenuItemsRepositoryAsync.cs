using CodingBible.Data;
using CodingBible.Models.Menus;
using CodingBible.UnitOfWork.IRepository.Menus;

namespace CodingBible.UnitOfWork.Repository.Menus;

public class MenuMenuItemsRepositoryAsync : ApplicationUserRepositoryAsync<MenuMenuItems>, IMenuMenuItemsRepositoryAsync
{
    public ApplicationDbContext ApplicationDbContext { get; }
    public MenuMenuItemsRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public void Update(MenuMenuItems menuMenuItems)
    {
        ApplicationDbContext.MenuMenuItems.Update(menuMenuItems);
    }
}
