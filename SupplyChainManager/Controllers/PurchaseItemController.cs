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
    public class PurchaseItemController : Controller
    {
        private PurchaseItemDao dao = new PurchaseItemDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<PurchaseItem> page = new Page<PurchaseItem>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 20 : int.Parse(formCollection["limit"]);
            if (!string.IsNullOrEmpty(Request["query"]))
            {
                page.Params.Add("query", formCollection["query"]);
            }
            if (!string.IsNullOrEmpty(Request["purchase_id"]))
            {
                page.Params.Add("purchase_id", formCollection["purchase_id"]);
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

        // ����        
        public ContentResult Create(PurchaseItem purchaseItem)
        {
            string result = "{success:false,Id:0}";
            int id = dao.Create(purchaseItem);
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

        // ����
        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult Edit(PurchaseItem purchaseItem)
        {
            string result = "{success:false,Id:1}";
            try
            {
                PurchaseItem row = dao.FindById(purchaseItem.Id);
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
