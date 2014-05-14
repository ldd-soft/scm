using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class OrderDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Orders> FindByPage(Page<Orders> page, ref int count)
        {
            List<Orders> result = new List<Orders>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Orders, bool>> searchPredicate = PredicateExtensions.True<Orders>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            //searchPredicate = searchPredicate.And(s => s.OrdersName.Contains(query) || s.Tel.Contains(query) || s.Contact.Contains(query));
                            break;
                    }
                }
                result = db.Orders.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Orders.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Orders orders)
        {
            db.Orders.InsertOnSubmit(orders);
            db.SubmitChanges();
            return orders.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Orders orders = db.Orders.Where(u => u.Id == id).FirstOrDefault();
            db.Orders.DeleteOnSubmit(orders);
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
            db.SubmitChanges();
            result = true;
            return result;
        }

        public Orders FindById(int id)
        {
            return db.Orders.SingleOrDefault(c => c.Id == id);
        }

    }
}