using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class Users
    {
        [Key] public string? UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Note { get; set; }
        [ForeignKey("Role")]public string RoleId { get; set; }
        public Role Role { get; set; }
    }
}
