using System;
using System.Collections.Generic;
using System.Web.Mvc;
using SupplyChainManager.Daos;
using SupplyChainManager.Models;
using System.Linq;
using System.Collections;

namespace SupplyChainManager.Controllers
{

    [UserAuthorize]
    public class DictionaryController : Controller
    {
        private DictionaryDao dao = new DictionaryDao();
        
        public JsonResult List(FormCollection formCollection)
        {
            Page<Options> page = new Page<Options>();
            page.Params = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(formCollection["module"]))
            {
                page.Params.Add("module", formCollection["module"]);
            }
            if (!string.IsNullOrEmpty(formCollection["field"]))
            {
                page.Params.Add("field", formCollection["field"]);
            }

            int count = 0;
            var result = dao.List(page, ref count);

            page.Root = result;
            page.TotalProperty = count;
            page.success = true;
            return new ServiceStackJsonResult
            {
                Data = page
            };
        }

        public JsonResult Category(FormCollection formCollection)
        {
            Page<Dictionary> page = new Page<Dictionary>();
            page.Params = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(formCollection["module"]))
            {
                page.Params.Add("module", formCollection["module"]);
            }
            if (!string.IsNullOrEmpty(formCollection["field"]))
            {
                page.Params.Add("field", formCollection["field"]);
            }

            if (!string.IsNullOrEmpty(formCollection["query"]))
            {
                page.Params.Add("query", formCollection["query"]);
            }

            int count = 0;
            var result = dao.Category(page, ref count);

            page.Root = result;
            page.TotalProperty = count;
            return new ServiceStackJsonResult
            {
                Data = page
            };
        }

        public JsonResult GetData()
        {
            string module = !string.IsNullOrEmpty(Request["module"]) ? Request["module"] : "";
            string field = !string.IsNullOrEmpty(Request["field"]) ? Request["field"] : "";           
            List<Checks> result = dao.GetData(module, field);
            
            return new ServiceStackJsonResult
            {
                Data = result
            };
        }

    }

}
