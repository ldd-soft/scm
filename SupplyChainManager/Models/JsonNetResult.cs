using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.Web.Mvc;
using System.Text;

namespace SupplyChainManager.Models
{
    public class JsonNetResult : ActionResult
    {
        #region Constructors and Destructors

        public JsonNetResult() : this(null, null, null)
        {
        }

        public JsonNetResult(object data) : this(data, null, null)
        {
        }

        public JsonNetResult(object data, string contentType) : this(data, contentType, null)
        {
        }

        public JsonNetResult(object data, string contentType, Encoding encoding)
        {
            this.SerializerSettings = new JsonSerializerSettings();

            this.Data = data;
            this.ContentType = contentType;
            this.ContentEncoding = encoding;
        }

        #endregion

        #region Properties

        public Encoding ContentEncoding { get; set; }

        public string ContentType { get; set; }

        public object Data { get; set; }

        [CLSCompliant(false)]
        public Formatting Formatting { get; set; }
        [CLSCompliant(false)]
        public JsonSerializerSettings SerializerSettings { get; set; }

        #endregion

        #region Public Methods

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            HttpResponseBase response = context.HttpContext.Response;

            response.ContentType = !string.IsNullOrEmpty(this.ContentType) ? this.ContentType : "application/json";

            if (this.ContentEncoding != null)
            {
                response.ContentEncoding = this.ContentEncoding;
            }

            if (this.Data != null)
            {
                var writer = new JsonTextWriter(response.Output) { Formatting = Formatting };
                JsonSerializer serializer = JsonSerializer.Create(this.SerializerSettings);
                serializer.Serialize(writer, this.Data);
                writer.Flush();
            }
        }

        #endregion
    }
}

