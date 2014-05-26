Sale = function (config) {
    var config = config || {};
    var fp;
    var ds_item, grid_item;
    var fp_reject, win_reject;
    var t_id = Ext.id();
    var client_id;

    var submit = function () {
        if (config['record']) {
            Ext.Ajax.request({
                url: root_path + 'Sale/ChangeStatus',
                params: { id: config['record'].data.Id, value: 'submitted' },
                success: function (response) {
                    var data = Ext.util.JSON.decode(response.responseText);
                    if (data.success) {
                        config['onClose'](config['parentId']);
                    }
                    else {
                        Ext.MessageBox.alert('Warning', data.msg);
                    }
                }
            });
        }
        else {
            fp.form.findField('Status').setValue('submitted');
            save();
        }
    }

    var reject = function (comments) {
        if (config['record']) {
            Ext.Ajax.request({
                url: root_path + 'Sale/Reject',
                params: { id: config['record'].data.Id, reject_comments: comments },
                success: function (response) {
                    var data = Ext.util.JSON.decode(response.responseText);
                    if (data.success) {
                        config['onClose'](config['parentId']);
                    }
                    else {
                        Ext.MessageBox.alert('warning', data.msg);
                    }
                }
            });
        }
    }

    var showReject = function () {
        buildRejectWin();
        win_reject.show();
    }

    var pass = function () {
        if (config['record']) {
            Ext.getBody().mask("processing...", "x-mask-loading");
            Ext.Ajax.request({
                url: root_path + 'Sale/Pass',
                params: { id: config['record'].data.Id },
                success: function (response) {
                    var data = Ext.util.JSON.decode(response.responseText);
                    if (data.success) {
                        config['onClose'](config['parentId']);
                    }
                    else {
                        Ext.MessageBox.alert('warning', data.msg);
                    }
                    Ext.getBody().unmask();
                }
            });

        }
    }

    var cancel = function () {
        config['onClose'](config['parentId']);
    };

    var save = function (btn) {
        if (fp.form.isValid() == false) {
            Ext.MessageBox.alert('警告', '请填写完整信息!');
            return;
        }
        var url = root_path + 'Sale/Create';
        var master = fp.form.getValues();
        if (config['record']) {
            url = root_path + 'Sale/Edit/' + config['record'].data.Id;
            fp.form.updateRecord(config['record']);
            master = config['record'].data;
        }
        var ds_temp = grid_item.getStore();
        var data_items = [];
        ds_temp.each(function (record) {
            data_items.push(record.data);
        });
        Ext.getBody().mask("processing...", "x-mask-loading");
        Ext.Ajax.request({
            method: 'POST',
            url: url,
            headers: {
                contentType: 'application/json'
            },
            jsonData: {
                sale: master,
                items: data_items
            },
            success: function (response) {
                config['onClose'](config['parentId']);
                Ext.getBody().unmask();
            },
            failure: function (form, action) {
                Ext.MessageBox.alert('warning', action.result.msg);
                Ext.getBody().unmask();
            }
        });
    };

    var cal = function () {
        var ds_temp = grid_item.getStore();
        var fee = new BigDecimal("0");
        for (var i = 0; i < ds_temp.getCount(); i++) {
            var record = ds_temp.getAt(i);
            if (record.data.Amount) {
                var mount = new BigDecimal(record.data.Amount.toString());
                fee = fee.add(mount);
            }
        }

        fp.form.findField('Amount').setValue(fee.toString());
    }

    var selectItem = function () {
        mycall('system/item/selectBatch', function () {
            var selectItemBatch = new SelectItemBatch({
                onSelect: function (recs) {
                    Ext.each(recs, function (record) {
                        var object_sale = ds_item.recordType;
                        var rec_sale = new object_sale({ ItemId: record.data.Id, ItemName: record.data.ItemName, StoreId: record.data.StoreId, StoreName: record.data.StoreName, DateProduct: record.data.DateProduct, Spec: record.data.Spec, Unit: record.data.Unit, Barcode: record.data.Barcode, ItemNo: record.data.ItemNo });
                        ds_item.add([rec_sale]);
                    });
                    //selectItem.hide();
                }
            });
            selectItemBatch.show();
        });
    }

    var buildRejectWin = function () {

        fp_reject = new Ext.form.FormPanel({
            labelAlign: 'right',
            labelWidth: 1,
            bodyStyle: 'padding:5px 5px 0',
            layout: 'form',
            defaultType: 'textfield',
            defaults: {
                width: 410
            },
            items: [{
                xtype: 'textarea',
                height: 140,
                name: 'Comments'
            }]
        });

        win_reject = new Ext.Window({
            title: 'reject comments',
            width: 450,
            height: 220,
            modal: true,
            layout: 'fit',
            items: fp_reject,
            buttons: [{
                text: 'cancel',
                handler: function () {
                    win_reject.close();
                }
            }, {
                text: 'ok',
                handler: function () {
                    reject(fp_reject.form.findField('Comments').getValue());
                    win_reject.close();
                }
            }]
        })
    }

    var buildPanel = function () {
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

        ds_client = new Ext.data.Store({
            url: root_path + 'Client/Index',
            reader: new Ext.data.JsonReader({
                totalProperty: 'TotalProperty',
                successProperty: 'Success',
                id: 'Id',
                root: 'Root',
                fields: ['Id', 'ClientName', 'Tel', 'Contact']
            })
        });

        ds_client.on('load', function (store, record, opts) {
            if (store.getCount() > 0) {
                fp.form.findField('ClientId').setValue(store.getAt(0).data.Id);
                fp.form.findField('ClientName').setValue(store.getAt(0).data.ClientName);
                ds_client_store.baseParams['client_id'] = store.getAt(0).data.Id;
                ds_client_store.load();
            }
        });

        ds_client_store = new Ext.data.Store({
            url: root_path + 'Client/ListStore',
            reader: new Ext.data.JsonReader({
                totalProperty: 'TotalProperty',
                successProperty: 'Success',
                id: 'Id',
                root: 'Root',
                fields: ['Id', 'ClientId', 'StoreName', 'Address', 'Tel', 'Contact']
            })
        });

        var columns_item = [
                new Ext.grid.RowNumberer(),
                { header: '商品编号', width: 70, dataIndex: 'ItemId' },
                { header: '商品名称', width: 320, dataIndex: 'ItemName' },
                { header: '规格', width: 70, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '仓库名称', width: 60, dataIndex: 'StoreName' },
                { header: '生产日期', width: 90, dataIndex: 'DateProduct', sortable: true, renderer: dateFormat }, 
                { header: '商品数量', width: 60, dataIndex: 'Quantity', editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 0
                })
                },
                { header: '价格', width: 60, dataIndex: 'Price', renderer: renderFloat, editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 2
                })
                },
                { header: '优惠价', width: 60, dataIndex: 'Promotion', renderer: renderFloat, editor: new Ext.form.NumberField({
                    allowBlank: true,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 2
                })
                },
                { header: '金额小计', width: 60, dataIndex: 'Amount', renderer: renderFloat },
                { header: '备注', width: 80, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }, editor: new Ext.form.TextField({
                    allowBlank: true
                })
                }
        ];

        ds_item = new Ext.data.Store({
            url: root_path + 'SaleItem/Index',
            reader: new Ext.data.JsonReader({
                totalProperty: 'TotalProperty',
                successProperty: 'Success',
                id: 'Id',
                root: 'Root',
                fields: config['item_config'].fields
            })
        });

        grid_item = new Ext.grid.EditorGridPanel({
            region: 'center',
            height: 243,
            store: ds_item,
            sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
            columnLines: true,
            columns: columns_item,
            tbar: [{
                text: '增加商品',
                iconCls: 'ico-new',
                disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                handler: function () {
                    selectItem();
                }
            }, {
                text: '删除商品',
                iconCls: 'ico-delete',
                disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                handler: function () {
                    var rec = grid_item.getSelectionModel().getSelected();
                    if (rec) {
                        ds_item.remove(rec);
                        grid_item.getView().refresh();
                        cal();
                    }
                }
            }],
            clicksToEdit: 1,
            listeners: {
                'cellclick': function (grid, rowIndex, columnIndex) {
                },
                'afteredit': function (e) {

                    if (e.field == 'Quantity' || e.field == 'Price' || e.field == 'Promotion') {
                        if (e.record.get('Promotion')) {
                            var quantity = new BigDecimal(e.record.get('Quantity').toString());
                            var promotion = new BigDecimal(e.record.get('Promotion').toString());
                            var amount = quantity.multiply(promotion);
                            e.record.set('Amount', amount.toString());
                        }
                        else if (e.record.get('Price')) {
                            var quantity = new BigDecimal(e.record.get('Quantity').toString());
                            var price = new BigDecimal(e.record.get('Price').toString());
                            var amount = quantity.multiply(price);
                            e.record.set('Amount', amount.toString());
                        }
                        cal();
                    }
                }
            },
            border: true
        });

        var model = config['edit'] ? 'Edit' : 'Add';

        fp = new Ext.form.FormPanel({
            id: model + 'Sale-panel',
            title: '<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/>' + config['title'],
            labelAlign: 'right',
            autoScroll: true,
            labelWidth: 140,
            defaultType: 'textfield',
            bodyStyle: 'background-color:#fff; padding: 0 5px 5px 0px',
            layout: 'form',
            defaults: {
                width: 800
            },
            items: [{
                xtype: 'hidden', name: 'Id'
            },
            {
                xtype: 'panel',
                cls: 'buttons-top',
                width: 1080,
                footerStyle: 'background-color: #e0e0e0;',
                buttons: [{
                    text: '退回',
                    disabled: (!config['edit'] || config['record'].data.Status != 'submitted' || (!user_role.is_manager && !user_role.is_finance)) || (config['record'].data.MgrApproved == true && user_role.is_manager && !user_role.is_finance) || (config['record'].data.FinanceApproved == true && user_role.is_finance),
                    handler: showReject
                }, {
                    text: '同意',
                    disabled: (!config['edit'] || config['record'].data.Status != 'submitted' || (!user_role.is_manager && !user_role.is_finance)) || (config['record'].data.MgrApproved == true && user_role.is_manager && !user_role.is_finance) || (config['record'].data.FinanceApproved == true && user_role.is_finance),
                    handler: pass
                }, {
                    text: '取消',
                    //disabled: config['edit'],
                    handler: cancel
                }, {
                    text: '保存',
                    disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核') && (config['record'].data.FinanceApproved != true || config['record'].data.FinanceId != login_id)),
                    handler: save
                }]
            },
            {
                xtype: 'fieldset',
                autoScroll: true,
                defaults: {
                    width: 900
                },
                width: 1080,
                bodyStyle: 'background-color: #F9F9F9;',
                items: [{
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    allowBlank: true,
                    items: [{
                        xtype: 'textfield',
                        id: t_id,
                        fieldLabel: '商家简称',
                        name: 'ClientCode',
                        allowBlank: true,
                        width: 100,
                        enableKeyEvents: true,
                        listeners: {
                            'keyup': function (text, e) {
                                fp.form.findField('ClientName').clearValue();
                                fp.form.findField('ClientName').store.baseParams.code = this.getValue();
                                fp.form.findField('ClientName').store.load();
                            }
                        }
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">商家名称：</span>',
                        width: 80
                    }, {
                        xtype: 'hidden',
                        name: 'ClientId'
                    }, {
                        xtype: 'combo',
                        name: 'ClientName',
                        valueField: 'Id',
                        displayField: 'ClientName',
                        mode: 'remote',
                        allowBlank: false,
                        store: ds_client,
                        selectOnFocus: true,
                        editable: true,
                        triggerAction: 'all',
                        loadingText: 'loading...',
                        maxLength: 64,
                        width: 350,
                        listeners: {
                            'select': function (combo, record, index) {
                                fp.form.findField('ClientId').setValue(record.data.Id);
                                ds_client_store.baseParams['client_id'] = record.data.Id;
                                ds_client_store.load();
                            },
                            'keyup': function () {
                                this.store.filter('Value', this.getRawValue(), true, false);
                            }
                        }
                    }]
                }, {
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    allowBlank: true,
                    items: [{
                        xtype: 'combo',
                        fieldLabel: '收货仓库',
                        name: 'ClientStore',
                        valueField: 'StoreName',
                        displayField: 'StoreName',
                        mode: 'remote',
                        allowBlank: false,
                        store: ds_client_store,
                        selectOnFocus: true,
                        editable: true,
                        triggerAction: 'all',
                        loadingText: 'loading...',
                        maxLength: 64,
                        width: 100,
                        listeners: {
                            'select': function (combo, record, index) {
                                fp.form.findField('Address').setValue(record.data.Address);
                                fp.form.findField('Contact').setValue(record.data.Contact);
                                fp.form.findField('Tel').setValue(record.data.Tel);
                            }
                        }
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">收货地址：</span>',
                        width: 80
                    }, {
                        xtype: 'textfield',
                        name: 'Address',
                        width: 300,
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核'))
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">收货人：</span>',
                        width: 60
                    }, {
                        xtype: 'textfield',
                        name: 'Contact',
                        width: 80,
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核'))
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">联系电话：</span>',
                        width: 80
                    }, {
                        xtype: 'textfield',
                        name: 'Tel',
                        width: 150,
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核'))
                    }
                ]
                }, {
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    allowBlank: true,
                    items: [{
                        fieldLabel: '总金额',
                        name: 'Amount',
                        xtype: 'numberfield',
                        allowBlank: true,
                        width: 100,
                        maxLength: 64,
                        readOnly: true
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">是否含税：</span>',
                        width: 80
                    }, {
                        xtype: 'combo',
                        name: 'IncludeTax',
                        mode: 'local',
                        width: 100,
                        store: new Ext.data.SimpleStore({
                            data: [['含税', '含税'], ['不含税', '不含税']],
                            fields: ['text', 'value']
                        }),
                        displayField: 'text',
                        valueField: 'value',
                        value: '含税',
                        selectOnFocus: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                        selectOnFocus: true
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">运费承担:</span>',
                        width: 80
                    }, {
                        xtype: 'combo',
                        name: 'FreightType',
                        mode: 'local',
                        width: 100,
                        store: new Ext.data.SimpleStore({
                            data: [['供应商', '供应商'], ['自付', '自付']],
                            fields: ['text', 'value']
                        }),
                        displayField: 'text',
                        valueField: 'value',
                        value: '供应商',
                        selectOnFocus: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                        selectOnFocus: true
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">运送方式:</span>',
                        width: 80
                    }, {
                        xtype: 'combo',
                        name: 'DeliverType',
                        mode: 'local',
                        width: 100,
                        store: new Ext.data.SimpleStore({
                            data: [['送货上门', '送货上门'], ['自提', '自提']],
                            fields: ['text', 'value']
                        }),
                        displayField: 'text',
                        valueField: 'value',
                        value: '送货上门',
                        selectOnFocus: true,
                        editable: false,
                        triggerAction: 'all',
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                        selectOnFocus: true
                    }
                ]
                }, {
                    fieldLabel: '备注',
                    xtype: 'textarea',
                    height: 40,
                    name: 'Remark'
                }
                ]
            }
            , {
                xtype: 'panel',
                width: 1080,
                html: '<div style="height:30px; padding: 5 0 5 10;" class="headtoolbar"><img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/><span>商品信息</span></div>'
            }
            , {
                xtype: 'fieldset',
                autoScroll: true,
                width: 1080,
                bodyStyle: 'background-color: #F9F9F9;',
                items: [grid_item]
            },
            {
                xtype: 'panel',
                cls: 'buttons-top',
                width: 1080,
                footerStyle: 'background-color: #e0e0e0;',
                buttons: [{
                    text: '退回',
                    disabled: (!config['edit'] || config['record'].data.Status != 'submitted' || (!user_role.is_manager && !user_role.is_finance)) || (config['record'].data.MgrApproved == true && user_role.is_manager && !user_role.is_finance) || (config['record'].data.FinanceApproved == true && user_role.is_finance),
                    handler: showReject
                }, {
                    text: '同意',
                    disabled: (!config['edit'] || config['record'].data.Status != 'submitted' || (!user_role.is_manager && !user_role.is_finance)) || (config['record'].data.MgrApproved == true && user_role.is_manager && !user_role.is_finance) || (config['record'].data.FinanceApproved == true && user_role.is_finance),
                    handler: pass
                }, {
                    text: '取消',
                    //disabled: config['edit'],
                    handler: cancel
                }, {
                    text: '保存',
                    disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核') && (config['record'].data.FinanceApproved != true || config['record'].data.FinanceId != login_id)),
                    handler: save
                }]
            }
            ]
        });
    };

    buildPanel();

    return {
        show: function () {
            var cardPanel = Ext.getCmp('content-panel');
            cardPanel.add(fp);
            cardPanel.layout.setActiveItem(fp);
            cardPanel.doLayout();
            if (!config['edit']) {
                fp.form.reset();

            } else {

                var record = config['record'];
                fp.form.reset();
                fp.form.loadRecord(record);
                ds_item.removeAll();
                ds_item.baseParams.sale_id = record.data.Id;
                ds_item.load({ params: { start: 0, limit: 20} });
            }

            Ext.getCmp(t_id).focus(false, 200);

        },
        hide: function () {
            config['onClose']();
        }
    }
}