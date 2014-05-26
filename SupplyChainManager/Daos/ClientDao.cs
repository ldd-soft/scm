using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class ClientDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<Client> FindByPage(Page<Client> page, ref int count)
        {
            List<Client> result = new List<Client>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Client, bool>> searchPredicate = PredicateExtensions.True<Client>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.ClientName.Contains(query) || s.Tel.Contains(query) || s.Contact.Contains(query));
                            break;
                        case "code":
                            string code = param.Value;
                            searchPredicate = searchPredicate.And(s => s.Code.Contains(code));
                            break;
                    }
                }
                result = db.Client.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.Client.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(Client client)
        {
            db.Client.InsertOnSubmit(client);
            db.SubmitChanges();
            return client.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            Client client = db.Client.Where(u => u.Id == id).FirstOrDefault();
            db.Client.DeleteOnSubmit(client);
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

        public Client FindById(int id)
        {
            return db.Client.SingleOrDefault(c => c.Id == id);
        }


        public List<ClientStore> ListStore(Page<ClientStore> page, ref int count)
        {
            List<ClientStore> result = new List<ClientStore>();
            if (page.Params.Count > 0)
            {
                Expression<Func<ClientStore, bool>> searchPredicate = PredicateExtensions.True<ClientStore>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "client_id":
                            int client_id = int.Parse(param.Value);
                            searchPredicate = searchPredicate.And(s => s.ClientId == client_id);
                            break;
                    }
                }
                result = db.ClientStore.Where(searchPredicate).ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public List<Company> FindCompanyByPage(Page<Company> page, ref int count)
        {
            List<Company> result = new List<Company>();
            if (page.Params.Count > 0)
            {
                if (page.Params.ContainsKey("type"))
                {
                    string type = page.Params["type"];
                    if (type == "client")
                    {
                        Expression<Func<Client, bool>> searchPredicate = PredicateExtensions.True<Client>();
                        foreach (var param in page.Params)
                        {
                            switch (param.Key)
                            {
                                case "code":
                                    string code = param.Value;
                                    searchPredicate = searchPredicate.And(s => s.Code.Contains(code));
                                    break;
                            }
                        }
                        result = db.Client.Where(searchPredicate).Select(c => new Company() { Id = c.Id, Name = c.ClientName}).ToList();

                    }
                    if (type == "supply")
                    {
                        Expression<Func<Supply, bool>> searchPredicate = PredicateExtensions.True<Supply>();
                        foreach (var param in page.Params)
                        {
                            switch (param.Key)
                            {
                                case "code":
                                    string code = param.Value;
                                    searchPredicate = searchPredicate.And(s => s.Code.Contains(code));
                                    break;
                            }
                        }
                        result = db.Supply.Where(searchPredicate).Select(c => new Company() { Id = c.Id, Name = c.SupplyName }).ToList();

                    }
                }

            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

    }

    
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}