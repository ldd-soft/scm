
var ds, grid;
var fp, win;
var panel;
var client_id, client_name;
var record;

var buildGrid = function () {
    ds = new Ext.data.Store({
        url: root_path + 'User/Index',
        reader: new Ext.data.JsonReader({
            totalProperty: 'TotalProperty',
            successProperty: 'Success',
            id: 'Id',
            root: 'Root',
            fields: ['Id', 'Login', 'Name', 'Position', 'City', 'Office', 'Tel', 'Fax', 'Email', 'Gender', 'Birthday'
            , 'IsActive', 'IsHoliday', 'AgentID', 'AgentName', 'AgentBegin', 'AgentEnd', 'Profile', 'CostCenter', 'Level', 'Reserve1', 'Reserve2'
            , 'Reserve3', 'Reserve4']
        }),
        listeners: {
            'load': function (store, rs) {
                var d = this.reader.jsonData;

                if (d.totalCount === 0) {
                    showMessage('用户数据为空');
                } else if (d.Root.length == 0) {
                    showMessage('没有更多用户数据');
                } else {
                    showMessage('');
                }
            }
        }
    });

    var toolbar = new Ext.Toolbar({
        cls: 'headtoolbar',
        items: ['<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/> <div class="ThemeHeadingText">用户列表 : </div>'
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

    var checkColumn_isActive = new Ext.grid.CheckColumn({
        header: "是否在职",
        dataIndex: 'IsActive',
        width: 75,
        readOnly: false
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
            , { header: '用户名', width: 150, dataIndex: 'Login', sortable: true, renderer: underline }
            , { header: '姓名', width: 100, dataIndex: 'Name', sortable: true }
            , { header: '职位', width: 100, dataIndex: 'Position', sortable: true }
            , { header: '所在城市', width: 100, dataIndex: 'City', sortable: true }
            , { header: '电话', width: 100, dataIndex: 'Tel', sortable: true }
            , { header: '传真', width: 100, dataIndex: 'Fax', sortable: true }
            , { header: '邮箱', width: 100, dataIndex: 'Email', sortable: true }
            , checkColumn_isActive
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
                        text: '添加用户',
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
                    parentId = 'User';
                    closeModule(null, 'ViewUser');
                    loadModule('ViewUser', 'view user', 'public/user/view');
                    }
                    */
                },
                scope: this
            },
            'afteredit': function (e) {
                var rec = e.record;
                var field = e.field;
                var id = rec.get("Id");
                var value = rec.get(field);
                Ext.Ajax.request({
                    url: root_path + 'User/ChangeActive',
                    params: { id: id, field: field, value: value },
                    success: function (response) {
                        var data = Ext.util.JSON.decode(response.responseText);
                        if (data.success) {

                            ds.commitChanges();
                        }
                        else {
                            Ext.MessageBox.alert('提醒', data.msg);
                        }
                    }
                });
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
    parentId = 'User';
    loadModule('AddUser', '添加用户', 'system/user/add');
};

var editFn = function (rec) {
    parentId = 'User';
    currentRec = rec;
    loadModule('EditUser', '修改用户', 'system/user/edit');
};

ScriptMgr.loadJs({
    scripts: [root_path + 'scripts/lib/ext-3.4.0/ux/CheckColumn.js'],
    callback: function () {

        init();

        var p_user = {
            id: 'User-panel',
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

        cardPanel.add(p_user);
        cardPanel.layout.setActiveItem('User-panel');
    }
});  