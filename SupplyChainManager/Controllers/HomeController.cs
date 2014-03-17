using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SupplyChainManager.Models;
using SupplyChainManager.Daos;

namespace SupplyChainManager.Controllers
{
    [HandleError]
    [UserAuthorize]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetMainMenus()
        {
            ModuleDao moduleDao = new ModuleDao();
            List<Module> modules = moduleDao.FindByParent("root");
            List<Module> results = new List<Module>();
            foreach (var item in modules)
            {
                results.Add(item);
            }
            return new ServiceStackJsonResult()
            {
                Data = results,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetSubMenus()
        {
            string parentId = Request["Id"];

            List<MenuItem> result = new List<MenuItem>();
            ModuleDao moduleDao = new ModuleDao();
            List<Module> modules = moduleDao.FindByParent(parentId);

            foreach (var item in modules)
            {
                MenuItem menu = new MenuItem();
                menu.text = "<div style=\"width:95px;\">" + item.Title + "</div>";
                menu.handler = "function() { loadModule('" + item.Name + "', '" + item.Title + "', '" + item.Url + "');}";
                result.Add(menu);

            }
            return new ServiceStackJsonResult
            {
                Data = result.ToArray(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }

    public class MenuItem
    {
        public string text { get; set; }
        public string iconCls { get; set; }
        public string handler { get; set; }
        public string menu { get; set; }
    }
}
