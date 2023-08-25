using BusinessObjects;
using FireSharp.Extensions;
using Google.Cloud.Firestore;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;
using static Google.Cloud.Firestore.V1.StructuredQuery.Types;

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
                float? finalPrice = 0;
                // Check if product exist
                DocumentReference docRefProduct = database.Collection("Product").Document(orderDetail.ProductID);
                DocumentSnapshot docSnapProduct = await docRefProduct.GetSnapshotAsync();
                if (!docSnapProduct.Exists) {
                    return BadRequest("The product is not correct, please try again.");
                }
                else
                {
                    DocumentReference docRef = database.Collection("Order").Document(OrderId); //Get Order's basic information
                    // Create new Order Detail
                    CollectionReference collRef = docRef.Collection("OrderDetail");
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        {"ProductID", orderDetail.ProductID },
                        {"Amount", orderDetail.Amount},
                        {"Note", orderDetail.Note},
                        {"CreateDate", specified.ToTimestamp()}
                    };
                    // Check if OrderID is correct
                    DocumentSnapshot docSnapCheck = await docRef.GetSnapshotAsync();
                    if(!docSnapCheck.Exists)
                    {
                        return BadRequest("The order ID is not correct, please try again");
                    }
                    else
                    {
                        //Get OrderDetail in the OrderID information
                        Query qRef = docRef.Collection("OrderDetail");
                        QuerySnapshot qSnap = await qRef.GetSnapshotAsync();
                        foreach (var item in qSnap)
                        {
                            DocumentReference docRefOrderDetail = collRef.Document(item.Id);
                            DocumentSnapshot docSnapOrderDetail = await docRefOrderDetail.GetSnapshotAsync();
                            if (docSnapOrderDetail.Exists)
                            {
                                OrderDetail orderDetail1 = docSnapOrderDetail.ConvertTo<OrderDetail>();
                                orderDetail1.OrderDetailID = item.Id;
                                if (orderDetail1.ProductID == orderDetail.ProductID) //If there is an order detail's product ID in that order
                                                                                     //has the same productID of the new order detail
                                {
                                    await docRefOrderDetail.SetAsync(data);
                                    break;
                                }
                                else
                                {
                                    await collRef.AddAsync(data);
                                }
                            }
                        }
                        //---------------------------------------
                        //Calculate final price of order
                        qSnap = await qRef.GetSnapshotAsync();
                        foreach (var item in qSnap)
                        {
                            OrderDetail od = item.ConvertTo<OrderDetail>();
                            Query docRefProducts = database.Collection("Product");
                            QuerySnapshot docSnapProducts = await docRefProducts.GetSnapshotAsync();
                            foreach (var item2 in docSnapProducts)
                            {
                                Product productCheck = item2.ConvertTo<Product>();
                                productCheck.ProductID = item2.Id;
                                if (od.ProductID == productCheck.ProductID)
                                {
                                    finalPrice += od.Amount * productCheck.Price;
                                }
                            }
                        }
                        //---------------------------------------
                        DocumentSnapshot docSnap = await docRef.GetSnapshotAsync();
                        if (docSnap.Exists)
                        {
                            Orders order = docSnap.ConvertTo<Orders>();
                            if (order.DiscountCodeID == null || order.DiscountCodeID.Length == 0 || order.DiscountCodeID == "")
                            {// Case: If no discountID was added
                                Product product = docSnapProduct.ConvertTo<Product>();
                                //Calculate new price and update time in Order
                                Dictionary<string, object> dataOrder = new Dictionary<string, object>() {
                                { "DiscountCodeID", order.DiscountCodeID},
                                { "OrdererName", order.OrdererName},
                                { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                                { "OrdererEmail", order.OrdererEmail},
                                { "DeliveryAddress", order.DeliveryAddress},
                                { "TotalPrice", finalPrice},
                                { "CreateDate", specified.ToTimestamp()},
                                { "Note", order.Note },
                                { "Status", order.Status}
                            };
                                docRef.SetAsync(dataOrder);
                            }
                            else
                            {// Case: If there is discountID was added
                                Product product = docSnapProduct.ConvertTo<Product>();
                                //Calculate new price and update time in Order
                                Dictionary<string, object> dataOrder = new Dictionary<string, object>() {
                                { "OrdererName", order.OrdererName},
                                { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                                { "OrdererEmail", order.OrdererEmail},
                                { "DeliveryAddress", order.DeliveryAddress},
                                { "TotalPrice", finalPrice * 9 /10},
                                { "CreateDate", specified.ToTimestamp()},
                                { "Note", order.Note },
                                { "Status", order.Status}
                            };
                                docRef.SetAsync(dataOrder);
                            }
                        }
                        return Ok();
                    }
                }
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
                float? finalPrice = 0;
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
                            // Check if product exist
                            DocumentReference docRefProduct = database.Collection("Product").Document(orderdetailNew.ProductID);
                            DocumentSnapshot docSnapProduct = await docRefProduct.GetSnapshotAsync();
                            if (!docSnapProduct.Exists)
                            {
                                return BadRequest("The product is not correct, please try again.");
                            }
                            else
                            {
                                //Calculate new price
                                DocumentReference docRefOrder = database.Collection("Order").Document(docSnap.Id);
                                DocumentSnapshot docSnapOrder = await docRefOrder.GetSnapshotAsync();
                                if (docSnapOrder.Exists)
                                {
                                    Orders order = docSnapOrder.ConvertTo<Orders>();
                                    Product product = docSnapProduct.ConvertTo<Product>();
                                    if (order.DiscountCodeID == null || order.DiscountCodeID.Length == 0 || order.DiscountCodeID == "")
                                    {// Case: If no discountID was added
                                        finalPrice = order.TotalPrice + orderDetail.Amount * product.Price;
                                        Dictionary<string, object> dataOrder = new Dictionary<string, object>() {
                                            { "OrdererName", order.OrdererName},
                                            { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                                            { "OrdererEmail", order.OrdererEmail},
                                            { "DeliveryAddress", order.DeliveryAddress},
                                            { "TotalPrice", finalPrice},
                                            { "CreateDate", specified.ToTimestamp()},
                                            { "Note", order.Note },
                                            { "Status", order.Status}
                                        };
                                        await docRefOrder.SetAsync(dataOrder);
                                    }
                                    else
                                    {
                                        finalPrice = order.TotalPrice + orderDetail.Amount * product.Price;
                                        Dictionary<string, object> dataOrder = new Dictionary<string, object>() {
                                            { "OrdererName", order.OrdererName},
                                            { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                                            { "OrdererEmail", order.OrdererEmail},
                                            { "DeliveryAddress", order.DeliveryAddress},
                                            { "TotalPrice", finalPrice},
                                            { "CreateDate", specified.ToTimestamp()},
                                            { "Note", order.Note },
                                            { "Status", order.Status}
                                        };
                                        await docRefOrder.SetAsync(dataOrder);
                                    }
                                }
                            }
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
