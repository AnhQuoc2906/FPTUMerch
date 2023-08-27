using Google.Cloud.Firestore;
using Google.Rpc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    [FirestoreData]
    public class Product
    {
        public string? ProductID { get; set; }
        [FirestoreProperty]
        public string ProductName { get; set; }
        [FirestoreProperty]
        public string? ProductDescription { get; set; }
        [FirestoreProperty]
        public string ProductLink { get; set; }
        [FirestoreProperty]
        public float Price { get; set; }
        [FirestoreProperty]
        public int Quantity { get; set; } // Số lượng hàng ban đầu
        [FirestoreProperty]
        public int? CurrentQuantity { get; set; } // Số lượng hàng hiện tại
        [FirestoreProperty]
        public bool? IsActive { get; set; } // TRUE: Còn hàng, FALSE: Hết hàng
        [FirestoreProperty]
        public string? Note { get; set; }
    }
}
