using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace backend.Auth
{
    public class AppUser : IdentityUser
    {
        public AppUser() : base()
        {
            
        }
    }
}