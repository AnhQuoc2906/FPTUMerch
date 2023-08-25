using BusinessObjects;
using FireSharp.Extensions;
using Google.Cloud.Firestore;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
        // GET: api/<OrdersController>
        [HttpGet]
        public async Task<ActionResult> GetOrders()
        {
            try
            {
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
                        foreach (DocumentSnapshot docsnap2 in queryColl)
                        {
                            if (docsnap2.Exists)
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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        public async Task<ActionResult> GetActiveOrders()
        {
            try
            {
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
                        foreach (DocumentSnapshot docsnap2 in queryColl)
                        {
                            if (docsnap2.Exists)
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
                return Ok(ordersList.Where(x=> x.Status.Equals(true)));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // GET api/<OrdersController>/5
        [HttpGet("{OrderId}")]
        public async Task<ActionResult> GetOrdersByOrderID(string OrderId)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                Orders order = new Orders();
                DocumentReference docRef = database.Collection("Order").Document(OrderId);
                DocumentSnapshot docSnap = await docRef.GetSnapshotAsync();
                if (docSnap.Exists)
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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<OrdersController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Orders Order)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                string documentID = Guid.NewGuid().ToString();
                DocumentReference docRef = database.Collection("Order").Document(documentID);
                var specified = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                float totalPrice = 0;

                /*CALCULATE TOTAL PRICE OF ORDER AND IF PRODUCT EXISTS*/
                foreach(var item in Order.orderDetails)
                {
                    DocumentReference docRefProduct = database.Collection("Product").Document(item.ProductID);
                    DocumentSnapshot docSnapProduct = await docRefProduct.GetSnapshotAsync();
                    if (docSnapProduct.Exists)
                    {
                        Product product = docSnapProduct.ConvertTo<Product>();
                        totalPrice += product.Price * item.Amount;
                    }
                    else
                    {
                        return BadRequest("The product is not correct, please try again.");
                    }
                }
                /*CHECK IF DISCOUNT CODE CORRECT*/
                if (Order.DiscountCodeID != null && Order.DiscountCodeID != "" && Order.DiscountCodeID.Length != 0)
                {
                    DocumentReference docRefDiscountCode = database.Collection("DiscountCode").Document(Order.DiscountCodeID);
                    DocumentSnapshot docSnapDiscountCode = await docRefDiscountCode.GetSnapshotAsync();
                    if (!docSnapDiscountCode.Exists)
                    {
                        return BadRequest("The Discount Code is not exist");
                    }
                    else
                    {
                        DiscountCode discountCode = docSnapDiscountCode.ConvertTo<DiscountCode>();
                        // FALSE: MÃ CHƯA KÍCH HOẠT, TRUE: MÃ ĐÃ KÍCH HOẠT
                        if (discountCode.Status == false)
                        {
                            return BadRequest("The Discount Code is not activated yet");
                        }
                        else
                        {
                            Dictionary<string, object> updateDiscountCode = new Dictionary<string, object>()
                            {
                                { "Status",discountCode.Status },
                                { "NumberOfTimes", discountCode.NumberOfTimes + 1}
                            };
                            await docRefDiscountCode.SetAsync(updateDiscountCode);
                            totalPrice = totalPrice * 9 / 10;
                        }
                    }
                }
                /*ADD ORDER BASIC INFORMATION*/
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "DiscountCodeID", Order.DiscountCodeID},
                    { "OrdererName", Order.OrdererName},
                    { "OrdererPhoneNumber", Order.OrdererPhoneNumber},
                    { "OrdererEmail", Order.OrdererEmail},
                    { "DeliveryAddress", Order.DeliveryAddress},
                    { "TotalPrice", totalPrice},
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
        // Update Order's Entities, Not Order Detail's Entities
        [HttpPut("{OrderId}")]
        public async Task<ActionResult> Put(string OrderId, [FromBody] Orders order)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Order").Document(OrderId);
                var specified = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
                float totalPrice = 0;
                /*CALCULATE TOTAL PRICE OF ORDER AND IF PRODUCT EXISTS*/
                foreach (var item in order.orderDetails)
                {
                    DocumentReference docRefProduct = database.Collection("Product").Document(item.ProductID);
                    DocumentSnapshot docSnapProduct = await docRefProduct.GetSnapshotAsync();
                    if (docSnapProduct.Exists)
                    {
                        Product product = docSnapProduct.ConvertTo<Product>();
                        totalPrice += product.Price * item.Amount;
                    }
                    else
                    {
                        return BadRequest("The product is not correct, please try again.");
                    }
                }
                /*CHECK IF DISCOUNT CODE CORRECT*/
                if (order.DiscountCodeID != null && order.DiscountCodeID != "" && order.DiscountCodeID.Length != 0)
                {
                    DocumentReference docRefDiscountCode = database.Collection("DiscountCode").Document(order.DiscountCodeID);
                    DocumentSnapshot docSnapDiscountCode = await docRefDiscountCode.GetSnapshotAsync();
                    if (!docSnapDiscountCode.Exists)
                    {
                        return BadRequest("The Discount Code is not exist");
                    }
                    else
                    {
                        DiscountCode discountCode = docSnapDiscountCode.ConvertTo<DiscountCode>();
                        Dictionary<string, object> updateDiscountCode = new Dictionary<string, object>()
                        {
                            { "Status",discountCode.Status },
                            { "NumberOfTimes", discountCode.NumberOfTimes + 1}
                        };
                        await docRefDiscountCode.SetAsync(updateDiscountCode);
                        totalPrice = totalPrice * 9 / 10;
                    }
                }
                /*UPDATE ORDER BASIC DETAILS*/
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "OrdererName", order.OrdererName},
                    { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                    { "OrdererEmail", order.OrdererEmail},
                    { "DeliveryAddress", order.DeliveryAddress},
                    { "TotalPrice", totalPrice},
                    { "CreateDate", specified.ToTimestamp()},
                    { "Note", order.Note },
                    { "Status", order.Status}
                };
                docRef.SetAsync(data);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<OrdersController>/5
        [HttpDelete("{OrderId}")]
        public async Task<ActionResult> Delete(string OrderId)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Order").Document(OrderId);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    Orders order = snap.ConvertTo<Orders>();
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        { "OrdererName", order.OrdererName},
                        { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                        { "OrdererEmail", order.OrdererEmail},
                        { "DeliveryAddress", order.DeliveryAddress},
                        { "TotalPrice", order.TotalPrice},
                        { "CreateDate", order.CreateDate},
                        { "Note", order.Note },
                        { "Status", false} //TRUE: Not cancelled, FALSE: cancelled
                    };
                    docRef.SetAsync(data);
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
