using BusinessObjects;
using FireSharp.Extensions;
using Google.Cloud.Firestore;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        // GET: api/<OrdersController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
            FirestoreDb database = FirestoreDb.Create("fptumerchtest");
            List<Orders> ordersList = new List<Orders>();
            Query Qref = database.Collection("Order");
            QuerySnapshot snap = await Qref.GetSnapshotAsync();
            foreach (DocumentSnapshot docsnap in snap)
            {
                if (docsnap.Exists)
                {
                    Orders order = docsnap.ConvertTo<Orders>();
                    order.OrderID = docsnap.Id;
                    order.orderDetails = new List<OrderDetail>();
                    Query coll = database.Collection("Order").Document(docsnap.Id).Collection("OrderDetail");
                    QuerySnapshot queryColl = await coll.GetSnapshotAsync();
                    foreach(DocumentSnapshot docsnap2 in queryColl)
                    {
                        if(docsnap2.Exists)
                        {
                            OrderDetail orderDetail = docsnap2.ConvertTo<OrderDetail>();
                            orderDetail.OrderDetailID = docsnap2.Id;
                            orderDetail.OrderID = docsnap.Id;
                            order.orderDetails.Add(orderDetail);
                        }
                    }
                    ordersList.Add(order);
                }
            }
            return Ok(ordersList);
        }

        // GET api/<OrdersController>/5
        [HttpGet("{OrderId}")]
        public async Task<ActionResult> Get(string OrderId)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
            FirestoreDb database = FirestoreDb.Create("fptumerchtest");
            Orders order = new Orders();
            DocumentReference docRef = database.Collection("Order").Document(OrderId);
            DocumentSnapshot docSnap = await docRef.GetSnapshotAsync();
            if(docSnap.Exists)
            {
                order = docSnap.ConvertTo<Orders>();
                order.OrderID = docSnap.Id;
                order.orderDetails = new List<OrderDetail>();
                Query coll = database.Collection("Order").Document(docSnap.Id).Collection("OrderDetail");
                QuerySnapshot queryColl = await coll.GetSnapshotAsync();
                foreach (DocumentSnapshot docsnap2 in queryColl)
                {
                    if (docsnap2.Exists)
                    {
                        OrderDetail orderDetail = docsnap2.ConvertTo<OrderDetail>();
                        orderDetail.OrderDetailID = docsnap2.Id;
                        orderDetail.OrderID = docSnap.Id;
                        order.orderDetails.Add(orderDetail);
                    }
                }
                return Ok(order);
            }
            else
            {
                return NotFound();
            }
        }

        // POST api/<OrdersController>
        [HttpPost]
        public IActionResult Post([FromBody] Orders Order)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                string documentID = Guid.NewGuid().ToString();
                DocumentReference docRef = database.Collection("Order").Document(documentID);
                var specified = DateTime.SpecifyKind(DateTime.Now,DateTimeKind.Utc);
                //Custom ID: CollectionReference coll2 = database.Collection("New_Collection_CustomID").Document("id1");
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "DiscountCodeID", Order.DiscountCodeID},
                    { "OrdererName", Order.OrdererName},
                    { "OrdererPhoneNumber", Order.OrdererPhoneNumber},
                    { "OrdererEmail", Order.OrdererEmail},
                    { "DeliveryAddress", Order.DeliveryAddress},
                    { "TotalPrice", Order.TotalPrice},
                    { "CreateDate", specified.ToTimestamp()},
                    { "Note", Order.Note },
                    { "Status", Order.Status}
                };
                docRef.SetAsync(data);

                CollectionReference coll = docRef.Collection("OrderDetail");
                Dictionary<string, object> orderDetailList = new Dictionary<string, object>();
                foreach (var item in Order.orderDetails)
                {
                    orderDetailList.Add("ProductID", item.ProductID);
                    orderDetailList.Add("Amount", item.Amount);
                    orderDetailList.Add("Note", item.Note);
                    orderDetailList.Add("CreateDate", specified.ToTimestamp());
                    coll.AddAsync(orderDetailList);
                    orderDetailList = new Dictionary<string, object>();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<OrdersController>/5
        [HttpPut("{OrderId}")]
        public async Task<ActionResult> Put(string OrderId, [FromBody] Orders order)
        {
            return Ok();
        }

        // DELETE api/<OrdersController>/5
        [HttpDelete("{OrderId}")]
        public async Task<ActionResult> Delete(string OrderId)
        {
            return Ok();
        }

        [NonAction]
        public string generateRandomCode() // Dùng để tạo ra mã giảm giá gồm 12 ký tự
        {
            Random rand = new Random();
            int stringlength = 20;
            int randvalue;
            string str = "";
            char letter;
            for (int i = 0; i < stringlength; i++)
            {
                randvalue = rand.Next(0, 26);
                letter = Convert.ToChar(randvalue + 65);
                str += letter;
            }
            return str;
        }
    }
}
