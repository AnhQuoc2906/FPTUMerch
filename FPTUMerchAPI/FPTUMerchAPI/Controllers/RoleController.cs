﻿using BusinessObjects;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        // GET: api/<RoleController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
            FirestoreDb database = FirestoreDb.Create("fptumerchtest");
            CollectionReference coll = database.Collection("Role");
            List<Role> roleList = new List<Role>();
            Query Qref = database.Collection("Role");
            QuerySnapshot snap = await Qref.GetSnapshotAsync();

            foreach (DocumentSnapshot docsnap in snap)
            {
                if (docsnap.Exists)
                {
                    Role role = docsnap.ConvertTo<Role>();
                    role.RoleID = docsnap.Id;
                    roleList.Add(role);
                }
            }
            return Ok(roleList);
        }

        // GET api/<RoleController>/5
        [HttpGet("{name}")]
        public async Task<ActionResult> Get(string name)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                CollectionReference coll = database.Collection("Role");
                List<Role> roleList = new List<Role>();
                Query Qref = database.Collection("Role");
                QuerySnapshot snap = await Qref.GetSnapshotAsync();

                foreach (DocumentSnapshot docsnap in snap)
                {
                    if (docsnap.Exists)
                    {
                        Role role = docsnap.ConvertTo<Role>();
                        role.RoleID = docsnap.Id;
                        roleList.Add(role);
                    }
                }
                if (name == null || name.Equals("") || name.Length == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(roleList.Where(x => x.RoleName.Equals(name)));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<RoleController>
        [HttpPost]
        public IActionResult Post([FromBody] Role role)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                CollectionReference coll = database.Collection("Role");
                //Custom ID: CollectionReference coll2 = database.Collection("New_Collection_CustomID").Document("id1");
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "RoleName", role.RoleName},
                    { "RoleDescription", role.RoleDescription}
                };
                coll.AddAsync(data);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<RoleController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] Role role)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Role").Document(id);
                Dictionary<string, object> data = new Dictionary<string, object>()
                {
                    { "RoleName", role.RoleName},
                    { "RoleDescription", role.RoleDescription}
                };
                DocumentSnapshot snap = await docRef.GetSnapshotAsync();
                if (snap.Exists)
                {
                    await docRef.SetAsync(data);
                    snap = await docRef.GetSnapshotAsync();
                    Role ret = snap.ConvertTo<Role>();
                    ret.RoleID = id;
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

        // DELETE api/<RoleController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory + @"fptumerchtest.json";
                Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
                FirestoreDb database = FirestoreDb.Create("fptumerchtest");
                DocumentReference docRef = database.Collection("Role").Document(id);
                docRef.DeleteAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
