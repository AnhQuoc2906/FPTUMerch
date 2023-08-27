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
    public class Orders
    {
        [Key] public string? OrderID { get; set; }
        [FirestoreProperty]
        [ForeignKey("DiscountCode")] public string? DiscountCodeID { get; set; }
        [FirestoreProperty]
        public string OrdererName { get; set; }
        [FirestoreProperty]
        public string OrdererPhoneNumber { get; set; }
        [FirestoreProperty]
        public string OrdererEmail { get; set; }
        [FirestoreProperty]
        public string DeliveryAddress { get; set; }
        [FirestoreProperty]
        public float? TotalPrice { get; set; }
        [FirestoreProperty]
        public DateTime? CreateDate { get; set; }
        [FirestoreProperty]
        public string? Note { get; set; }
        [FirestoreProperty]
        //TRUE: Not cancelled, FALSE: cancelled
        public bool? Status { get; set; }
        [FirestoreProperty]
        public List<OrderDetail> orderDetails { get; set; }
    }
}
