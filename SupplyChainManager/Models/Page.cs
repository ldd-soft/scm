using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SupplyChainManager.Models
{

    /// <summary>
    ///  在ExtJS和服务器之间封装查询结果和查询条件
    /// </summary>
    public class Page<T>
    {
        public int TotalProperty { get; set; }  // 总记录数
        public List<T> Root { get; set; }  // 分页结果
        public int Start { get; set; }  // 开始页码
        public int Limit { get; set; }  // 每页多少
        public bool success { get; set; }  // 成功与否
        public Dictionary<string, string> Params { get; set; }  // 查询条件
        public string Message { get; set; }  // 返回消息

        public List<String> Conditions { get; set; }  // 查询条件
        public List<int> UnitId { get; set; }  // 所属单位
        public int MasterId { get; set; }  // MasterID
        public string TypeName { get; set; }  // 类型查询
        public string TableName { get; set; }//查询的表名
        public string BeginDate { get; set; }//查询开始时间
        public string EndDate { get; set; }//查询结束时间
    }

    /// <summary>
    /// Ext TreePanel 所需要的节点信息
    /// </summary>
    public class JSONTreeNode
    {
        public string text { get; set; } // 文字
        public bool leaf { get; set; }   // 是否节点
        public string id { get; set; }    // dom中的id
        public bool expanded { get; set; }  // 是否展开
        public bool IsChecked { get; set; }//复选框
        public string iconCls { get; set; } // 图标
        public List<JSONTreeNode> children { get; set; }  // 子节点
        public string cls { get; set; } // 类型
        public string url { get; set; } // 链接
        public string name { get; set; } // 名称

        public JSONTreeNode()
        {
            children = new List<JSONTreeNode>();
        }
    }

    /// <summary>
    /// Ext 带复选框的TreePanel 所需要的节点信息
    /// </summary>
    public class JSONCheckBoxTreeNode
    {
        public string text { get; set; } // 文字
        public bool leaf { get; set; }   // 是否节点
        public string id { get; set; }    // dom中的id
        public bool expanded { get; set; }  // 是否展开
        public bool @checked { get; set; } //复选框
        public string iconCls { get; set; } // 图标

        public List<JSONCheckBoxTreeNode> children { get; set; }  // 子节点

        public JSONCheckBoxTreeNode()
        {
            children = new List<JSONCheckBoxTreeNode>();
        }
    }

    public class JSONAsyncTreeNode
    {
        public string text { get; set; } // 文字
        public bool leaf { get; set; }   // 是否节点
        public string id { get; set; }    // dom中的id
        public bool expanded { get; set; }  // 是否展开
        public string iconCls { get; set; } // 图标
        public string cls { get; set; } // 类型
    }

    /// <summary>
    /// Ext TreePanel 异步节点
    /// </summary>
    public class JSONCheckBoxAsyncTreeNode
    {
        public string text { get; set; } // 文字
        public bool leaf { get; set; }   // 是否节点
        public string id { get; set; }    // dom中的id
        public bool expanded { get; set; }  // 是否展开
        public bool IsChecked { get; set; }//复选框
        public string iconCls { get; set; } // 图标
        public string cls { get; set; } // 类型
        public bool @checked { get; set; } //复选框
    }

}
