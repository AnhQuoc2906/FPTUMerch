using BusinessObjects;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerch.json";
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                List<Product> productList = new List<Product>();
                Query Qref = database.Collection("Product");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        Product product = docsnap.ConvertTo<Product>();
                        product.ProductID = docsnap.Id;
                        productList.Add(product);
                    }
                }
                return Ok(productList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{name}")]
        public async Task<ActionResult> GetByName(string name)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                CollectionReference coll = database.Collection("Product");
                List<Product> productList = new List<Product>();
                Query Qref = database.Collection("Product");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        Product product = docsnap.ConvertTo<Product>();
                        product.ProductID = docsnap.Id;
                        productList.Add(product);
                    }
                }
                if (name == null || name.Equals("") || name.Length == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(productList.Where(x => x.ProductName.IndexOf(name, StringComparison.OrdinalIgnoreCase) >= 0));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Product product)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                CollectionReference coll = database.Collection("Product");
                if (product.Quantity < 0)
                {
                    return BadRequest("The product quantity cannot be lower than 1");
                }
                else
                {
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        { "ProductName", product.ProductName},
                        { "ProductLink", product.ProductLink},
                        { "ProductDescription", product.ProductDescription},
                        { "Quantity", product.Quantity},
                        { "CurrentQuantity", product.Quantity},
                        { "IsActive", true},
                        { "Price", product.Price},
                        { "Note", product.Note}
                    };
                    //Check if product name already exists
                    Query productQuery = database.Collection("Product");
                    QuerySnapshot productSnap = await productQuery.GetSnapshotAsync();
                    foreach (DocumentSnapshot docSnap in productSnap)
                    {
                        if (docSnap.Exists)
                        {
                            Product productCheck = docSnap.ConvertTo<Product>();
                            productCheck.ProductID = docSnap.Id;
                            if (productCheck.ProductName.IndexOf(product.ProductName, StringComparison.OrdinalIgnoreCase) >= 0)
                            {
                                return Conflict(productCheck);
                            }
                        }
                    }
                    //-------------------------------------------
                    coll.AddAsync(data);
                    return Ok();
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }       

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] Product product)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference docRef = database.Collection("Product").Document(id);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    bool status;
                    if (product.CurrentQuantity > 0)
                    { // If the product still in stock
                        status = true;
                    }
                    else
                    { // If the product not in stock
                        status = false;
                    }
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        { "ProductName", product.ProductName},
                        { "ProductLink", product.ProductLink},
                        { "ProductDescription", product.ProductDescription},
                        { "Quantity", product.Quantity},
                        { "CurrentQuantity", product.CurrentQuantity},
                        { "IsActive", status},
                        { "Price", product.Price},
                        { "Note", product.Note}
                    };
                    await docRef.SetAsync(data);
                    snap = await docRef.GetSnapshotAsync();
                    Product ret = snap.ConvertTo<Product>();
                    ret.ProductID = id;
                    return Ok(ret);
                }
                else
                {
                    return BadRequest("The product ID is not exist, please try again");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference docRef = database.Collection("Product").Document(id);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    docRef.DeleteAsync();
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
