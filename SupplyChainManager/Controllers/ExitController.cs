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
    public class ExitController : Controller
    {
        private ExitDao dao = new ExitDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<Exit> page = new Page<Exit>();
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
        //
        // Ìí¼Ó        
        public ContentResult Create(Exit exit, List<ExitItem> items)
        {
            string result = "{success:false,Id:0}";
            User user = (User)Session["user"];
            exit.ExitItem.AddRange(items);
            exit.AddId = user.Id;
            exit.AddName = user.Name;
            exit.DateAdded = DateTime.Now;
            int id = dao.Create(exit);
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
        public ContentResult Edit(Exit exit, List<ExitItem> items)
        {
            string result = "{success:false,Id:1}";
            try
            {
                exit.ExitItem.AddRange(items);
                Exit row = dao.FindById(exit.Id);
                dao.DeleteItems(row.ExitItem);
                row.InjectFrom(exit);

                dao.Update();

                result = "{success:true}";
            }
            catch { }

            return new ContentResult
            {
                Content = result
            };
        }

        public JsonNetResult ListExitItem(FormCollection formCollection)
        {
            Page<SaleItemView> page = new Page<SaleItemView>();
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
            if (!string.IsNullOrEmpty(Request["client_id"]))
            {
                page.Params.Add("client_id", formCollection["client_id"]);
            }

            if (!string.IsNullOrEmpty(Request["store_id"]))
            {
                page.Params.Add("store_id", formCollection["store_id"]);
            }
            int count = 0;
            var result = dao.ListExitItem(page, ref count);
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
