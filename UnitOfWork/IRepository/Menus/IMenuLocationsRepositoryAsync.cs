using CodingBible.Models.Menus;

namespace CodingBible.UnitOfWork.IRepository.Menus;

public interface IMenuLocationsRepositoryAsync : IRepositoryAsync<MenuLocations>
{
    void Update(MenuLocations menuLocation);
}
