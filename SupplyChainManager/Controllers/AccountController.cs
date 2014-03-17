using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using SupplyChainManager.Models;
using System.Security.Principal;
using SupplyChainManager.Daos;

namespace SupplyChainManager.Controllers
{
    public class AccountController : Controller
    {

        public ActionResult Login()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Login(string form_login, string form_password)
        {
            UserDao userDao = new UserDao();
            User user = userDao.IsAllowed(form_login, form_password);
            if (user != null)
            {
                FormsAuthentication.SetAuthCookie(form_login, false);
                GenericIdentity id = new GenericIdentity(form_login, "FormAuthentication");
                GenericPrincipal principal = new GenericPrincipal(id, new string[0]);
                HttpContext.User = principal;
                Session["user"] = user;
                return Redirect("~/Home/Index");
            }
            else
            {
                return RedirectToAction("Login");
            }
        }

        public void Logout()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();

            // clear authentication cookie
            HttpCookie cookie1 = new HttpCookie(FormsAuthentication.FormsCookieName, "");
            cookie1.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(cookie1);

            // clear session cookie (not necessary for your current problem but i would recommend you do it anyway)
            HttpCookie cookie2 = new HttpCookie("ASP.NET_SessionId", "");
            cookie2.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(cookie2);

            FormsAuthentication.RedirectToLoginPage();
        }

    }
}
