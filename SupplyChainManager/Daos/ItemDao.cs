using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class ItemDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Item> FindByPage(Page<Item> page, ref int count)
        {
            List<Item> result = new List<Item>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Item, bool>> searchPredicate = PredicateExtensions.True<Item>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ItemName.Contains(query) || s.ItemCode.Contains(query) || s.BarCode.Contains(query));
                            break;
                    }
                }
                result = db.Item.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Item.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Item item)
        {
            db.Item.InsertOnSubmit(item);
            db.SubmitChanges();
            return item.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Item item = db.Item.Where(u => u.Id == id).FirstOrDefault();
            db.Item.DeleteOnSubmit(item);
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

        public Item FindById(int id)
        {
            return db.Item.SingleOrDefault(c => c.Id == id);
        }

    }
}