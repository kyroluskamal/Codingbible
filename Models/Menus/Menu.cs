using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Menus;

public class Menu
{
    public int Id { get; set; }
    public string Name { get; set; }
    [ForeignKey(nameof(MenuLocationsId))]
    public int MenuLocationsId { get; set; }
    public MenuLocations MenuLocations { get; set; }
    public ICollection<MenuItem> MenuItems { get; set; }
}
