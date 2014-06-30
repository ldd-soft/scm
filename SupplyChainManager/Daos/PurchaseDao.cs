using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;
using System.Data.Linq;

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
                string type = page.Params.ContainsKey("type") ? page.Params["type"] : "";
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            if (type == "明细")
                            {
                                List<int?> ids = db.PurchaseItem.Where(i => i.ItemId.ToString().Contains(query) || i.ItemNo.Contains(query) || i.ItemName.Contains(query) || i.MissProcess.Contains(query) || i.Remark.Contains(query)).Select(i => i.PurchaseId).ToList();
                                searchPredicate = searchPredicate.And(s => ids.Contains(s.Id));
                            }
                            else
                            {
                                searchPredicate = searchPredicate.And(s => s.Id.ToString().Contains(query) || s.SupplyName.Contains(query) || s.Status.Contains(query) || s.AddName.Contains(query) || s.CheckName.Contains(query) || s.ApproveName.Contains(query) || s.Remark.Contains(query));
                            }

                            break;
                        case "date_from":
                            DateTime date_from = DateTime.Parse(param.Value);
                            searchPredicate = searchPredicate.And(p => p.DateAdded.HasValue && p.DateAdded.Value >= date_from);
                            break;
                        case "date_to":
                            DateTime date_to = DateTime.Parse(param.Value);
                            searchPredicate = searchPredicate.And(p => p.DateAdded.HasValue && p.DateAdded.Value <= date_to);
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

        internal void DeleteItems(EntitySet<PurchaseItem> items)
        {
            db.PurchaseItem.DeleteAllOnSubmit(items);
        }
    }
}