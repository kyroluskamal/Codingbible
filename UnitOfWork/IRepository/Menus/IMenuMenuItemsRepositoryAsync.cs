using CodingBible.Models.Menus;

namespace CodingBible.UnitOfWork.IRepository.Menus;

public interface IMenuMenuItemsRepositoryAsync : IRepositoryAsync<MenuMenuItems>
{
    void Update(MenuMenuItems menuMenuItems);
}
