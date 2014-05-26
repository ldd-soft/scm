using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class SaleItemDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<SaleItem> FindByPage(Page<SaleItem> page, ref int count)
        {
            List<SaleItem> result = new List<SaleItem>();
            if (page.Params.Count > 0)
            {
                Expression<Func<SaleItem, bool>> searchPredicate = PredicateExtensions.True<SaleItem>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ItemName.Contains(query));
                            break;
                        case "sale_id":
                            int sale_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.SaleId == sale_id);
                            break;
                    }
                }
                result = db.SaleItem.Where(searchPredicate).ToList();
            }
            count = result.Count;
            if (page.Params.ContainsKey("sale_id"))
            {
                result = result.OrderBy(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            else
            {
                result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            return result;
        }

        public int Create(SaleItem saleItem)
        {
            db.SaleItem.InsertOnSubmit(saleItem);
            db.SubmitChanges();
            return saleItem.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            SaleItem saleItem = db.SaleItem.Where(u => u.Id == id).FirstOrDefault();
            db.SaleItem.DeleteOnSubmit(saleItem);
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

        public SaleItem FindById(int id)
        {
            return db.SaleItem.SingleOrDefault(c => c.Id == id);
        }

    }
}