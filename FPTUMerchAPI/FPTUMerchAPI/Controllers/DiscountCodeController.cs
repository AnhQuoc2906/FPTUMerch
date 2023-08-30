using BusinessObjects;
using FireSharp.Extensions;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Text;
using System.Xml.Linq;

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountCodeController : ControllerBase
    {
        string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerch.json";
        // GET: api/<DiscountCodeController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                CollectionReference coll = database.Collection("DiscountCode");
                List<DiscountCode> discountCodeList = new List<DiscountCode>();
                Query Qref = database.Collection("DiscountCode");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        DiscountCode discountCode = docsnap.ConvertTo<DiscountCode>();
                        discountCode.DiscountCodeID = docsnap.Id;
                        discountCodeList.Add(discountCode);
                    }
                }
                return Ok(discountCodeList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<DiscountCodeController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetByCode(string id)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                CollectionReference coll = database.Collection("DiscountCode");
                List<DiscountCode> discountCodeList = new List<DiscountCode>();
                Query Qref = database.Collection("DiscountCode");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        DiscountCode discountCode = docsnap.ConvertTo<DiscountCode>();
                        discountCode.DiscountCodeID = docsnap.Id;
                        discountCodeList.Add(discountCode);
                    }
                }
                if (id == null || id.Equals("") || id.Length == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(discountCodeList.Where(x => x.DiscountCodeID.Contains(id)));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<DiscountCodeController>
        [HttpPost]
        public IActionResult Post()
        {
            try
            {
                string discountCode = generateRandomCode();
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference coll = database.Collection("DiscountCode").Document(discountCode);
                //Custom ID: CollectionReference coll2 = database.Collection("New_Collection_CustomID").Document("id1");
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "Status", false}, // FALSE: MÃ CHƯA KÍCH HOẠT, TRUE: MÃ ĐÃ KÍCH HOẠT
                    { "NumberOfTimes", 0},
                    { "KPI", 0 }
                };
                coll.SetAsync(data);
                return Ok("DiscountCodeID: " + discountCode + " " + data.ToJson());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<DiscountCodeController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] DiscountCode discountCode)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference docRef = database.Collection("DiscountCode").Document(id);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        { "Status",discountCode.Status},
                        { "NumberOfTimes", discountCode.NumberOfTimes},
                        { "KPI", discountCode.KPI }
                    };
                    await docRef.SetAsync(data);
                    snap = await docRef.GetSnapshotAsync();
                    DiscountCode ret = snap.ConvertTo<DiscountCode>();
                    ret.DiscountCodeID = id;
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

        [HttpPut("useCode/{id}")]
        public async Task<ActionResult> UseCode(string id)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference docRef = database.Collection("DiscountCode").Document(id);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    DiscountCode discountCode = snap.ConvertTo<DiscountCode>();
                    /*ONLY UPDATE WHEN STATUS = TRUE*/
                    if (discountCode.Status == false)
                    {
                        return BadRequest("The Discount Code is not activated yet");
                    }
                    else
                    {
                        Dictionary<string, object> data = new Dictionary<string, object>()
                        {
                            { "Status",discountCode.Status },
                            { "NumberOfTimes", discountCode.NumberOfTimes + 1},
                            { "KPI", discountCode.KPI }
                        };
                        await docRef.SetAsync(data);
                        snap = await docRef.GetSnapshotAsync();
                        DiscountCode ret = snap.ConvertTo<DiscountCode>();
                        ret.DiscountCodeID = id;
                        return Ok(ret);
                    }
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

        [HttpPut("updateStatus/{id}")]
        public async Task<ActionResult> UpdateStatus(string id, [FromBody] bool status)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference docRef = database.Collection("DiscountCode").Document(id);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    DiscountCode discountCode = snap.ConvertTo<DiscountCode>();
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        {"Status", status},
                        {"NumberOfTimes", discountCode.NumberOfTimes },
                        {"KPI", discountCode.KPI }
                    };
                    await docRef.SetAsync(data);
                    snap = await docRef.GetSnapshotAsync();
                    DiscountCode ret = snap.ConvertTo<DiscountCode>();
                    ret.DiscountCodeID = id;
                    return Ok(ret);
                }
                else
                {
                    return BadRequest("The Discount code is not exist");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE api/<DiscountCodeController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerch-abcde");
                DocumentReference docRef = database.Collection("DiscountCode").Document(id);
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

        [NonAction]
        public string generateRandomCode() // Dùng để tạo ra mã giảm giá gồm 12 ký tự
        {
            Random rand = new Random();
            int stringlength = 12;
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
