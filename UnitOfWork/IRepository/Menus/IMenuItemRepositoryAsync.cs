using CodingBible.Models.Menus;

namespace CodingBible.UnitOfWork.IRepository.MenuItems;

public interface IMenuItemsRepositoryAsync : IRepositoryAsync<MenuItem>
{
    void Update(MenuItem menuItem);
}
