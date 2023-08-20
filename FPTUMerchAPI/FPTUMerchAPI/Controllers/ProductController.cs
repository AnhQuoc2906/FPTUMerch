using BusinessObjects;
using FireSharp.Config;
using FireSharp.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPTUMerchAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        IFirebaseConfig config = new FirebaseConfig
        {
            AuthSecret = "7PKaooYMpuVCQxgCojoqYL5FzDZppgU68LFfdcl3",
            BasePath = "https://fptumerchtest-default-rtdb.asia-southeast1.firebasedatabase.app/",
        };

        //GET: Products
        [HttpGet]
        public ActionResult Get()
        {
            return Ok();
        }

        [HttpPost]
        public ActionResult Post(Product product)
        {
            return Ok();
        }
    }
}
