
var ds, grid;
var fp, win;
var panel;
var supply_id, supply_name;
var record;

var buildGrid = function () {
    ds = new Ext.data.Store({
        url: root_path + 'Supply/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: ['Id', 'SupplyName', 'Tel', 'Contact']
        }),
        listeners: {
            'load': function (store, rs) {
                var d = this.reader.jsonData;

                if (d.totalCount === 0) {
                    showMessage('供应商数据为空');
                } else if (d.Root.length == 0) {
                    showMessage('没有更多供应商数据');
                } else {
                    showMessage('');
                }
            }
        }
    });

    var toolbar = new Ext.Toolbar({
        cls: 'headtoolbar',
        items: ['<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/> <div class="ThemeHeadingText">供应商列表 : </div>'
        , '->'
        , { text: '按类型筛选: ', width: 40 }
        , new Ext.form.ComboBox({
            mode: 'local',
            store: new Ext.data.SimpleStore({
                data: [['全部', '全部'], ['其它', '其它']],
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

    grid = new Ext.grid.GridPanel({
        store: ds,
        columns: [
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
            , { header: 'id', width: 50, dataIndex: 'Id', sortable: true, renderer: underline }
            , { header: '供应商名称', width: 350, dataIndex: 'SupplyName', sortable: true, renderer: underline }
            , { header: '联系电话', width: 200, dataIndex: 'Tel', sortable: true }
            , { header: '联系人', width: 200, dataIndex: 'Contact', sortable: true }
        ],
        border: false,
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
                        text: '添加供应商',
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
                    /*
                    if (columnIndex == 2 || columnIndex == 3) {
                    currentRec = ds.getAt(rowIndex);
                    parentId = 'Supply';
                    closeModule(null, 'ViewSupply');
                    loadModule('ViewSupply', 'view supply', 'public/supply/view');
                    }
                    */
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
    parentId = 'Supply';
    loadModule('AddSupply', '添加供应商', 'system/supply/add');
};

var editFn = function (rec) {
    parentId = 'Supply';
    currentRec = rec;
    loadModule('EditSupply', '修改供应商', 'system/supply/edit');
};

init();

var p_supply = {
    id: 'Supply-panel',
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

cardPanel.add(p_supply);
cardPanel.layout.setActiveItem('Supply-panel');
    