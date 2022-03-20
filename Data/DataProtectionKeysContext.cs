﻿using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataService
{
    public class DataProtectionKeysContext : DbContext, IDataProtectionKeyContext
    {
        public DataProtectionKeysContext(DbContextOptions<DataProtectionKeysContext> options)
                    : base(options)
        {
            if (Database.GetPendingMigrationsAsync().GetAwaiter().GetResult().Any())
            {
                Database.MigrateAsync().GetAwaiter();
            }
        }

        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
    }
}