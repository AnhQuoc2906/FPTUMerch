using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects
{
    public class Product
    {
        public string ProductName { get; set; }
        public string? ProductDescription { get; set; }
        public string ProductLink { get; set; }
        public float Price { get; set; }
        public string? Note { get; set; }
    }
}
