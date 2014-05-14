var ds, grid;
var ds_purchase, ds_sale;
var fp, win;
var panel;
var record;

var ViewOrder = function (activeTab) {
    editFn(record);
}

var ViewOrder = function () {
    if (record) {
        parentId = 'Order';
        var id = 'ViewOrder';
        closeModule(null, id);
        Ext.Ajax.request({
            url: root_path + 'Order/FindById',
            params: {
                id: record.data.OrderId
            },
            method: "GET",
            success: function (response, options) {
                if (response.responseText != "") {
                    if (!currentRec) {
                        currentRec = {};
                    }
                    currentRec.data = eval('(' + response.responseText + ')');
                    currentTab = 0;
                    loadModule('ViewOrder', 'view order', 'order/vieworder/index');
                }
            },
            failure: function (response, options) {

            }
        });
    }
}

var ViewClient = function () {
    if (record) {
        parentId = 'Order';
        var id = 'ViewClient';
        closeModule(null, id);
        Ext.Ajax.request({
            url: root_path + 'Client/FindById',
            params: {
                id: record.data.ClientId
            },
            method: "GET",
            success: function (response, options) {
                if (response.responseText != "") {
                    if (!currentRec) {
                        currentRec = {};
                    }
                    currentRec.data = eval('(' + response.responseText + ')');
                    currentTab = 0;
                    loadModule('ViewClient', 'view client', 'client/viewclient/index');
                }
            },
            failure: function (response, options) {

            }
        });
    }
}

var order_fields = ['Id', 'SupplyId', 'SupplyName', 'ClientId', 'ClientName', 'DateOrder', 'SupplyType', 'Status', 'AddId', 'AddName', 'DateAdded', 'CheckId', 'CheckName', 'DateChecked', 'ApproveId', 'ApproveName', 'DateApproved', 'Remark']

var buildGrid = function () {
    ds = new Ext.data.Store({
        url: root_path + 'Order/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: order_fields
        }),
        listeners: {
            'load': function (store, rs) {
                var d = this.reader.jsonData;

                if (d.totalCount === 0) {
                    showMessage('数据为空');
                } else if (d.Root.length == 0) {
                    showMessage('数据为空');
                } else {
                    showMessage('');
                }

                var girdcount = 0;
                store.each(function (r) {
                    if (r.get('MgrApproved') == '' || r.get('FinanceApproved') == '') {
                        grid.getView().getRow(girdcount).style.backgroundColor = '#ECDFCE';
                    }
                    girdcount = girdcount + 1;
                });
            }
        }
    });

    var purchase_columns = [
                new Ext.grid.RowNumberer(),
                { header: 'po单号', width: 90, dataIndex: 'PoNo', totalSummaryTitle: '合计' },
                { header: '商品名称', width: 130, dataIndex: 'ItemName' },
                { header: '商品编码', width: 90, dataIndex: 'ItemNo' },
                { header: '条形码', width: 90, dataIndex: 'Barcode' },
                { header: '规格', width: 60, dataIndex: 'Spec' },
                { header: '单位', width: 60, dataIndex: 'Unit' },
                { header: '数量', width: 80, dataIndex: 'Quantity', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '单价', width: 80, dataIndex: 'PurchasePrice', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '折扣', width: 80, dataIndex: 'PurchaseDiscount', renderer: renderFloat },
                { header: '金额', width: 80, dataIndex: 'PurchaseAmount', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '实收数量', width: 80, dataIndex: 'QuantityReceived', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '实收金额', width: 80, dataIndex: 'AmountReceived', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '未收数量', width: 80, dataIndex: 'QuantityMiss', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '未收金额', width: 80, dataIndex: 'AmountMiss', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '未到处理情况', width: 120, dataIndex: 'MissProcess', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                },
                { header: '备注', width: 120, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                }
        ];

    var sale_columns = [
                new Ext.grid.RowNumberer(),
                { header: 'po单号', width: 90, dataIndex: 'PoNo', totalSummaryTitle: '合计' },
                { header: '仓库名称', width: 90, dataIndex: 'StoreName' },
                { header: '商品名称', width: 130, dataIndex: 'ItemName' },
                { header: '商品编码', width: 90, dataIndex: 'ItemNo' },
                { header: '条形码', width: 90, dataIndex: 'Barcode' },
                { header: '规格', width: 60, dataIndex: 'Spec' },
                { header: '单位', width: 60, dataIndex: 'Unit' },
                { header: '数量', width: 80, dataIndex: 'Quantity', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '单价', width: 80, dataIndex: 'SalePrice', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '折扣', width: 80, dataIndex: 'SaleDiscount', renderer: renderFloat },
                { header: '金额', width: 80, dataIndex: 'SaleAmount', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '实送数量', width: 80, dataIndex: 'QuantityReceived', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '实送金额', width: 80, dataIndex: 'AmountReceived', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '未送数量', width: 80, dataIndex: 'QuantityMiss', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '未送金额', width: 80, dataIndex: 'AmountMiss', renderer: renderFloat, totalSummaryType: 'sum', summaryType: 'sum' },
                { header: '未到处理情况', width: 120, dataIndex: 'MissProcess', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                },
                { header: '备注', width: 120, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                }
        ];

    ds_purchase = new Ext.data.Store({
        url: root_path + 'Purchase/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: purchase_fields
        })
    });

    ds_sale = new Ext.data.Store({
        url: root_path + 'Sale/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: sale_fields
        })
    });

    var expander = new Ext.ux.grid.RowPanelExpander({

        createExpandingRowPanelItems: function (rec1, rowIndex) {

            var grid_purchase = new Ext.grid.GridPanel({
                store: ds_purchase,
                columns: purchase_columns,
                border: false,
                cls: 'detail-grid'
                , listeners: {
                    'rowclick': {
                        fn: function (g, rowIndex, e) {
                            e.stopEvent();
                            //contextMenu.showAt(e.xy);

                            var record = g.getStore().getAt(rowIndex);
                        },
                        scope: this
                    }
                }
            });

            var grid_sale = new Ext.grid.GridPanel({
                store: ds_sale,
                columns: sale_columns,
                border: false,
                cls: 'detail-grid'
                , listeners: {
                    'rowclick': {
                        fn: function (g, rowIndex, e) {
                            e.stopEvent();
                            //contextMenu.showAt(e.xy);

                            var record = g.getStore().getAt(rowIndex);
                        },
                        scope: this
                    }
                }
            });

            ds_purchase.baseParams.order_id = rec1.data.Id;
            ds_purchase.reload();

            ds_sale.baseParams.order_id = rec1.data.Id;
            ds_sale.reload();

            var panelItems = [
			    new Ext.Panel({
			        record: rec1,
			        cls: 'inside-panel',
			        items: [
                        grid_purchase, grid_sale
                    ]
			    })
			];
            return panelItems;
        }
    });

    var toolbar = new Ext.Toolbar({
        cls: 'headtoolbar',
        items: ['<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/> <div class="ThemeHeadingText" id="order_list_title">订单列表 : </div>'
            , '->'
            , '查看列表: '
        , new Ext.form.ComboBox({
            mode: 'local',
            store: new Ext.data.SimpleStore({
                data: [['订单列表', '订单列表'], ['采购列表', '采购列表'], ['销售列表', '销售列表']],
                fields: ['text', 'value']
            }),
            displayField: 'text',
            valueField: 'value',
            selectOnFocus: true,
            editable: false,
            triggerAction: 'all',
            loadingText: 'load...',
            emptyText: '',
            value: '订单列表',
            width: 140,
            listeners: {
                'select': function (combo, record, index) {
                    if (index == 0) {
                        var colModel = new Ext.grid.ColumnModel(order_columns);
                        grid.reconfigure(ds, colModel);
                        var pagingToolbar = grid.getBottomToolbar();
                        pagingToolbar.bind(ds);
                        grid.getStore().reload();
                        Ext.fly('order_list_title').update('订单列表 : ');
                    }
                    if (index == 1) {
                        var colModel = new Ext.grid.ColumnModel(purchase_columns);
                        grid.reconfigure(ds_purchase, colModel);
                        var pagingToolbar = grid.getBottomToolbar();
                        pagingToolbar.bind(ds_purchase);
                        grid.getStore().reload();
                        Ext.fly('order_list_title').update('采购列表 : ');
                    }
                    if (index == 2) {
                        var colModel = new Ext.grid.ColumnModel(sale_columns);
                        grid.reconfigure(ds_sale, colModel);
                        var pagingToolbar = grid.getBottomToolbar();
                        pagingToolbar.bind(ds_sale);
                        grid.getStore().reload();
                        Ext.fly('order_list_title').update('销售列表 : ');
                    }
                }
            }
        })
        , { xtype: 'displayfield', width: 20, value: '' }
        , '状态: '
        , new Ext.form.ComboBox({
            mode: 'local',
            store: new Ext.data.SimpleStore({
                data: [['全部', '全部'], ['待审核', '待审核'], ['待入库', '待入库'], ['待结算', '待结算'], ['已完成', '已完成']],
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
            width: 140,
            listeners: {
                'select': function (combo, record, index) {
                    ds.baseParams['limit'] = 20;
                    ds.baseParams['status'] = record.data.value;
                    ds.load();
                    //ds.reload({ params: { status: record.data.value} });
                }
            }
        })
        ]
    });

    var order_columns = [
            expander,
            { header: '订单 #', width: 70, dataIndex: 'Id', sortable: true, renderer: underline }
            , { header: '供应商名称', width: 150, dataIndex: 'SupplyName', sortable: true, renderer: underline }
            , { header: '客户名称', width: 150, dataIndex: 'ClientName', sortable: true, renderer: underline }
            , { header: '订单日期', width: 90, dataIndex: 'DateOrder', sortable: true, renderer: dateFormat }
            , { header: '送货方式', width: 70, dataIndex: 'SupplyType', sortable: true }
            , { header: '状态', width: 70, dataIndex: 'Status', sortable: true, renderer: function (value) {
                if (value == 'draft') {
                    return '<a href="#"><font color=red>' + value + '</font></a>';
                }
                else {
                    return '<a href="#">' + value + '</a>';
                }
            }
            }
            , { header: '申请人', width: 80, dataIndex: 'AddName', sortable: true }
            , { header: '复核人', width: 80, dataIndex: 'CheckName', sortable: true }
            , { header: '批准人', width: 80, dataIndex: 'ApproveName', sortable: true }
            , { header: '备注', width: 210, dataIndex: 'Remark', sortable: true }
        ];

    grid = new Ext.grid.GridPanel({
        store: ds,
        columns: order_columns,
        border: false,

        plugins: [expander],
        tbar: toolbar,
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
                        text: '添加订单',
                        cls: 'x-btn-text-icon',
                        iconCls: 'ico-new',
                        handler: newFn
                    }
                    ]);
                    tbar1.render(grid.tbar);
                },
                scope: this
            },
            'cellclick': {
                fn: function (grid, rowIndex, columnIndex, e) {
                    record = ds.getAt(rowIndex);
                    if (columnIndex == 1) {
                        ViewOrder(0);
                    }
                    if (columnIndex == 2) {
                        ViewClient();
                    }
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
    parentId = 'Order';
    currentRec = {
        data: {},
        item: null
    };
    loadModule('AddOrder', '添加订单', 'order/add');
};

var editFn = function (rec) {
    parentId = 'Order';
    currentRec = rec;
    loadModule('EditOrder', '编辑订单', 'order/edit');
};

init();

var p_order = {
    id: 'Order-panel',
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

cardPanel.add(p_order);