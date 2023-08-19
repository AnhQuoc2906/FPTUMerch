using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class DiscountCode
    {
        [Key] public string DiscountCodeID { get; set; }
        public bool Status { get; set; }
        public int NumberOfTimes { get; set; }
    }
}
