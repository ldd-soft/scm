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
    public class ExitDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Exit> FindByPage(Page<Exit> page, ref int count)
        {
            List<Exit> result = new List<Exit>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Exit, bool>> searchPredicate = PredicateExtensions.True<Exit>();
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
                result = db.Exit.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Exit.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Exit exit)
        {
            db.Exit.InsertOnSubmit(exit);
            db.SubmitChanges();
            return exit.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Exit exit = db.Exit.Where(u => u.Id == id).FirstOrDefault();
            db.Exit.DeleteOnSubmit(exit);
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

        public Exit FindById(int id)
        {
            return db.Exit.SingleOrDefault(c => c.Id == id);
        }

        internal void DeleteItems(EntitySet<ExitItem> items)
        {
            db.ExitItem.DeleteAllOnSubmit(items);
        }

        public List<SaleItemView> ListExitItem(Page<SaleItemView> page, ref int count)
        {
            List<SaleItemView> result = new List<SaleItemView>();
            if (page.Params.Count > 0)
            {
                Expression<Func<SaleItemView, bool>> searchPredicate = PredicateExtensions.True<SaleItemView>();
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
                result = db.SaleItemView.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.SaleItemView.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }
    }
}