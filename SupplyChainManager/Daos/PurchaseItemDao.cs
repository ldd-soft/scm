using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class PurchaseItemDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<PurchaseItem> FindByPage(Page<PurchaseItem> page, ref int count)
        {
            List<PurchaseItem> result = new List<PurchaseItem>();
            if (page.Params.Count > 0)
            {
                Expression<Func<PurchaseItem, bool>> searchPredicate = PredicateExtensions.True<PurchaseItem>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(i => i.ItemId.ToString().Contains(query) || i.ItemName.Contains(query) || i.MissProcess.Contains(query) || i.Remark.Contains(query));
                            break;
                        case "purchase_id":
                            int purchase_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.PurchaseId == purchase_id);
                            break;
                    }
                }
                result = db.PurchaseItem.Where(searchPredicate).ToList();
            }
            count = result.Count;
            if (page.Params.ContainsKey("purchase_id"))
            {
                result = result.OrderBy(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            else
            {
                result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            return result;
        }

        public int Create(PurchaseItem purchaseItem)
        {
            db.PurchaseItem.InsertOnSubmit(purchaseItem);
            db.SubmitChanges();
            return purchaseItem.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            PurchaseItem purchaseItem = db.PurchaseItem.Where(u => u.Id == id).FirstOrDefault();
            db.PurchaseItem.DeleteOnSubmit(purchaseItem);
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

        public PurchaseItem FindById(int id)
        {
            return db.PurchaseItem.SingleOrDefault(c => c.Id == id);
        }

    }
}