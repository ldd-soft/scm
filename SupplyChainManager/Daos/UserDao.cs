using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SupplyChainManager.Models;
using System.Configuration;
using System.Linq.Expressions;

namespace SupplyChainManager.Daos
{
    public class UserDao
    {
        private SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public List<User> FindByPage(Page<User> page, ref int count)
        {
            List<User> result = new List<User>();
            if (page.Params.Count > 0)
            {
                Expression<Func<User, bool>> searchPredicate = PredicateExtensions.True<User>();
                foreach (var param in page.Params)
                {
                    switch (param.Key)
                    {
                        case "query":
                            string query = param.Value;
                            searchPredicate = searchPredicate.And(s => s.Login.Contains(query) || s.Name.Contains(query) || s.Position.Contains(query) || s.City.Contains(query) || s.Tel.Contains(query) || s.Fax.Contains(query) || s.Email.Contains(query));
                            break;
                    }
                }
                result = db.User.Where(searchPredicate).ToList();
            }
            else
            {
                result = db.User.ToList();
            }
            count = result.Count;
            result = result.OrderByDescending(o => o.Id).Skip(page.Start).Take(page.Limit).ToList();
            return result;
        }

        public int Create(User user)
        {
            db.User.InsertOnSubmit(user);
            db.SubmitChanges();
            return user.Id;
        }

        public bool Delete(int id)
        {
            bool result = false;
            User user = db.User.Where(u => u.Id == id).FirstOrDefault();
            db.User.DeleteOnSubmit(user);
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

        public User FindById(int id)
        {
            return db.User.SingleOrDefault(c => c.Id == id);
        }

        public User IsAllowed(string login, string password)
        {
            // 找当前登录用户
            string encrpt = Encrpt(password);
            return db.User.FirstOrDefault(u => u.Login.ToLower().Equals(login.ToLower()) && u.Password.ToLower().Equals(encrpt.ToLower()) && u.IsActive == true);

        }

        public static bool IsManager(User user)
        {
            List<string> others = new List<string>();
            if (ConfigurationManager.AppSettings["IsManager"] != null)
            {
                others = ConfigurationManager.AppSettings["IsManager"].Split(',').ToList();
            }
            return others.Contains(user.Login);

        }

        public static bool IsFinance(User user)
        {
            List<string> others = new List<string>();
            if (ConfigurationManager.AppSettings["IsFinance"] != null)
            {
                others = ConfigurationManager.AppSettings["IsFinance"].Split(',').ToList();
            }

            return others.Contains(user.Login);

        }

        /// <summary>
        /// 对指定文本进行加密，返回加密文本；
        /// </summary>
        /// <param name="origText"></param>
        /// <returns></returns>
        public string Encrpt(string origText)
        {
            return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(origText, "md5").ToUpper();
        }

        public bool IsExists(string loginName)
        {
            return db.User.Where(e => e.Login == loginName).Count() > 0;
        }
    }
}