using System.ComponentModel.DataAnnotations.Schema;

namespace CodingBible.Models.Menus;

public class MenuItem
{
    public int Id { get; set; }
    public string EnName { get; set; }
    public string EnUrl { get; set; }
    public string ArName { get; set; }
    public string ArUrl { get; set; }
    [Column(TypeName = "tinyint")]
    public int Level { get; set; }
    public int OrderWithinParent { get; set; }
    [ForeignKey(nameof(ParentKey))]
    public int? ParentKey { get; set; }
    public virtual MenuItem Parent { get; set; }
    [ForeignKey(nameof(MenuId))]
    public int MenuId { get; set; }
    public virtual Menu Menu { get; set; }
}
