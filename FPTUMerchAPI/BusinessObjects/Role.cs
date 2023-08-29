using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    [FirestoreData]
    public class Role
    {
        [FirestoreProperty]
        public string? RoleID { get; set; }
        [FirestoreProperty]
        public string RoleName { get; set; }
        [FirestoreProperty]
        public string? RoleDescription { get; set; }
    }
}
