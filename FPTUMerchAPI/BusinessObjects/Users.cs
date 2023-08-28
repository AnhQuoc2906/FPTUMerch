using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    [FirestoreData]
    public class Users
    {
        [Key] 
        public string? UserID { get; set; }
        [FirestoreProperty]
        public string FullName { get; set; }
        [FirestoreProperty]
        public string Email { get; set; }
        [FirestoreProperty]
        public string Password { get; set; }
        [FirestoreProperty]
        public string? Note { get; set; }
        [FirestoreProperty]
        public string DiscountCodeID { get; set; }// Each user (A.K.A saler) will have 1 discountcode to distribute to customer
        [FirestoreProperty]
        [ForeignKey("Role")]public string RoleID { get; set; }
    }
}
