using BusinessObjects;
using FireSharp.Extensions;
using Google.Cloud.Firestore;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
        // GET: api/<OrderDetailController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                List<OrderDetail> orderDetailList = new List<OrderDetail>();
                Query QrefOrder = database.Collection("Order");
                QuerySnapshot snap = await QrefOrder.GetSnapshotAsync();
                foreach (DocumentSnapshot docSnap in snap)
                {
                    Query QrefOrderDetail = database.Collection("Order").Document(docSnap.Id).Collection("OrderDetail");
                    QuerySnapshot snap2 = await QrefOrderDetail.GetSnapshotAsync();
                    foreach (DocumentSnapshot docSnap2 in snap2)
                    {
                        OrderDetail orderdetail = docSnap2.ConvertTo<OrderDetail>();
                        orderdetail.OrderDetailID = docSnap2.Id;
                        orderdetail.OrderID = docSnap.Id;
                        orderDetailList.Add(orderdetail);
                    }
                }
                return Ok(orderDetailList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<OrderDetailController>/5
        [HttpGet("{OrderId}")]
        public async Task<ActionResult> GetByOrderID(string OrderId)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                List<OrderDetail> orderDetailList = new List<OrderDetail>();
                Query qRef = database.Collection("Order").Document(OrderId).Collection("OrderDetail");
                QuerySnapshot qSnap = await qRef.GetSnapshotAsync();
                foreach (DocumentSnapshot docSnap in qSnap)
                {
                    OrderDetail orderDetail = docSnap.ConvertTo<OrderDetail>();
                    orderDetail.OrderDetailID = docSnap.Id;
                    orderDetail.OrderID = OrderId;
                    orderDetailList.Add(orderDetail);
                }
                return Ok(orderDetailList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET api/<OrderDetailController>/5
        [HttpGet("{OrderDetailId}")]
        public async Task<ActionResult> GetByOrderDetailID(string OrderDetailId)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                List<OrderDetail> orderDetailList = new List<OrderDetail>();
                Query QrefOrder = database.Collection("Order");
                QuerySnapshot snap = await QrefOrder.GetSnapshotAsync();
                foreach (DocumentSnapshot docSnap in snap)
                {
                    Query QrefOrderDetail = database.Collection("Order").Document(docSnap.Id).Collection("OrderDetail");
                    QuerySnapshot snap2 = await QrefOrderDetail.GetSnapshotAsync();
                    foreach (DocumentSnapshot docSnap2 in snap2)
                    {
                        OrderDetail orderdetail = docSnap2.ConvertTo<OrderDetail>();
                        orderdetail.OrderDetailID = docSnap2.Id;
                        orderdetail.OrderID = docSnap.Id;
                        orderDetailList.Add(orderdetail);
                    }
                }
                return Ok(orderDetailList.SingleOrDefault(x => x.OrderDetailID == OrderDetailId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<OrderDetailController>
        [HttpPost("{OrderId}")]
        public async Task<ActionResult> Post(string OrderId, [FromBody] OrderDetail orderDetail)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                var specified = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                // Update time in Order
                DocumentReference docRef = database.Collection("Order").Document(OrderId);
                DocumentSnapshot docSnap = await docRef.GetSnapshotAsync();
                if (docSnap.Exists)
                {
                    Orders order = docSnap.ConvertTo<Orders>();
                    Dictionary<string, object> dataOrder = new Dictionary<string, object>() {
                    { "OrdererName", order.OrdererName},
                    { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                    { "OrdererEmail", order.OrdererEmail},
                    { "DeliveryAddress", order.DeliveryAddress},
                    { "TotalPrice", order.TotalPrice},
                    { "CreateDate", specified.ToTimestamp()},
                    { "Note", order.Note },
                    { "Status", order.Status}
                };
                    docRef.SetAsync(dataOrder);
                }
                // Create new Order Detail
                CollectionReference collRef = docRef.Collection("OrderDetail");
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    {"ProductID", orderDetail.ProductID },
                    {"Amount", orderDetail.Amount},
                    {"Note", orderDetail.Note},
                    {"CreateDate", specified.ToTimestamp()}
                };
                collRef.AddAsync(data);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<OrderDetailController>/5
        [HttpPut("{OrderDetailId}")]
        public async Task<ActionResult> Put(string OrderDetailId, [FromBody] OrderDetail orderDetail)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                //-----------------------------------------------------------------------
                OrderDetail orderdetailNew = new OrderDetail();
                var specified = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                Query QrefOrder = database.Collection("Order");
                QuerySnapshot snap = await QrefOrder.GetSnapshotAsync();
                Dictionary<string, object> data = new Dictionary<string, object>();
                foreach (DocumentSnapshot docSnap in snap)
                {
                    Query QrefOrderDetail = database.Collection("Order").Document(docSnap.Id).Collection("OrderDetail");
                    QuerySnapshot snap2 = await QrefOrderDetail.GetSnapshotAsync();
                    foreach (DocumentSnapshot docSnap2 in snap2)
                    {
                        if (docSnap2.Id == OrderDetailId)
                        {
                            DocumentReference docRef = database.Collection("Order").Document(docSnap.Id)
                                .Collection("OrderDetail").Document(docSnap2.Id);
                            orderdetailNew = docSnap2.ConvertTo<OrderDetail>();
                            data.Add("ProductID", orderdetailNew.ProductID);
                            data.Add("Amount", orderDetail.Amount);
                            data.Add("Note", orderDetail.Note);
                            data.Add("CreateDate", specified.ToTimestamp());
                            await docRef.SetAsync(data);
                        }
                    }
                }
                return Ok(data.ToJson());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<OrderDetailController>/5
        [HttpDelete("{OrderDetailId}")]
        public async Task<ActionResult> Delete(string OrderDetailId)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                List<OrderDetail> orderDetailList = new List<OrderDetail>();
                Query QrefOrder = database.Collection("Order");
                QuerySnapshot snap = await QrefOrder.GetSnapshotAsync();
                foreach (DocumentSnapshot docSnap in snap)
                {
                    Query QrefOrderDetail = database.Collection("Order").Document(docSnap.Id).Collection("OrderDetail");
                    QuerySnapshot snap2 = await QrefOrderDetail.GetSnapshotAsync();
                    foreach (DocumentSnapshot docSnap2 in snap2)
                    {
                        if (docSnap2.Id == OrderDetailId)
                        {
                            DocumentReference docRef = database.Collection("Order").Document(docSnap.Id).Collection("OrderDetail").Document(OrderDetailId);
                            docRef.DeleteAsync();
                            return Ok();
                        }
                    }
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
