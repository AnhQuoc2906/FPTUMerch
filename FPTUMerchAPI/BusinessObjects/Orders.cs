using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class Orders
    {
        [Key] public string? OrderID { get; set; }
        [ForeignKey("DiscountCode")] public string? DiscountCodeID { get; set; }
        public string OrdererName { get; set; }
        public string OrdererPhoneNumber { get; set; }
        public string OrdererEmail { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime CreateDate { get; set; }
        public string? Note { get; set; }
        public bool Status { get; set; }
        public DiscountCode? DiscountCode { get; set; }
    }
}
