using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Auth
{
    public class AuthDbContext : IdentityDbContext<AppUser>
    {
		public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
    }
}