using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Security.Principal;
using System.Configuration;
using System.Web.Security;

namespace SupplyChainManager.Models
{
    /// <summary>
    /// 自定义用户认证特性
    /// </summary>
    public class UserAuthorizeAttribute : AuthorizeAttribute
    {
        private static SupplyChainManagerDataContext db = new SupplyChainManagerDataContext();

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.Session == null)
            {
                HttpCookie authCookie = filterContext.HttpContext.Request.Cookies[FormsAuthentication.FormsCookieName];
                if (authCookie != null)
                {
                    FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                    if (!authTicket.Expired)
                    {
                        //Session is null, redirect to login page
                        FormsAuthentication.SignOut();
                        filterContext.HttpContext.Response.Redirect(FormsAuthentication.LoginUrl, true);
                    }
                }

            }

            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }
            IPrincipal login = filterContext.HttpContext.User;
            string controller = filterContext.RouteData.Values["controller"].ToString();
            string action = filterContext.RouteData.Values["action"].ToString();
            if (filterContext.HttpContext.Session["user"] == null)
            {
                filterContext.Result = new RedirectResult("/Account/Login");
            }

        }

    }
}