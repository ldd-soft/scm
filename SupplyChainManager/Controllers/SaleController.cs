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
    public class SaleController : Controller
    {
        private SaleDao dao = new SaleDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<Sale> page = new Page<Sale>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 50 : int.Parse(formCollection["limit"]);
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

        // 添加        
        public ContentResult Create(Sale sale, List<SaleItem> items)
        {
            string result = "{success:false,Id:0}";
            User user = (User)Session["user"];
            sale.SaleItem.AddRange(items);
            sale.AddId = user.Id;
            sale.AddName = user.Name;
            sale.DateAdded = DateTime.Now;
            sale.Status = "待出库";
            int id = dao.Create(sale);
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

        // 更改
        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult Edit(Sale sale, List<SaleItem> items)
        {
            string result = "{success:false,Id:1}";
            try
            {
                sale.SaleItem.AddRange(items);
                Sale row = dao.FindById(sale.Id);
                dao.DeleteItems(row.SaleItem);
                row.InjectFrom(sale);

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
