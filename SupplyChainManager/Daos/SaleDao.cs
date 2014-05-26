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
    public class SaleDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Sale> FindByPage(Page<Sale> page, ref int count)
        {
            List<Sale> result = new List<Sale>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Sale, bool>> searchPredicate = PredicateExtensions.True<Sale>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ClientName.Contains(query) || s.Status.Contains(query));
                            break;
                    }
                }
                result = db.Sale.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Sale.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Sale sale)
        {
            db.Sale.InsertOnSubmit(sale);
            db.SubmitChanges();
            return sale.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Sale sale = db.Sale.Where(u => u.Id == id).FirstOrDefault();
            db.Sale.DeleteOnSubmit(sale);
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

        public Sale FindById(int id)
        {
            return db.Sale.SingleOrDefault(c => c.Id == id);
        }

        internal void DeleteItems(EntitySet<SaleItem> items)
        {
            db.SaleItem.DeleteAllOnSubmit(items);
        }
    }
}