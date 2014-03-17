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
    public class UserController : Controller
    {
        private UserDao dao = new UserDao();

        private const string DEFAULT_PASSWORD = "25D55AD283AA400AF464C76D713C07AD";

        public JsonNetResult Index(FormCollection formCollection)
        {
            Page<User> page = new Page<User>();
            page.Params = new Dictionary<string, string>();
            page.Start = formCollection["start"] == null ? 0 : int.Parse(formCollection["start"]);
            page.Limit = formCollection["limit"] == null ? 50 : int.Parse(formCollection["limit"]);
            if (!string.IsNullOrEmpty(Request["query"]))
            {
                page.Params.Add("query", formCollection["query"]);
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
        public ContentResult Create(User user)
        {
            string result = "{success:false,Id:0}";
            if (dao.IsExists(user.Login))
            {
                result = "{success:false, msg:'µÇÂ¼ÕËºÅÒÑ´æÔÚ£¡'}";
                return new ContentResult
                {
                    Content = result
                };
            }

            //Ô¤ÖÃÃÜÂë£»
            user.Password = DEFAULT_PASSWORD;
            user.Birthday = DateTime.Now;
            user.IsActive = true;
            int id = dao.Create(user);
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
        public ContentResult Edit(User user)
        {
            string result = "{success:false,Id:1}";
            try
            {
                user.Birthday = DateTime.Now;

                User row = dao.FindById(user.Id);
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

        [AcceptVerbs(HttpVerbs.Post)]
        public ContentResult ChangeActive()
        {
            string result = "{success:false}";
            try
            {
                int id = int.Parse(Request["id"]);
                User row = dao.FindById(id);
                row.IsActive = !row.IsActive;
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
