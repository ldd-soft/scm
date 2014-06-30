var ds, grid;
var fp, win;
var panel;
var record;
var expander;

var buildGrid = function () {
    ds = new Ext.data.Store({
        url: root_path + 'Item/ListByStock',
        baseParams: {'only_count': 'true'},
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: item_stock_fields
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

                if (search_type.getValue() == '批次库存') {
                    expander.expandAll();
                }
            }
        }
    });

    var expander = new Ext.ux.grid.RowPanelExpander({

        createExpandingRowPanelItems: function (rec1, rowIndex) {

            ds_item = new Ext.data.Store({
                url: root_path + 'Item/ListByBatchStock',
                baseParams: {'only_count': 'true'},
                reader: new Ext.data.JsonReader({
                    totalProperty: 'TotalProperty',
                    successProperty: 'Success',
                    id: 'Id',
                    root: 'Root',
                    fields: item_batch_stock_fields
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

            ds_item.baseParams.item_id = rec1.data.Id;
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
        items: ['<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/> <div class="ThemeHeadingText" id="list_title">库存查询 : </div>'
        ]
    });

    var columns = [
            expander,
            { header: '商品编码', width: 70, dataIndex: 'Id', sortable: true, renderer: underline }
            , { header: '条形码', width: 120, dataIndex: 'Barcode', sortable: true }
            , { header: '商品名称', width: 600, dataIndex: 'ItemName', sortable: true}
            , { header: '规格', width: 70, dataIndex: 'Spec' }
            , { header: '单位', width: 50, dataIndex: 'Unit' }
            , { header: '总库存数', width: 70, dataIndex: 'RealCount', sortable: true, renderer: function (value, metadata, record) {
                if (!value) {
                    return 0;
                }
                if (value < record.data.LimitCount) {
                    return '<span style="color:red;">' + value + '</span>';
                }
                else {
                    return value;
                }
            } 
            }
        ];

    var columns_item = [
        new Ext.grid.RowNumberer()
        , { header: '商品编码', width: 70, dataIndex: 'ItemId', sortable: true }
        , { header: '商品名称', width: 320, dataIndex: 'ItemName', sortable: true }
        , { header: '仓库名称', width: 70, dataIndex: 'StoreName', sortable: true }
        , { header: '生产日期', width: 100, dataIndex: 'DateProduct', sortable: true, renderer: dateFormat }
        , { header: '批次库存', width: 70, dataIndex: 'RealCount', sortable: true }
        , { header: '效期', width: 70, dataIndex: 'ValidDate', sortable: true }
    ];

    var search_type = new Ext.form.ComboBox({
        mode: 'local',
        store: new Ext.data.SimpleStore({
            data: [['总库存', '总库存'], ['批次库存', '批次库存']],
            fields: ['text', 'value']
        }),
        displayField: 'text',
        valueField: 'value',
        selectOnFocus: true,
        editable: false,
        triggerAction: 'all',
        loadingText: 'load...',
        emptyText: '',
        value: '总库存',
        width: 120
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

init();

var p_storeQuery = {
    id: 'StoreQuery-panel',
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

cardPanel.add(p_storeQuery);