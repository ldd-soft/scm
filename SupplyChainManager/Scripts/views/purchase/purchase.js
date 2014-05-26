Purchase = function (config) {
    var config = config || {};
    var fp;
    var ds_item, grid_item;
    var fp_reject, win_reject;
    var t_id = Ext.id();
    var supply_id;

    var submit = function () {
        if (config['record']) {
            Ext.Ajax.request({
                url: root_path + 'Purchase/ChangeStatus',
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
                url: root_path + 'Purchase/Reject',
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
                url: root_path + 'Purchase/Pass',
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
        var url = root_path + 'Purchase/Create';
        var master = fp.form.getValues();
        if (config['record']) {
            url = root_path + 'Purchase/Edit/' + config['record'].data.Id;
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
                purchase: master,
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
        mycall('system/item/select', function () {
            var selectItem = new SelectItem({
                onSelect: function (recs) {
                    Ext.each(recs, function (record) {
                        var object_purchase = ds_item.recordType;
                        var rec_purchase = new object_purchase({ ItemId: record.data.Id, ItemName: record.data.ItemName, Spec: record.data.Spec, Unit: record.data.Unit, Barcode: record.data.Barcode, ItemNo: record.data.ItemNo });
                        ds_item.add([rec_purchase]);
                    });
                    //selectItem.hide();
                },
                brand: fp.form.findField('Brand').getValue()
            });
            selectItem.show();
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

        ds_supply = new Ext.data.Store({
            url: root_path + 'Supply/Index',
            reader: new Ext.data.JsonReader({
                totalProperty: 'TotalProperty',
                successProperty: 'Success',
                id: 'Id',
                root: 'Root',
                fields: ['Id', 'SupplyName', 'Tel', 'Contact']
            })
        });

        ds_supply.on('load', function (store, record, opts) {
            if (store.getCount() > 0) {
                fp.form.findField('SupplyId').setValue(store.getAt(0).data.Id);
                fp.form.findField('SupplyName').setValue(store.getAt(0).data.SupplyName);
            }
        });

        var columns_item = [
                new Ext.grid.RowNumberer(),
                { header: '商品编号', width: 70, dataIndex: 'ItemId' },
                { header: '商品名称', width: 320, dataIndex: 'ItemName' },
                { header: '规格', width: 70, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '客户订单号', width: 80, dataIndex: 'PurchaseNo', editor: new Ext.form.TextField({
                    allowBlank: true
                })
                },
                { header: '商品数量', width: 70, dataIndex: 'Quantity', editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 0
                })
                },
                { header: '价格', width: 80, dataIndex: 'Price', renderer: renderFloat, editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 2
                })
                },
                { header: '优惠价', width: 80, dataIndex: 'Promotion', renderer: renderFloat, editor: new Ext.form.NumberField({
                    allowBlank: true,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 2
                })
                },
                { header: '金额小计', width: 80, dataIndex: 'Amount', renderer: renderFloat },
                { header: '备注', width: 120, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }, editor: new Ext.form.TextField({
                    allowBlank: true
                })
                }
        ];

        ds_item = new Ext.data.Store({
            url: root_path + 'PurchaseItem/Index',
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
                        else {
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
            id: model + 'Purchase-panel',
            title: '<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/>' + config['title'],
            labelAlign: 'right',
            autoScroll: true,
            labelWidth: 140,
            defaultType: 'textfield',
            bodyStyle: 'background-color:#fff; padding: 0 5px 5px 0px',
            layout: 'form',
            defaults: {
                width: 500
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
                    width: 500
                },
                width: 1080,
                bodyStyle: 'background-color: #F9F9F9;',
                items: [{
                    xtype: 'combo',
                    id: t_id,
                    fieldLabel: '品牌',
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
                    width: 147,
                    listeners: {
                        'select': function (combo, record, index) {
                            fp.form.findField('SupplyName').clearValue();
                            fp.form.findField('SupplyName').store.baseParams.brand = record.data.Value;
                            fp.form.findField('SupplyName').store.reload();
                            selectItem();
                        },
                        'keyup': function () {
                            this.store.filter('Value', this.getRawValue(), true, false);
                        }
                    }
                }, {
                    xtype: 'hidden',
                    name: 'SupplyId'
                }, {
                    xtype: 'combo',
                    fieldLabel: '商家名称',
                    name: 'SupplyName',
                    valueField: 'Id',
                    displayField: 'SupplyName',
                    mode: 'local',
                    allowBlank: false,
                    store: ds_supply,
                    selectOnFocus: true,
                    editable: true,
                    triggerAction: 'all',
                    loadingText: 'loading...',
                    maxLength: 64,
                    listeners: {
                        'select': function (combo, record, index) {
                            fp.form.findField('SupplyId').setValue(record.data.Id);
                        },
                        'keyup': function () {
                            this.store.filter('Value', this.getRawValue(), true, false);
                        }
                    }
                }, {
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    allowBlank: true,
                    items: [{
                        xtype: 'combo',
                        fieldLabel: '是否含税',
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
                    fieldLabel: '总金额',
                    name: 'Amount',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147,
                    maxLength: 64,
                    readOnly: true
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
                ds_item.baseParams.purchase_id = record.data.Id;
                ds_item.load({ params: { start: 0, limit: 20} });
            }

            Ext.getCmp(t_id).focus(false, 200);

        },
        hide: function () {
            config['onClose']();
        }
    }
}