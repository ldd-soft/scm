var ds, grid;
var fp, win;
var panel;
var record;
var expander;

var fields = ['Id', 'EnterType', 'TableName', 'RecordId', 'RecordName', 'StoreId', 'StoreName', 'AddId', 'AddName', 'DateAdded', 'DeliverType', 'DeliverName', 'DeliverContact', 'DeliverTel', 'DeliverPayType', 'DeliverAmount', 'CheckId', 'CheckName', 'DateChecked', 'Remark']
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
            , '->'
            , '查看列表: '
        , new Ext.form.ComboBox({
            mode: 'local',
            store: new Ext.data.SimpleStore({
                data: [['单据列表', '单据列表'], ['商品列表', '商品列表']],
                fields: ['text', 'value']
            }),
            displayField: 'text',
            valueField: 'value',
            selectOnFocus: true,
            editable: false,
            triggerAction: 'all',
            loadingText: 'load...',
            emptyText: '',
            value: '单据列表',
            width: 140,
            listeners: {
                'select': function (combo, record, index) {
                    if (index == 0) {
                        var colModel = new Ext.grid.ColumnModel(columns);
                        grid.reconfigure(ds, colModel);
                        var pagingToolbar = grid.getBottomToolbar();
                        pagingToolbar.bind(ds);
                        grid.getStore().reload();
                    }
                    if (index == 1) {
                        var colModel = new Ext.grid.ColumnModel(columns_item);
                        grid.reconfigure(ds_item, colModel);
                        var pagingToolbar = grid.getBottomToolbar();
                        pagingToolbar.bind(ds_item);
                        grid.getStore().reload();
                        //Ext.fly('list_title').update('入库列表 : ');
                    }
                }
            }
        })
        , { xtype: 'displayfield', width: 20, value: '' }

        ]
    });

    var columns = [
            expander,
            { header: '入库单 #', width: 90, dataIndex: 'Id', sortable: true, renderer: underline }
            , { header: '入库类型', width: 80, dataIndex: 'EnterType', sortable: true }
            , { header: '商家名称', width: 300, dataIndex: 'RecordName', sortable: true, renderer: underline }
            , { header: '录入人', width: 80, dataIndex: 'AddName', sortable: true }
            , { header: '入库时间', width: 120, dataIndex: 'DateAdded', sortable: true, renderer: dateFormat }
            , { header: '收货方式', width: 70, dataIndex: 'DeliverType', sortable: true }
            , { header: '物流名称', width: 80, dataIndex: 'DeliverName', sortable: true }
            , { header: '物流联系人', width: 80, dataIndex: 'DeliverContact', sortable: true }
            , { header: '物流联系电话', width: 90, dataIndex: 'DeliverTel', sortable: true }
            , { header: '运费支付方式', width: 90, dataIndex: 'DeliverPayType', sortable: true }
            , { header: '运费金额', width: 90, dataIndex: 'DeliverAmount', renderer: renderFloat }
            , { header: '复核人', width: 80, dataIndex: 'CheckName', sortable: true }
            , { header: '备注', width: 130, dataIndex: 'Remark', sortable: true }
        ];

    var columns_item = [
                new Ext.grid.RowNumberer(),
                { header: '商品编号', width: 70, dataIndex: 'ItemId' },
                { header: '商品名称', width: 320, dataIndex: 'ItemName' },
                { header: '规格', width: 70, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '仓库名称', width: 60, dataIndex: 'StoreName' },
                { header: '生产日期', width: 90, dataIndex: 'DateProduct', sortable: true, renderer: dateFormat },
                { header: '应收数量', width: 60, dataIndex: 'QuantityNeed' },
                { header: '实收数量', width: 60, dataIndex: 'QuantityReal' },
                { header: '备注', width: 90, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                }
        ];

    currentItemConfig = { fields: fields_item, columns: columns_item };

    grid = new Ext.grid.GridPanel({
        store: ds,
        columns: columns,
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
                        text: '添加入库',
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