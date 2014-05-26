using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class ExitItemDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<ExitItem> FindByPage(Page<ExitItem> page, ref int count)
        {
            List<ExitItem> result = new List<ExitItem>();
            if (page.Params.Count > 0)
            {
                Expression<Func<ExitItem, bool>> searchPredicate = PredicateExtensions.True<ExitItem>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ItemName.Contains(query));
                            break;
                        case "exit_id":
                            int exit_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.ExitId == exit_id);
                            break;
                    }
                }
                result = db.ExitItem.Where(searchPredicate).ToList();
            }
            count = result.Count;
            if (page.Params.ContainsKey("exit_id"))
            {
                result = result.OrderBy(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            else
            {
                result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            return result;
        }

        public int Create(ExitItem exitItem)
        {
            db.ExitItem.InsertOnSubmit(exitItem);
            db.SubmitChanges();
            return exitItem.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            ExitItem exitItem = db.ExitItem.Where(u => u.Id == id).FirstOrDefault();
            db.ExitItem.DeleteOnSubmit(exitItem);
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

        public ExitItem FindById(int id)
        {
            return db.ExitItem.SingleOrDefault(c => c.Id == id);
        }

    }
}