using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace CodingBible.Models.Identity
{
    public class ApplicationUserRoleManager : RoleManager<ApplicationUserRole>
    {
        public ApplicationUserRoleManager(IRoleStore<ApplicationUserRole> store,
            IEnumerable<IRoleValidator<ApplicationUserRole>> roleValidators,
            ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors,
            ILogger<RoleManager<ApplicationUserRole>> logger) : base(store, roleValidators, keyNormalizer, errors, logger)
        {
        }
    }
}
