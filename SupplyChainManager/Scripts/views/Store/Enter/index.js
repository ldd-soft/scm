var ds, grid;
var fp, win;
var panel;
var record;
var expander;

var fields = ['Id', 'EnterType', 'TableName', 'RecordId', 'RecordName', 'StoreId', 'StoreName', 'AddId', 'AddName', 'DateAdded', 'DeliverType', 'DeliverName', 'DeliverContact', 'DeliverTel', 'DeliverPayType', 'DeliverAmount', 'CheckId', 'CheckName', 'DateChecked', 'Remark', 'PurchaseId']
var fields_item = ['Id', 'EnterId', 'TableName', 'RecordId', 'ItemId', 'ItemName', 'StoreId', 'StoreName', 'BatchNo', 'DateProduct', 'ItemNo', 'Barcode', 'Spec', 'Unit', 'QuantityNeed', 'QuantityReal', 'QuantityMiss', 'Remark'];

var buildGrid = function () {
    ds = new Ext.data.Store({
        url: root_path + 'Enter/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: fields
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

                store.each(function (r) {
                    if (r.get('flag') == 'xx') {
                        grid.getView().getRow(girdcount).style.backgroundColor = '#ECDFCE';
                    }
                });

                if (search_type.getValue() == '明细') {
                    expander.expandAll();
                }
            }
        }
    });

    var expander = new Ext.ux.grid.RowPanelExpander({

        createExpandingRowPanelItems: function (rec1, rowIndex) {

            ds_item = new Ext.data.Store({
                url: root_path + 'EnterItem/Index',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'TotalProperty',
                    successProperty: 'Success',
                    id: 'Id',
                    root: 'Root',
                    fields: fields_item
                })
            });

            var grid_item = new Ext.grid.GridPanel({
                autoHeight: true,
                store: ds_item,
                columns: columns_item,
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

            ds_item.baseParams.enter_id = rec1.data.Id;
            if (search_type.getValue() == '明细') {
                ds_item.baseParams.query = search_query.getValue();
                ds_item.baseParams.date_from = search_date_from.getValue();
                ds_item.baseParams.date_to = search_date_to.getValue();
            } else {
                ds_item.baseParams.query = "";
                ds_item.baseParams.date_from = "";
                ds_item.baseParams.date_to = "";
            }
            ds_item.reload();

            var panelItems = [
			    new Ext.Panel({
			        record: rec1,
			        cls: 'inside-panel',
			        items: [
                        grid_item
                    ]
			    })
			];
            return panelItems;
        }
    });

    var toolbar = new Ext.Toolbar({
        cls: 'headtoolbar',
        items: ['<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/> <div class="ThemeHeadingText" id="list_title">入库列表 : </div>'
        ]
    });

    var columns = [
            expander,
            { header: '入库单号', width: 60, dataIndex: 'Id', sortable: true, renderer: underline }
            , { header: '采购单号', width: 70, dataIndex: 'PurchaseId', sortable: true }
            , { header: '商家名称', width: 200, dataIndex: 'RecordName', sortable: true, renderer: underline }
            , { header: '录入人', width: 70, dataIndex: 'AddName', sortable: true }
            , { header: '入库时间', width: 90, dataIndex: 'DateAdded', sortable: true, renderer: dateFormat }
            , { header: '收货方式', width: 70, dataIndex: 'DeliverType', sortable: true }
            , { header: '物流名称', width: 100, dataIndex: 'DeliverName', sortable: true }
            , { header: '物流联系人', width: 80, dataIndex: 'DeliverContact', sortable: true }
            , { header: '物流联系电话', width: 90, dataIndex: 'DeliverTel', sortable: true }
            , { header: '运费支付方式', width: 90, dataIndex: 'DeliverPayType', sortable: true }
            , { header: '运费金额', width: 70, dataIndex: 'DeliverAmount', renderer: renderFloat }
            , { header: '复核人', width: 70, dataIndex: 'CheckName', sortable: true }
            , { header: '备注', width: 110, dataIndex: 'Remark', sortable: true }
        ];

    var columns_item = [
                new Ext.grid.RowNumberer(),
                { header: '商品编号', width: 70, dataIndex: 'ItemId' },
                { header: '商品名称', width: 320, dataIndex: 'ItemName' },
                { header: '规格', width: 70, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '采购数', width: 60, dataIndex: 'Quantity' },
                { header: '入库仓库', width: 60, dataIndex: 'StoreName' },
                { header: '生产日期', width: 90, dataIndex: 'DateProduct', sortable: true, renderer: dateFormat },
                { header: '实收数', width: 60, dataIndex: 'QuantityReal' },
                { header: '未收数', width: 60, dataIndex: 'QuantityMiss' },
                { header: '未收处理', width: 90, dataIndex: 'MissProcess' },
                { header: '备注', width: 90, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                }
        ];

    currentItemConfig = { fields: fields_item, columns: columns_item };

    var search_type = new Ext.form.ComboBox({
        mode: 'local',
        store: new Ext.data.SimpleStore({
            data: [['单头', '单头'], ['明细', '明细']],
            fields: ['text', 'value']
        }),
        displayField: 'text',
        valueField: 'value',
        selectOnFocus: true,
        editable: false,
        triggerAction: 'all',
        loadingText: 'load...',
        emptyText: '',
        value: '单头',
        width: 70
    });

    var search_date_from = new Ext.form.DateField({
        format: 'Y-m-d',
        width: 110
    });

    var search_date_to = new Ext.form.DateField({
        format: 'Y-m-d',
        width: 110
    });

    var search_query = new Ext.form.TextField({
        width: 160
    });

    search_query.on('specialkey', function (f, e) {
        if (e.getKey() == e.ENTER) {
            search();
        }
    });

    var search = function () {
        ds.baseParams = ds.baseParams || {};
        ds.baseParams['type'] = search_type.getValue();
        ds.baseParams['date_from'] = search_date_from.getValue();
        ds.baseParams['date_to'] = search_date_to.getRawValue();
        ds.baseParams['query'] = search_query.getValue();
        ds.load();
    };

    grid = new Ext.grid.GridPanel({
        store: ds,
        columns: columns,
        border: false,
        columnLines: true,
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
                    var tbar1 = new Ext.Toolbar([
                    { xtype: 'displayfield', width: 20, value: '' }
                    , {
                        text: '添加入库',
                        cls: 'x-btn-text-icon',
                        iconCls: 'ico-new',
                        handler: newFn
                    }
                    , { xtype: 'tbspacer', width: 50 }
                    , {
                        xtype: 'tbtext',
                        text: '   快速查找：'
                    }
                    , search_type
                    , {
                        xtype: 'tbtext',
                        text: '',
                        width: 20
                    }
                    , {
                        xtype: 'tbtext',
                        text: '起始时间：'
                    }
                    , search_date_from
                    , {
                        xtype: 'tbtext',
                        text: '结束时间：',
                        style: { 'text-align': 'right' },
                        width: 80
                    }
                    , search_date_to
                    , {
                        xtype: 'tbtext',
                        text: '包含：',
                        style: { 'text-align': 'right' },
                        width: 60
                    }
                    , search_query
                    , { xtype: 'tbspacer', width: 20 }
                    , {
                        text: '查询',
                        cls: 'x-btn-text-icon',
                        iconCls: 'ico-search',
                        handler: search
                    }
                    , {
                        text: '重置',
                        cls: 'x-btn-text-icon',
                        iconCls: 'ico-clearAll',
                        handler: function () {
                            search_type.reset();
                            search_date_from.reset();
                            search_date_to.reset();
                            search_query.reset();
                            search();
                        }
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
                        editFn(record);
                    }
                    if (columnIndex == 2) {

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
    parentId = 'Enter';
    currentRec = {
        data: {},
        item: null
    };
    loadModule('AddEnter', '添加入库', 'store/enter/add');
};

var editFn = function (rec) {
    parentId = 'Enter';
    currentRec = rec;
    loadModule('EditEnter', '编辑入库', 'store/enter/edit');
};

init();

var p_enter = {
    id: 'Enter-panel',
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

cardPanel.add(p_enter);