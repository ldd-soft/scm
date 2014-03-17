using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;

namespace SupplyChainManager.Daos
{
    public class ModuleDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Module> FindByParent(string parentId)
        {
            return db.Module.Where(m => m.ParentId == parentId && m.IsActive == true).ToList();
        }

        public bool HasChild(string parentId)
        {
            var list = db.Module.Where(a => a.ParentId == parentId);
            if (list != null && list.Count() > 0)
            {
                return true;
            }
            return false;
        }

        public Module FindByName(string moduleName)
        {
            return db.Module.Where(m => m.Name == moduleName).FirstOrDefault();
        }

    }
}
