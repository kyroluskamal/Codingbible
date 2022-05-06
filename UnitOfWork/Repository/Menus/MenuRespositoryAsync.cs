using CodingBible.Data;
using CodingBible.Models.Menus;
using CodingBible.UnitOfWork.IRepository.Menus;

namespace CodingBible.UnitOfWork.Repository.Menus;

public class MenuRespositoryAsync : ApplicationUserRepositoryAsync<Menu>, IMenuRepositoryAsync
{
    public ApplicationDbContext ApplicationDbContext { get; }
    public MenuRespositoryAsync(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
    {
        ApplicationDbContext = applicationDbContext;
    }
    public void Update(Menu menu)
    {
        ApplicationDbContext.Menus.Update(menu);
    }
}
