using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class OrderDetail
    {
        [Key] public string OrderDetailID { get; set; }
        [ForeignKey("Orders")] public string OrderID { get; set; }
        [ForeignKey("Product")] public string ProductID { get; set; }
        public int Amount { get; set; }
        public DateTime CreateDate { get; set; }
        public Orders Orders { get; set; }
        public Product Product { get; set; }
    }
}
