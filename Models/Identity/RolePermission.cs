namespace CodingBible.Models.Identity
{
    public class RolePermission
    {
        public int Id { get; set; }
        public bool Read { get; set; }
        public bool Delete { get; set; }
        public bool Update { get; set; }
        public bool Add { get; set; }
        public string Type { get; set; }
        public ApplicationUserRole ApplicationUserRole { get; set; }
        public int ApplicationUserRoleId { get; set; }

    }
}
