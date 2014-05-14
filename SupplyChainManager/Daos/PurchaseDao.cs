using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class PurchaseDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Purchase> FindByPage(Page<Purchase> page, ref int count)
        {
            List<Purchase> result = new List<Purchase>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Purchase, bool>> searchPredicate = PredicateExtensions.True<Purchase>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "order_id":
                            int order_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.OrderId == order_id);
                            break;
                    }
                }
                result = db.Purchase.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Purchase.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Purchase purchase)
        {
            db.Purchase.InsertOnSubmit(purchase);
            db.SubmitChanges();
            return purchase.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Purchase purchase = db.Purchase.Where(u => u.Id == id).FirstOrDefault();
            db.Purchase.DeleteOnSubmit(purchase);
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

        public Purchase FindById(int id)
        {
            return db.Purchase.SingleOrDefault(c => c.Id == id);
        }

    }
}