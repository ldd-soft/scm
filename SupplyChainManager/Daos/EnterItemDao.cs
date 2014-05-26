using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class EnterItemDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<EnterItem> FindByPage(Page<EnterItem> page, ref int count)
        {
            List<EnterItem> result = new List<EnterItem>();
            if (page.Params.Count > 0)
            {
                Expression<Func<EnterItem, bool>> searchPredicate = PredicateExtensions.True<EnterItem>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ItemName.Contains(query));
                            break;
                        case "enter_id":
                            int enter_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.EnterId == enter_id);
                            break;
                    }
                }
                result = db.EnterItem.Where(searchPredicate).ToList();
            }
            count = result.Count;
            if (page.Params.ContainsKey("enter_id"))
            {
                result = result.OrderBy(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            else
            {
                result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            }
            return result;
        }

        public int Create(EnterItem enterItem)
        {
            db.EnterItem.InsertOnSubmit(enterItem);
            db.SubmitChanges();
            return enterItem.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            EnterItem enterItem = db.EnterItem.Where(u => u.Id == id).FirstOrDefault();
            db.EnterItem.DeleteOnSubmit(enterItem);
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

        public EnterItem FindById(int id)
        {
            return db.EnterItem.SingleOrDefault(c => c.Id == id);
        }

    }
}