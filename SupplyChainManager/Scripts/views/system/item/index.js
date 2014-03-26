
var ds, grid;
var fp, win;
var panel;
var item_id, item_name;
var record;

var addClientItem = function (record) {
    currentRec = record;
    loadModule('AddClientItem', '添加客户商品关联', 'system/clientitem/add');
}

var buildGrid = function () {
    ds = new Ext.data.Store({
        url: root_path + 'Item/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: ['Id', 'ItemCode', 'ItemName', 'ItemType', 'SubTitle', 'Brand', 'Specification', 'BarCode', 'SKU', 'Color', 'Style'
            , 'Long', 'Wide', 'High', 'NetWeight', 'MeasureUnit', 'CartonSpec', 'Producer', 'Packages', 'Guarantee', 'IsGuarantee', 'BatchType'
            , 'DateCreated', 'CreatedId', 'CreatedName']
        }),
        listeners: {
            'load': function (store, rs) {
                var d = this.reader.jsonData;

                if (d.totalCount === 0) {
                    showMessage('货品数据为空');
                } else if (d.Root.length == 0) {
                    showMessage('没有更多货品数据');
                } else {
                    showMessage('');
                }
            }
        }
    });

    var expander = new Ext.ux.grid.RowPanelExpander({

        createExpandingRowPanelItems: function (record, rowIndex) {            
            item_id = record.data.Id;
            item_name = record.data.ItemName;

            var ds_client_item = new Ext.data.Store({
                url: root_path + 'ClientItem/Index',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'TotalProperty',
                    successProperty: 'Success',
                    id: 'Id',
                    root: 'Root',
                    fields: ['Id', 'ItemId', 'ClientId', 'ClientName', 'MarketPrice', 'CostPrice', 'SalePrice', 'ReturnDays', 'ExchangeDays', 'RepairDays', 'MinOrderCount', 'SaleType', 'PrepareDays', 'SupplyType', 'TaxRate', 'IsOrder', 'SupplyId', 'SupplyName', 'DateCreated', 'CreatedId', 'CreatedName']
                })
            });

            var grid_client_item = new Ext.grid.GridPanel({
                store: ds_client_item,
                columns: [
                    {
                        xtype: 'actioncolumn',
                        align: 'center',
                        width: 50,
                        items: [{
                            icon: root_path + 'content/icons/view.png',
                            tooltip: '',
                            handler: function (grid, rowIndex, colIndex) {
                                
                            }
                        }]
                    }
                    , { header: '客户Id', width: 70, dataIndex: 'ClientId', sortable: true }
                    , { header: '客户名称', width: 120, dataIndex: 'ClientName', sortable: true }
                    , { header: '市场价', width: 50, dataIndex: 'MarketPrice', sortable: true }
                    , { header: '进价', width: 50, dataIndex: 'CostPrice', sortable: true }
                    , { header: '销售价', width: 50, dataIndex: 'SalePrice', sortable: true }
                    , { header: '包退天数', width: 60, dataIndex: 'ReturnDays', sortable: true }
                    , { header: '包换天数', width: 60, dataIndex: 'ExchangeDays', sortable: true }
                    , { header: '包修天数', width: 60, dataIndex: 'RepairDays', sortable: true }
                    , { header: '最小订货数量', width: 90, dataIndex: 'MinOrderCount', sortable: true }
                    , { header: '销售类型', width: 60, dataIndex: 'SaleType', sortable: true }
                    , { header: '备货天数', width: 60, dataIndex: 'PrepareDays', sortable: true }
                    , { header: '供应商类别', width: 80, dataIndex: 'SupplyType', sortable: true }
                    , { header: '税率', width: 50, dataIndex: 'TaxRate', sortable: true }
                    , { header: '是否可采', width: 70, dataIndex: 'IsOrder', sortable: true }
                    , { header: '供应商名称', width: 100, dataIndex: 'SupplyName', sortable: true }
                    , { header: '创建日期', width: 90, dataIndex: 'DateCreated', sortable: true, renderer: Ext.util.Format.dateRenderer('Y-m-d G:i:s') }
                    , { header: '创建人', width: 70, dataIndex: 'CreatedName', sortable: true }
                ],
                border: false,
                cls: 'detail-grid',
                tbar: ['<span class="detail-title">关联客户: </span>', {
                    text: '添加关联客户',
                    cls: 'x-btn-text-icon',
                    iconCls: 'ico-new',
                    handler: function () {
                        
                        addClientItem(record);
                    }
                }, ''
                , '', '', '', '', '']
                , listeners: {
                    'rowclick': {
                        fn: function (g, rowIndex, e) {
                            
                        },
                        scope: this
                    },
                    'rowcontextmenu': {
                        fn: function (grid, index, event) {

                        },
                        scope: this
                    }
                }
            });

            ds_client_item.baseParams.item_id = record.data.Id;
            ds_client_item.reload();

            var panelItems = [
			    new Ext.Panel({
			        record: record,
			        cls: 'inside-panel',
			        items: [
                        grid_client_item
                    ]
			    })
			];
            return panelItems;
        }
    });

    var toolbar = new Ext.Toolbar({
        cls: 'headtoolbar',
        items: ['<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/> <div class="ThemeHeadingText">货品列表 : </div>'
        , '->'
        , { text: '按类型筛选: ', width: 40 }
        , new Ext.form.ComboBox({
            mode: 'local',
            store: new Ext.data.SimpleStore({
                data: [['全部', '全部']],
                fields: ['text', 'value']
            }),
            displayField: 'text',
            valueField: 'value',
            selectOnFocus: true,
            editable: false,
            triggerAction: 'all',
            loadingText: 'load...',
            emptyText: '',
            value: '全部',
            width: 180,
            listeners: {
                'select': function (combo, record, index) {

                }
            }
        })
        , { text: '', width: 40 }
        ]
    });

    var checkColumn_isGuarantee = new Ext.grid.CheckColumn({
        header: "是否有保质期",
        dataIndex: 'IsGuarantee',
        width: 95
    });

    grid = new Ext.grid.GridPanel({
        store: ds,
        columns: [
            expander,
            {
                xtype: 'actioncolumn',
                header: '',
                align: 'center',
                width: 50,
                items: [{
                    icon: root_path + 'content/icons/edit.png',
                    tooltip: '',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = ds.getAt(rowIndex);
                        editFn(rec);
                    }
                }]
            }
            , { header: 'Id', width: 40, dataIndex: 'Id', sortable: true, renderer: underline }
            , { header: '商品编码', width: 100, dataIndex: 'ItemCode', sortable: true, renderer: underline }
            , { header: '商品名称', width: 120, dataIndex: 'ItemName', sortable: true }
            , { header: '商品类别', width: 100, dataIndex: 'ItemType', sortable: true }
            , { header: '品牌', width: 50, dataIndex: 'Brand', sortable: true }
            , { header: '规格', width: 50, dataIndex: 'Specification', sortable: true }
            , { header: '条形码', width: 100, dataIndex: 'BarCode', sortable: true }
            , { header: 'SKU', width: 80, dataIndex: 'SKU', sortable: true }
            , { header: '单品毛重', width: 60, dataIndex: 'NetWeight', sortable: true }
            , { header: '计量单位', width: 60, dataIndex: 'MeasureUnit', sortable: true }
            , { header: '箱规', width: 50, dataIndex: 'CartonSpec', sortable: true }
            , { header: '产地', width: 50, dataIndex: 'Producer', sortable: true }
            , { header: '包装类型', width: 60, dataIndex: 'Packages', sortable: true }
            , { header: '保质天数', width: 60, dataIndex: 'Guarantee', sortable: true }
            , { header: '批次类型', width: 80, dataIndex: 'BatchType', sortable: true }
            , { header: '创建日期', width: 90, dataIndex: 'DateCreated', sortable: true, renderer: Ext.util.Format.dateRenderer('Y-m-d G:i:s') }
            , { header: '创建人', width: 90, dataIndex: 'CreatedName', sortable: true }
            , checkColumn_isGuarantee
        ],
        border: false,
        tbar: toolbar,
        plugins: [expander, checkColumn_isGuarantee],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: ds,
            displayInfo: true
        })
        , listeners: {
            'render': {
                fn: function () {
                    innerMessage = document.createElement('div');
                    innerMessage.className = 'inner-message';
                    var msg = innerMessage;
                    var elem = Ext.get(grid.getEl());
                    var scroller = elem.select('.x-grid3-scroller');
                    scroller.each(function () {
                        this.dom.appendChild(msg);
                    });
                    var tbar1 = new Ext.Toolbar([{
                        xtype: 'tbtext',
                        text: '快速查找：'
                    }, new Ext.ux.form.SearchField({
                        store: ds
                    })
                    , { xtype: 'displayfield', width: 20, value: '' }
                    , {
                        text: '添加货品',
                        cls: 'x-btn-text-icon',
                        iconCls: 'ico-new',
                        handler: newFn
                    }
                    ]);
                    tbar1.render(grid.tbar);
                },
                scope: this
            }
            , 'cellclick': {
                fn: function (grid, rowIndex, columnIndex, e) {
                    record = ds.getAt(rowIndex);
                },
                scope: this
            }
        }
        
    });

};

var buildLayout = function () {
    panel = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        items: grid
    });
};

var init = function () {
    buildGrid();
    buildLayout();
};

var newFn = function () {
    parentId = 'Item';
    loadModule('AddItem', '添加货品', 'system/item/add');
};

var editFn = function (rec) {
    parentId = 'Item';
    currentRec = rec;
    loadModule('EditItem', '修改货品', 'system/item/edit');
};

ScriptMgr.loadJs({
    scripts: [root_path + 'scripts/lib/ext-3.4.0/ux/CheckColumn.js'],
    callback: function () {

        init();

        var p_item = {
            id: 'Item-panel',
            border: false,
            layout: 'border',
            items: [panel],
            listeners: {
                'activate': function (A) {
                    ds.load({
                        params: {
                            start: 0,
                            limit: 20
                        }
                    })
                }
            }
        }

        var cardPanel = Ext.getCmp('content-panel');

        cardPanel.add(p_item);
        cardPanel.layout.setActiveItem('Item-panel');
    }
});  