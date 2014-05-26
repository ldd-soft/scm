SelectExitItem = function (config) {
    var config = config || {};
    var ds, grid;
    var pageSize = 100;
    var win;
    var search_field;
    var item_fields = ['Id', 'StoreId', 'StoreName', 'DateProduct', 'ItemId', 'ItemName', 'ItemNo', 'Code', 'Brand', 'Spec', 'Barcode', 'Unit', 'Quantity', 'ClientId', 'ClientName', 'AddId', 'AddName', 'DateAdded', 'Status'];

    var buildGrid = function () {
        ds = new Ext.data.Store({
            url: root_path + 'Exit/ListExitItem',
            baseParams: { 'type': config['type'] },
            reader: new Ext.data.JsonReader({
                totalProperty: 'TotalProperty',
                successProperty: 'Success',
                id: 'Id',
                root: 'Root',
                fields: item_fields
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
                }
            }
        });

        search_field = new Ext.ux.form.SearchField({
            store: ds
        });

        var multiSelect = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                'selectionchange': function (sm, rowIndex, r) {
                }
            }
        });

        var ds_brand = new Ext.data.Store({
            url: root_path + 'Dictionary/List',
            baseParams: { 'module': 'Item', 'field': 'Brand' },
            reader: new Ext.data.JsonReader(
            { totalProperty: 'TotalProperty', successProperty: 'Success', idProperty: 'Id', root: 'Root' },
            [{ name: 'Id', type: 'int' },
            { name: 'Key', type: 'string' },
            { name: 'Value', type: 'string' }
            ]
        )
        });

        var ds_store = new Ext.data.Store({
            url: root_path + 'Dictionary/List',
            baseParams: { 'module': '仓库', 'table_name': '仓库', 'record_id': 1 },
            reader: new Ext.data.JsonReader(
            { totalProperty: 'TotalProperty', successProperty: 'Success', idProperty: 'Id', root: 'Root' },
            [{ name: 'Id', type: 'int' },
            { name: 'Key', type: 'string' },
            { name: 'Value', type: 'string' }
            ]
        )
        });

        grid = new Ext.grid.GridPanel({
            store: ds,
            region: 'center',
            sm: multiSelect,
            columns: [
                multiSelect
            , { header: '商品编码', width: 70, dataIndex: 'ItemId', sortable: true }
            , { header: '商品名称', width: 300, dataIndex: 'ItemName', sortable: true }
            , { header: '客户名称', width: 90, dataIndex: 'ClientName', sortable: true }
            , { header: '仓库名称', width: 70, dataIndex: 'StoreName', sortable: true}
            , { header: '生产日期', width: 90, dataIndex: 'DateProduct', sortable: true, renderer: dateFormat }
            , { header: '销售日期', width: 90, dataIndex: 'DateAdded', sortable: true, renderer: dateFormat }
            , { header: '销售人', width: 70, dataIndex: 'AddName', sortable: true }
            , { header: '销售数量', width: 70, dataIndex: 'Quantity', sortable: true }
            ],
            tbar: [
                '快速查找：',
                search_field
                , { xtype: 'displayfield', width: 20, value: '' }
                , { xtype: 'displayfield', width: 80, value: '按品牌筛选：' }
                , {
                    xtype: 'combo',
                    name: 'Brand',
                    valueField: 'Value',
                    displayField: 'Value',
                    mode: 'remote',
                    allowBlank: true,
                    store: ds_brand,
                    selectOnFocus: true,
                    editable: true,
                    triggerAction: 'all',
                    loadingText: 'loading...',
                    maxLength: 64,
                    width: 110,
                    listeners: {
                        'select': function (combo, record, index) {
                            ds.baseParams['brand'] = record.data.Value;
                            ds.load();
                        },
                        'keyup': function () {
                            this.store.filter('Value', this.getRawValue(), true, false);
                        }
                    }
                }
                , { xtype: 'displayfield', width: 80, value: '按仓库筛选：' }
                , {
                    xtype: 'combo',
                    name: 'Store',
                    valueField: 'Key',
                    displayField: 'Value',
                    mode: 'remote',
                    allowBlank: true,
                    store: ds_store,
                    selectOnFocus: true,
                    editable: true,
                    triggerAction: 'all',
                    loadingText: 'loading...',
                    maxLength: 64,
                    width: 110,
                    listeners: {
                        'select': function (combo, record, index) {
                            ds.baseParams['store_id'] = record.data.Key;
                            ds.load();
                        }
                    }
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: pageSize,
                store: ds,
                displayInfo: true
            }),
            border: false,
            listeners: {
                rowdblclick: function (dv, record, item, index, e) {
                    select();
                },
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
                    },
                    scope: this
                }
            }
        });

        var btn_action = function () {
            search_field.setValue(this.text);
            search_field.onTrigger2Click();
        }

        var toolbar2 = new Ext.Toolbar({
            items: [{
                text: 'a',
                handler: btn_action
            }, '-', {
                text: 'b',
                handler: btn_action
            }, '-', {
                text: 'c',
                handler: btn_action
            }, '-', {
                text: 'd',
                handler: btn_action
            }, '-', {
                text: 'e',
                handler: btn_action
            }, '-', {
                text: 'f',
                handler: btn_action
            }, '-', {
                text: 'g',
                handler: btn_action
            }, '-', {
                text: 'h',
                handler: btn_action
            }, '-', {
                text: 'i',
                handler: btn_action
            }, '-', {
                text: 'j',
                handler: btn_action
            }, '-', {
                text: 'k',
                handler: btn_action
            }, '-', {
                text: 'l',
                handler: btn_action
            }, '-', {
                text: 'm',
                handler: btn_action
            }, '-', {
                text: 'n',
                handler: btn_action
            }, '-', {
                text: 'o',
                handler: btn_action
            }, '-', {
                text: 'p',
                handler: btn_action
            }, '-', {
                text: 'q',
                handler: btn_action
            }, '-', {
                text: 'r',
                handler: btn_action
            }, '-', {
                text: 's',
                handler: btn_action
            }, '-', {
                text: 't',
                handler: btn_action
            }, '-', {
                text: 'u',
                handler: btn_action
            }, '-', {
                text: 'v',
                handler: btn_action
            }, '-', {
                text: 'w',
                handler: btn_action
            }, '-', {
                text: 'x',
                handler: btn_action
            }, '-', {
                text: 'y',
                handler: btn_action
            }, '-', {
                text: 'z',
                handler: btn_action
            }]
        });

        grid.add(toolbar2);

        ds.load({
            params: { start: 0 }
        });
    };

    var buildWin = function () {
        win = new Ext.Window({
            title: '出库商品列表',
            width: 950,
            height: 530,
            modal: true,
            layout: 'border',
            items: grid,
            buttons: [{
                text: '添加',
                handler: function () {
                    select();
                }
            }, {
                text: '关闭',
                handler: function () {
                    win.close()
                }
            }]
        })
    };

    var select = function () {
        var recs = grid.getSelectionModel().getSelections();
        if (recs.length > 1 && config['is_select_single']) {
            Ext.MessageBox.alert('警告', '只能选择一个!');
            return;
        }

        config['onSelect'](recs);
        //win.close();
    }

    buildGrid();
    buildWin();

    return {
        show: function () {
            win.show();
        },
        hide: function () {
            win.close();
        }
    }
}
