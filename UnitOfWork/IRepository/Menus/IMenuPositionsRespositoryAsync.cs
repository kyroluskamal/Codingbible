using CodingBible.Models.Menus;

namespace CodingBible.UnitOfWork.IRepository.Menus;

public interface IMenuLocationsRespositoryAsync : IRepositoryAsync<MenuLocations>
{
    void Update(MenuLocations menuLocations);
}
