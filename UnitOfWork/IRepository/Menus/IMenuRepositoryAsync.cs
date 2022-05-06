using CodingBible.Models.Menus;
namespace CodingBible.UnitOfWork.IRepository.Menus;

public interface IMenuRepositoryAsync : IRepositoryAsync<Menu>
{
    void Update(Menu menu);
}
