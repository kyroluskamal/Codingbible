using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Menus;

public class MenuItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Url { get; set; }
    [Column(TypeName = "tinyint")]
    public int Level { get; set; }
    public int OrderWithinParent { get; set; }
    [ForeignKey(nameof(ParentKey))]
    public int? ParentKey { get; set; }
    public virtual MenuItem Parent { get; set; }
    public ICollection<MenuMenuItems> AssociatedMenus { get; set; }
}
