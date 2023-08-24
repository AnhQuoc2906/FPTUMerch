using BusinessObjects;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
        // GET: api/<UsersController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                List<Users> usersList = new List<Users>();
                Query Qref = database.Collection("Users");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        Users user = docsnap.ConvertTo<Users>();
                        user.UserID = docsnap.Id;
                        usersList.Add(user);
                    }
                }
                return Ok(usersList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetByUserId(string id)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                List<Users> usersList = new List<Users>();
                Query Qref = database.Collection("Users");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        Users user = docsnap.ConvertTo<Users>();
                        user.UserID = docsnap.Id;
                        usersList.Add(user);
                    }
                }
                if (id == null || id.Equals("") || id.Length == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(usersList.Where(x => x.UserID.Equals(id)));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetByEmailAndPassword([FromBody] UserAuthentication userCheck)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                CollectionReference coll = database.Collection("Users");
                List<Users> usersList = new List<Users>();
                Query Qref = database.Collection("Users");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        Users user = docsnap.ConvertTo<Users>();
                        if (userCheck.Email == user.Email && userCheck.Password == user.Password)
                        {
                            return Ok("This Account Exists");
                        }
                        else
                        {
                            continue;
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

        // POST api/<UsersController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Users user)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                CollectionReference coll = database.Collection("Users");
                //Custom ID: CollectionReference coll2 = database.Collection("New_Collection_CustomID").Document("id1");
                DocumentReference docRef = database.Collection("Role").Document(user.RoleID);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (!snap.Exists)
                {
                    return BadRequest("The role ID not correct or not exist, please try again");
                }
                else
                {
                    Query Qref = database.Collection("Users");
                    QuerySnapshot Qsnap = await Qref.GetSnapshotAsync();
                    foreach (DocumentSnapshot docsnap in Qsnap)
                    {
                        if (docsnap.Exists)
                        {
                            Users userCheck = docsnap.ConvertTo<Users>();
                            if (userCheck.Email.IndexOf(user.Email, StringComparison.OrdinalIgnoreCase) >= 0) //Kiểm tra email tồn tại không?
                            {
                                return BadRequest("The email already exist, please try again");
                            }
                            else
                            {
                                continue;
                            }
                        }
                    }
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        { "FullName", user.FullName},
                        { "Email", user.Email},
                        { "Password", user.Password},
                        { "Note", user.Note},
                        { "RoleID", user.RoleID}
                    };
                    coll.AddAsync(data);
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] Users user)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Users").Document(id);
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    Users userUpdate = snap.ConvertTo<Users>();
                    Dictionary<string, object> data = new Dictionary<string, object>()
                    {
                        { "FullName", user.FullName},
                        { "Email", userUpdate.Email},
                        { "Password", user.Password},
                        { "Note", user.Note},
                        { "RoleID", userUpdate.RoleID}
                    };
                    await docRef.SetAsync(data);
                    snap = await docRef.GetSnapshotAsync();
                    Users ret = snap.ConvertTo<Users>();
                    ret.UserID = id;
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

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Users").Document(id);
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
