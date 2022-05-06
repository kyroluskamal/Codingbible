using CodingBible.Models.Menus;
using CodingBible.UnitOfWork.IRepository.MenuItems;
using CodingBible.Data;

namespace CodingBible.UnitOfWork.Repository.MenuItems;

public class MenuItemRepositoryAsync : ApplicationUserRepositoryAsync<MenuItem>, IMenuItemsRepositoryAsync
{
    public ApplicationDbContext ApplicationDbContext { get; }
    public MenuItemRepositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public void Update(MenuItem menuItem)
    {
        ApplicationDbContext.MenuItems.Update(menuItem);
    }
}