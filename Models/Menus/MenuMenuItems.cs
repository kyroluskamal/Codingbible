namespace CodingBible.Models.Menus;

public class MenuMenuItems
{
    public int MenuItemId { get; set; }
    public MenuItem MenuItem { get; set; }
    public int MenuId { get; set; }
    public Menu Menu { get; set; }
}
