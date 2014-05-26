using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class SupplyDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Supply> FindByPage(Page<Supply> page, ref int count)
        {
            List<Supply> result = new List<Supply>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Supply, bool>> searchPredicate = PredicateExtensions.True<Supply>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.SupplyName.Contains(query) || s.Tel.Contains(query) || s.Contact.Contains(query));
                            break;
                        case "brand":
                            string brand = param.Value;
                            searchPredicate = searchPredicate.And(s => s.Brand.Contains(brand));
                            break;
                    }
                }
                result = db.Supply.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Supply.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Supply supply)
        {
            db.Supply.InsertOnSubmit(supply);
            db.SubmitChanges();
            return supply.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Supply supply = db.Supply.Where(u => u.Id == id).FirstOrDefault();
            db.Supply.DeleteOnSubmit(supply);
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
            db.SubmitChanges();
            result = true;
            return result;
        }

        public Supply FindById(int id)
        {
            return db.Supply.SingleOrDefault(c => c.Id == id);
        }

    }
}