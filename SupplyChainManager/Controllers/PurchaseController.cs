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
    public class PurchaseController : Controller
    {
        private PurchaseDao dao = new PurchaseDao();

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<Purchase> page = new Page<Purchase>();
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

        // Ìí¼Ó        
        public ContentResult Create(Purchase purchase, List<PurchaseItem> items)
        {
            string result = "{success:false,Id:0}";
            User user = (User)Session["user"];
            purchase.PurchaseItem.AddRange(items);
            purchase.AddId = user.Id;
            purchase.AddName = user.Name;
            purchase.DateAdded = DateTime.Now;
            purchase.Status = "´ýÉóºË";
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
        public ContentResult Edit(Purchase purchase, List<PurchaseItem> items)
        {
            string result = "{success:false,Id:1}";
            try
            {
                purchase.PurchaseItem.AddRange(items);
                Purchase row = dao.FindById(purchase.Id);
                dao.DeleteItems(row.PurchaseItem);
                row.InjectFrom(purchase);

                dao.Update();

                result = "{success:true}";
            }
            catch { }

            return new ContentResult
            {
                Content = result
            };
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult Pass()
        {
            string result = "{success:false}";
            string message = "";
            try
            {
                int id = int.Parse(Request["id"]);
                Purchase row = dao.FindById(id);
                User user = (User)Session["user"];
                if (user.IsManager)
                {
                    row.ApproveId = user.Id;
                    row.ApproveName = user.Name;
                    row.DateApproved = DateTime.Now;
                    row.Status = "´ýÈë¿â";
                }
                if (user.IsFinance)
                {
                    row.CheckId = user.Id;
                    row.CheckName = user.Name;
                    row.DateChecked = DateTime.Now;
                    row.Status = "´ýÅú×¼";
                }
                UpdateModel(row);
                dao.Update();

                result = "{success:true, msg: '" + message + "'}";
            }
            catch (Exception ex)
            {
                result = "{success:false, msg:'" + ex.Message + "'}";
            }
            return new ContentResult
            {
                Content = result
            };
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult Reject()
        {
            string result = "{success:false}";
            try
            {
                int id = int.Parse(Request["id"]);
                string comments = Request["reject_comments"];
                Purchase row = dao.FindById(id);
                User user = (User)Session["user"];
                UserDao userDao = new UserDao();
                if (user.IsManager)
                {
                        row.Status = "´ýÉóºË";
                }
                UpdateModel(row);
                dao.Update();

                result = "{success:true}";
            }
            catch (Exception ex)
            {
                result = "{success:false, msg:'" + ex.Message + "'}";
            }
            return new ContentResult
            {
                Content = result
            };
        }
    }
}
