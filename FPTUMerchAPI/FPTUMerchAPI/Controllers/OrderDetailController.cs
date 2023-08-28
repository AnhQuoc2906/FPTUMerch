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
                //----------------------------------------------------------------------------
                Query qRefProduct = database.Collection("Product");
                QuerySnapshot qSnapProduct = await qRefProduct.GetSnapshotAsync();
                bool check = true;
                string tmpOrderDetailId = "";
                float? totalPrice = 0;
                int tmpOrderDetailAmount = 0;
                //UPDATE ORDER DETAIL
                foreach(var docSnapProduct in qSnapProduct) //CHECK IF PRODUCT EXIST
                {
                    Product product = docSnapProduct.ConvertTo<Product>();
                    product.ProductID = docSnapProduct.Id;
                    if(orderDetail.ProductID == product.ProductID) //1. CHECK IF PRODUCT EXIST
                    {//TRUE
                        Dictionary<string, object> newOrderDetail = new Dictionary<string, object>() {
                            { "ProductID", orderDetail.ProductID },
                            { "Amount", orderDetail.Amount },
                            { "Note", orderDetail.Note },
                            { "CreateDate", specified.ToTimestamp() }
                        };
                        Query qRefOrderDetail = database.Collection("Order").Document(OrderId).Collection("OrderDetail"); //Get OrderDetails by OrderID
                        QuerySnapshot qSnapOrderDetail = await qRefOrderDetail.GetSnapshotAsync();
                        //CHECK IF ORDER EXIST:
                        DocumentReference docRefCheckOrder = database.Collection("Order").Document(OrderId);
                        DocumentSnapshot docSnapCheckOrder = await docRefCheckOrder.GetSnapshotAsync();
                        if (!docSnapCheckOrder.Exists)
                        {
                            return BadRequest("This orderID not exist, please try again");
                        }
                        else
                        {
                            if (qSnapOrderDetail.Count > 0)
                            { // IF ORDER ALREADY HAS DETAILS
                                foreach (var docSnapOrderDetail in qSnapOrderDetail)
                                {
                                    OrderDetail existOrderDetail = docSnapOrderDetail.ConvertTo<OrderDetail>();
                                    existOrderDetail.OrderDetailID = docSnapOrderDetail.Id;
                                    if (existOrderDetail.ProductID == orderDetail.ProductID) //1.1 CHECK IF PRODUCT ALREADY EXIST IN ORDER
                                    { // 1.1.1: EXIST IN ORDER
                                        check = true;
                                        tmpOrderDetailId = existOrderDetail.OrderDetailID;
                                        tmpOrderDetailAmount = existOrderDetail.Amount;
                                        break;
                                    }
                                    else
                                    { // 1.1.2: NOT EXIST IN ORDER
                                        check = false;
                                        continue;
                                    }
                                }
                                Dictionary<string, object> updateProduct = new Dictionary<string, object>()
                                    {
                                        { "ProductName", product.ProductName},
                                        { "ProductLink", product.ProductLink},
                                        { "ProductDescription", product.ProductDescription},
                                        { "Quantity", product.Quantity},
                                        //{ "CurrentQuantity", currentProduct.CurrentQuantity},
                                        { "Price", product.Price},
                                        { "Note", product.Note}
                                    };
                                if (check == true)
                                { // 1.1.1: EXIST IN ORDER
                                    DocumentReference docRefOrderDetail = database.Collection("Order").Document(OrderId)
                                        .Collection("OrderDetail").Document(tmpOrderDetailId);
                                    Product currentProduct = docSnapProduct.ConvertTo<Product>();
                                    int? oldCurrentQuantity = currentProduct.CurrentQuantity;
                                    currentProduct.CurrentQuantity = currentProduct.CurrentQuantity + tmpOrderDetailAmount - orderDetail.Amount;
                                    updateProduct.Add("CurrentQuantity", currentProduct.CurrentQuantity);
                                    if (product.CurrentQuantity > 0)
                                    {
                                        updateProduct.Add("IsActive", true);
                                    }
                                    else
                                    {
                                        updateProduct.Add("IsActive", false);
                                    }
                                    docRefOrderDetail.SetAsync(newOrderDetail);
                                    DocumentReference docRefProduct = database.Collection("Product").Document(docSnapProduct.Id);
                                    docRefProduct.SetAsync(updateProduct);
                                    break;
                                }
                                else
                                {
                                    CollectionReference collRefOrderDetail = database.Collection("Order").Document(OrderId).Collection("OrderDetail");
                                    collRefOrderDetail.AddAsync(newOrderDetail);
                                    updateProduct.Add("CurrentQuantity", product.CurrentQuantity -= orderDetail.Amount);
                                    if (product.CurrentQuantity > 0)
                                    {
                                        updateProduct.Add("IsActive", true);
                                    }
                                    else
                                    {
                                        updateProduct.Add("IsActive", false);
                                    }
                                    DocumentReference docRefProduct = database.Collection("Product").Document(docSnapProduct.Id);
                                    docRefProduct.SetAsync(updateProduct);
                                    break;
                                }
                            }
                            else
                            { // IF ORDER DON'T HAVE ANY ORDER DETAILS
                                CollectionReference collRefOrderDetail = database.Collection("Order").Document(OrderId).Collection("OrderDetail");
                                collRefOrderDetail.AddAsync(newOrderDetail);
                                Dictionary<string, object> updateProduct = new Dictionary<string, object>()
                                    {
                                    { "ProductName", product.ProductName},
                                    { "ProductLink", product.ProductLink},
                                    { "ProductDescription", product.ProductDescription},
                                    { "Quantity", product.Quantity},
                                    { "CurrentQuantity", product.CurrentQuantity -= orderDetail.Amount},
                                    { "Price", product.Price},
                                    { "Note", product.Note}
                                };
                                if (product.CurrentQuantity > 0)
                                {
                                    updateProduct.Add("IsActive", true);
                                }
                                else
                                {
                                    updateProduct.Add("IsActive", false);
                                }
                                DocumentReference docRefProduct = database.Collection("Product").Document(docSnapProduct.Id);
                                docRefProduct.SetAsync(updateProduct);
                                break;
                            }
                        }
                        //---------------------------------------------------------------
                    }
                }
                //CALCULATE THE PRODUCT AND UPDATE THE TOTAL PRICE OF ORDER
                DocumentReference docRefOrderUpdate = database.Collection("Order").Document(OrderId);
                Query collRefOrder = docRefOrderUpdate.Collection("OrderDetail");
                QuerySnapshot collSnapOrder = await collRefOrder.GetSnapshotAsync();
                foreach(var docSnapOrderDetail in collSnapOrder) // Với mỗi order detail trong order mới sửa
                {
                    OrderDetail newOrderDetail = docSnapOrderDetail.ConvertTo<OrderDetail>();
                    newOrderDetail.OrderDetailID = docSnapOrderDetail.Id;
                    foreach (var docSnapProduct in qSnapProduct)
                    {
                        Product product = docSnapProduct.ConvertTo<Product>();
                        product.ProductID = docSnapProduct.Id;
                        if(newOrderDetail.ProductID == product.ProductID)
                        {
                            totalPrice += product.Price * newOrderDetail.Amount;
                            break;
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
                DocumentSnapshot docSnapOrderUpdate = await docRefOrderUpdate.GetSnapshotAsync();
                if (docSnapOrderUpdate.Exists)
                {
                    Orders order = docSnapOrderUpdate.ConvertTo<Orders>();
                    Dictionary<string, object> updateOrder = new Dictionary<string, object>() {
                        { "DiscountCodeID", order.DiscountCodeID},
                        { "OrdererName", order.OrdererName},
                        { "OrdererPhoneNumber", order.OrdererPhoneNumber},
                        { "OrdererEmail", order.OrdererEmail},
                        { "DeliveryAddress", order.DeliveryAddress},
                        { "CreateDate", specified.ToTimestamp()},
                        { "Note", order.Note },
                        { "Status", order.Status}
                    };
                    if (order.DiscountCodeID != null)
                    {
                        totalPrice = totalPrice * 9 / 10;
                    }
                    updateOrder.Add("TotalPrice", totalPrice);
                    docRefOrderUpdate.SetAsync(updateOrder);
                }

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
