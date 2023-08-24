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
    public class DiscountCode
    {
        [FirestoreProperty]
        public string? DiscountCodeID { get; set; }
        [FirestoreProperty]
        public bool Status { get; set; }
        [FirestoreProperty]
        public int NumberOfTimes { get; set; }
    }
}
