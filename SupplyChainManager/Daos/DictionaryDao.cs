using System;
using System.Linq;
using System.Collections.Generic;
using System.Linq.Expressions;
using SupplyChainManager.Models;
using System.Data.Linq.SqlClient;

namespace SupplyChainManager.Daos
{
    public class DictionaryDao
    {

        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();
        
        public List<Options> List(Page<Options> page, ref int count)
        {
            List<Options> result = new List<Options>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Dictionary, bool>> searchPredicate = PredicateExtensions.True<Dictionary>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "module":
                            string str = param.Value;
                            searchPredicate = searchPredicate.And(d => d.Module.ToLower().Contains(str.ToLower()));
                            break;
                        case "field":
                            string str1 = param.Value;
                            searchPredicate = searchPredicate.And(d => d.Field.ToLower().Contains(str1.ToLower()));
                            break;
                        default:
                            break;
                    }
                }
                result = db.Dictionary.Where(searchPredicate).Select(d => new Options() { Id = d.ParentId.Value,  Key = d.Options, Value = d.Options}).ToList();
            }

            count = result.Count;
            return result;
        }

        public List<Dictionary> Category(Page<Dictionary> page, ref int count)
        {
            List<Dictionary> result = new List<Dictionary>();
            if (page.Params.Count > 0)
            {
                Expression<Func<Dictionary, bool>> searchPredicate = PredicateExtensions.True<Dictionary>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "module":
                            string str = param.Value;
                            searchPredicate = searchPredicate.And(d => d.Module.ToLower().Contains(str.ToLower()));
                            break;
                        case "field":
                            string str1 = param.Value;
                            searchPredicate = searchPredicate.And(d => d.Field.ToLower().Contains(str1.ToLower()));
                            break;
                        case "query":
                            string str2 = param.Value;
                            searchPredicate = searchPredicate.And(d => d.Field.Contains(str2) ||  d.Options.Contains(str2));
                            break;
                        default:
                            break;
                    }
                }
                result = db.Dictionary.Where(searchPredicate).ToList();
            }

            count = result.Count;
            return result;
        }

        public List<Checks> GetData(string module, string field)
        {
            List<Checks> result = new List<Checks>();
            Dictionary dic = null;
            if (module != "" && field != "")
            {                
                dic = db.Dictionary.Where(d => d.Module.ToLower().Contains(module) && d.Field.ToLower().Contains(field)).FirstOrDefault();
            }
            
            if (dic != null)
            {
                string[] options = dic.Options.Split('/');
                for (int i = 0; i < options.Count(); i++)
                {
                    result.Add(new Checks() { id = i + 1, name = options[i]});
                }
            }
            return result;
        }

        public string FindOptionsByField(string module, string field)
        {
            var dictionary = db.Dictionary.Where(d => d.Module == module && d.Field == field).FirstOrDefault();
            if (dictionary != null)
            {
                return dictionary.Options;
            }
            else
            {
                return "";
            }
        }

        public Dictionary FindByField(string module, string field)
        {
            Dictionary result = null;
            var dovas = db.Dictionary.Where(d => d.Module == module);
            foreach (var item in dovas)
            {
                if (field.Contains(item.Field))
                {
                    result = item;
                }
            }
            return result;
        }
    }

    public class Options
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class Checks
    {
        public int id { get; set; }
        public string name { get; set; }
    }
}
