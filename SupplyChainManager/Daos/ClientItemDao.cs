using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class ClientItemDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<ClientItem> FindByPage(Page<ClientItem> page, ref int count)
        {
            List<ClientItem> result = new List<ClientItem>();
            if (page.Params.Count > 0)
            {
                Expression<Func<ClientItem, bool>> searchPredicate = PredicateExtensions.True<ClientItem>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ClientName.Contains(query) || s.SupplyName.Contains(query) || s.CreatedName.Contains(query));
                            break;
                    }
                }
                result = db.ClientItem.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.ClientItem.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(ClientItem item)
        {
            db.ClientItem.InsertOnSubmit(item);
            db.SubmitChanges();
            return item.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            ClientItem item = db.ClientItem.Where(u => u.Id == id).FirstOrDefault();
            db.ClientItem.DeleteOnSubmit(item);
            try
            {
                db.SubmitChanges();
                result = true;
            }
            catch (Exception ex) { }
            return result;
        }

        public bool Update()
        {
            bool result = false;
            try
            {
                db.SubmitChanges();
                result = true;
            }
            catch (Exception ex) { }
            return result;
        }

        public ClientItem FindById(int id)
        {
            return db.ClientItem.SingleOrDefault(c => c.Id == id);
        }

    }
}