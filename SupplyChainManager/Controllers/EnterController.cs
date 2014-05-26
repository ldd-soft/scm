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
using Omu.ValueInjecter;

namespace SupplyChainManager.Controllers
{

    [UserAuthorize]
    public class EnterController : Controller
    {
        private EnterDao dao = new EnterDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<Enter> page = new Page<Enter>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 50 : int.Parse(formCollection["limit"]);
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
        public ContentResult Create(Enter enter, List<EnterItem> items)
        {
            string result = "{success:false,Id:0}";
            User user = (User)Session["user"];
            enter.EnterItem.AddRange(items);
            enter.AddId = user.Id;
            enter.AddName = user.Name;
            enter.DateAdded = DateTime.Now;
            int id = dao.Create(enter);
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
        public ContentResult Edit(Enter enter, List<EnterItem> items)
        {
            string result = "{success:false,Id:1}";
            try
            {
                enter.EnterItem.AddRange(items);
                Enter row = dao.FindById(enter.Id);
                dao.DeleteItems(row.EnterItem);
                row.InjectFrom(enter);

                dao.Update();

                result = "{success:true}";
            }
            catch { }

            return new ContentResult
            {
                Content = result
            };
        }

        public JsonNetResult ListEnterItem(FormCollection formCollection)
        {
            Page<PurchaseItemView> page = new Page<PurchaseItemView>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 100 : int.Parse(formCollection["limit"]);
            if (!string.IsNullOrEmpty(Request["query"]))
            {
                page.Params.Add("query", formCollection["query"]);
            }
            if (!string.IsNullOrEmpty(Request["brand"]))
            {
                page.Params.Add("brand", formCollection["brand"]);
            }

            int count = 0;
            var result = dao.ListEnterItem(page, ref count);
            page.Root = result;
            page.TotalProperty = count;

            JsonNetResult jsonNetResult = new JsonNetResult();
            jsonNetResult.Formatting = Formatting.Indented;
            jsonNetResult.SerializerSettings.Converters.Add(new JavaScriptDateTimeConverter());
            jsonNetResult.Data = page;

            return jsonNetResult;
        }
    }
}
