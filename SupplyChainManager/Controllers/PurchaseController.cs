using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using SupplyChainManager.Models;
using SupplyChainManager.Daos;
using System.Drawing;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Configuration;

namespace SupplyChainManager.Controllers
{

    [UserAuthorize]
    public class PurchaseController : Controller
    {
        private PurchaseDao dao = new PurchaseDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<Purchase> page = new Page<Purchase>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 50 : int.Parse(formCollection["limit"]);
            if (!string.IsNullOrEmpty(Request["order_id"]))
            {
                page.Params.Add("order_id", formCollection["order_id"]);
            }
            int count = 0;
            var result = dao.FindByPage(page, ref count);
            page.Root = result;
            page.TotalProperty = count;

            JsonNetResult jsonNetResult = new JsonNetResult();
            jsonNetResult.Formatting = Formatting.Indented;
            jsonNetResult.SerializerSettings.Converters.Add(new JavaScriptDateTimeConverter());
            jsonNetResult.Data = page;

            return jsonNetResult;

        }

        // Ìí¼Ó        
        public ContentResult Create(Purchase purchase)
        {
            string result = "{success:false,Id:0}";
            User user = (User)Session["user"];
           
            int id = dao.Create(purchase);
            if (id > 0)
            {
                result = "{success:true,Id:" + id + "}";
            }
            return new ContentResult
            {
                Content = result
            };
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult Delete(int Id)
        {
            string result = "{success:false}";
            try
            {
                dao.Delete(Id);

                result = "{success:true}";
            }
            catch { }
            return new ContentResult
            {
                Content = result
            };
        }

        // ¸ü¸Ä
        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult Edit(Purchase purchase)
        {
            string result = "{success:false,Id:1}";
            try
            {
                Purchase row = dao.FindById(purchase.Id);
                UpdateModel(row);
                dao.Update();

                result = "{success:true}";
            }
            catch { }

            return new ContentResult
            {
                Content = result
            };
        }
    }
}
