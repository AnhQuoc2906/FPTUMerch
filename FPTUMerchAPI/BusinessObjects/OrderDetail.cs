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
    public class OrderDetail
    {
        [FirestoreProperty]
        [Key] public string? OrderDetailID { get; set; }
        [FirestoreProperty]
        public string? OrderID { get; set; }
        [FirestoreProperty]
        public string ProductID { get; set; }
        [FirestoreProperty]
        public int Amount { get; set; }
        [FirestoreProperty]
        //Get the size or any additional information
        public string? Note { get; set; }
        [FirestoreProperty]
        public DateTime? CreateDate { get; set; }
    }
}
