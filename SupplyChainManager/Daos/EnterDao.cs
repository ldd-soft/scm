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
    public class EnterDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Enter> FindByPage(Page<Enter> page, ref int count)
        {
            List<Enter> result = new List<Enter>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Enter, bool>> searchPredicate = PredicateExtensions.True<Enter>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.RecordName.Contains(query) || s.DeliverName.Contains(query));
                            break;
                    }
                }
                result = db.Enter.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Enter.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Enter enter)
        {
            db.Enter.InsertOnSubmit(enter);
            db.SubmitChanges();
            return enter.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Enter enter = db.Enter.Where(u => u.Id == id).FirstOrDefault();
            db.Enter.DeleteOnSubmit(enter);
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

        public Enter FindById(int id)
        {
            return db.Enter.SingleOrDefault(c => c.Id == id);
        }

        internal void DeleteItems(EntitySet<EnterItem> items)
        {
            db.EnterItem.DeleteAllOnSubmit(items);
        }

        public List<PurchaseItemView> ListEnterItem(Page<PurchaseItemView> page, ref int count)
        {
            List<PurchaseItemView> result = new List<PurchaseItemView>();
            if (page.Params.Count > 0)
            {
                Expression<Func<PurchaseItemView, bool>> searchPredicate = PredicateExtensions.True<PurchaseItemView>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ItemName.Contains(query) || s.Code.Contains(query) || s.Barcode.Contains(query));
                            break;
                        case "brand":
                            string brand = param.Value;
                            searchPredicate = searchPredicate.And(s => s.Brand == brand);
                            break;
                    }
                }
                result = db.PurchaseItemView.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.PurchaseItemView.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }
    }
}