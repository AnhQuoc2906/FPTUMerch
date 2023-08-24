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
        string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
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
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
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
        public IActionResult Post([FromBody] Product product)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                CollectionReference coll = database.Collection("Product");
                //Custom ID: CollectionReference coll2 = database.Collection("New_Collection_CustomID").Document("id1");
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "ProductName", product.ProductName},
                    { "ProductLink", product.ProductLink},
                    { "ProductDescription", product.ProductDescription},
                    { "Price", product.Price},
                    { "Note", product.Note}
                };
                coll.AddAsync(data);
                return Ok();
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
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Product").Document(id);
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "ProductName", product.ProductName},
                    { "ProductLink", product.ProductLink},
                    { "ProductDescription", product.ProductDescription},
                    { "Price", product.Price},
                    { "Note", product.Note}
                };
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    await docRef.SetAsync(data);
                    snap = await docRef.GetSnapshotAsync();
                    Product ret = snap.ConvertTo<Product>();
                    ret.ProductID = id;
                    return Ok(ret);
                }
                else
                {
                    return BadRequest(docRef);
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
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
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
