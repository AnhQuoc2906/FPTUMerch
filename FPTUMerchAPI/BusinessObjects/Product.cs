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
    public class Product
    {
        public string? ProductId { get; set; }
        [FirestoreProperty]
        public string ProductName { get; set; }
        [FirestoreProperty]
        public string? ProductDescription { get; set; }
        [FirestoreProperty]
        public string ProductLink { get; set; }
        [FirestoreProperty]
        public float Price { get; set; }
        [FirestoreProperty]
        public string? Note { get; set; }
    }
}
