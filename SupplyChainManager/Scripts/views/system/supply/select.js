SelectSupply = function (config) {
    var config = config || {};
    var ds, grid;
    var pageSize = 20;
    var win;
    var search_field;

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

        search_field = new Ext.ux.form.SearchField({
            store: ds
        });

        var multiSelect = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                'selectionchange': function (sm, rowIndex, r) {
                }
            }
        });

        grid = new Ext.grid.GridPanel({
            store: ds,
            sm: multiSelect,
            columns: [
                multiSelect
            , { header: 'id', width: 50, dataIndex: 'Id', sortable: true }
            , { header: '供应商名称', width: 350, dataIndex: 'SupplyName', sortable: true, renderer: underline }
            , { header: '联系电话', width: 200, dataIndex: 'Tel', sortable: true }
            , { header: '联系人', width: 200, dataIndex: 'Contact', sortable: true }
            ],
            tbar: [
                'quick search：',
                search_field
                , { xtype: 'displayfield', width: 20, value: '' }
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
            title: '供应商列表',
            width: 750,
            height: 430,
            modal: true,
            layout: 'fit',
            items: grid,
            buttons: [{
                text: '取消',
                handler: function () { win.close() }
            }, {
                text: '确定',
                handler: function () {
                    select();
                }
            }]
        })
    };

    var select = function () {
        var recs = grid.getSelectionModel().getSelections();
        if (recs.length > 1 && config['is_select_single']) {
            Ext.MessageBox.alert('warning', 'Just can select one, please choose again!');
            return;
        }

        config['onSelect'](recs);
        win.close();
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
