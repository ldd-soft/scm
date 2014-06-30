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
    public class ItemController : Controller
    {
        private ItemDao dao = new ItemDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<Item> page = new Page<Item>();
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
        public ContentResult Create(Item item)
        {
            string result = "{success:false,Id:0}";
            User user = (User)Session["user"];
            item.CreatedId = user.Id;
            item.CreatedName = user.Name;
            item.DateCreated = DateTime.Now;

            int id = dao.Create(item);
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
        public ContentResult Edit(Item item)
        {
            string result = "{success:false,Id:1}";
            try
            {
                Item row = dao.FindById(item.Id);
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

        public JsonNetResult ListByStock(FormCollection formCollection)
        {
            Page<ItemStockView> page = new Page<ItemStockView>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 100 : int.Parse(formCollection["limit"]);
            if (!string.IsNullOrEmpty(Request["query"]))
            {
                page.Params.Add("query", formCollection["query"]);
            }
            if (!string.IsNullOrEmpty(Request["type"]))
            {
                page.Params.Add("type", Request["type"]);
            }
            if (!string.IsNullOrEmpty(Request["date_from"]))
            {
                page.Params.Add("date_from", Request["date_from"]);
            }
            if (!string.IsNullOrEmpty(Request["date_to"]))
            {
                page.Params.Add("date_to", Request["date_to"]);
            }

            if (!string.IsNullOrEmpty(Request["brand"]))
            {
                page.Params.Add("brand", formCollection["brand"]);
            }
            if (!string.IsNullOrEmpty(Request["only_count"]))
            {
                page.Params.Add("only_count", Request["only_count"]);
            }

            int count = 0;
            var result = dao.ListByStock(page, ref count);
            page.Root = result;
            page.TotalProperty = count;

            JsonNetResult jsonNetResult = new JsonNetResult();
            jsonNetResult.Formatting = Formatting.Indented;
            jsonNetResult.SerializerSettings.Converters.Add(new JavaScriptDateTimeConverter());
            jsonNetResult.Data = page;

            return jsonNetResult;
        }

        public JsonNetResult ListByBatchStock(FormCollection formCollection)
        {
            Page<ItemBatchStockView> page = new Page<ItemBatchStockView>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 100 : int.Parse(formCollection["limit"]);
            if (!string.IsNullOrEmpty(Request["query"]))
            {
                page.Params.Add("query", formCollection["query"]);
            }
            if (!string.IsNullOrEmpty(Request["type"]))
            {
                page.Params.Add("type", Request["type"]);
            }
            if (!string.IsNullOrEmpty(Request["date_from"]))
            {
                page.Params.Add("date_from", Request["date_from"]);
            }
            if (!string.IsNullOrEmpty(Request["date_to"]))
            {
                page.Params.Add("date_to", Request["date_to"]);
            }

            if (!string.IsNullOrEmpty(Request["brand"]))
            {
                page.Params.Add("brand", formCollection["brand"]);
            }
            if (!string.IsNullOrEmpty(Request["store_id"]))
            {
                page.Params.Add("store_id", formCollection["store_id"]);
            }
            if (!string.IsNullOrEmpty(Request["item_id"]))
            {
                page.Params.Add("item_id", formCollection["item_id"]);
            }

            if (!string.IsNullOrEmpty(Request["only_count"]))
            {
                page.Params.Add("only_count", Request["only_count"]);
            }

            int count = 0;
            var result = dao.ListByBatchStock(page, ref count);
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
