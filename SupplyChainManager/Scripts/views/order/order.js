Order = function (config) {
    var config = config || {};
    var fp;
    var ds_purchase, grid_purchase;
    var ds_sale, grid_sale;
    var fp_item, win_item;
    var fp_reject, win_reject;
    var t_id = Ext.id();
    var t_id2 = Ext.id();
    var supply_id, client_id;

    var submit = function () {
        if (config['record']) {
            Ext.Ajax.request({
                url: root_path + 'Order/ChangeStatus',
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
                url: root_path + 'Order/Reject',
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
                url: root_path + 'Order/Pass',
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
        var url = root_path + 'Order/Create';
        if (config['record']) {
            url = root_path + 'Order/Edit/' + config['record'].data.Id;
        }
        var orders = fp.form.getValues();
        var ds_temp = grid_purchase.getStore();
        var data_purchase = [];
        ds_temp.each(function (record) {
            data_purchase.push(record.data);
        });
        var data_sale = [];
        if (client_id) {
            ds_temp = grid_sale.getStore();
            ds_temp.each(function (record) {
                data_sale.push(record.data);
            });
        }
        Ext.getBody().mask("processing...", "x-mask-loading");
        Ext.Ajax.request({
            method: 'POST',
            url: url,
            headers: {
                contentType: 'application/json'
            },
            jsonData: {
                orders: orders,
                purchase: data_purchase,
                sale: data_sale
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

    var buildItemWin = function () {
        var ds_unit = new Ext.data.Store({
            url: root_path + 'Dictionary/List',
            baseParams: { 'module': 'item', 'field': 'unit' },
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
            baseParams: { 'module': '仓库', 'table_name': 'client', 'record_id': client_id },
            reader: new Ext.data.JsonReader(
            { totalProperty: 'TotalProperty', successProperty: 'Success', idProperty: 'Id', root: 'Root' },
            [{ name: 'Id', type: 'int' },
            { name: 'Key', type: 'string' },
            { name: 'Value', type: 'string' }
            ]
        )
        });

        fp_item = new Ext.form.FormPanel({
            labelAlign: 'right',
            labelWidth: 125,
            bodyStyle: 'padding:5px 5px 0',
            layout: 'form',
            defaultType: 'textfield',
            defaults: {
                width: 270
            },
            items: [{
                xtype: 'hidden',
                name: 'Id'
            }, {
                xtype: 'textfield',
                fieldLabel: '采购单号',
                id: t_id2,
                name: 'PoNo'
            }, {
                xtype: 'hidden',
                name: 'ItemId'
            }, {
                xtype: 'trigger',
                fieldLabel: '商品名称',
                name: 'ItemName',
                maxLength: 255,
                triggerClass: 'x-form-my-trigger',
                editable: false,
                onTriggerClick: function () {
                    mycall('system/item/select', function () {
                        var selectItem = new SelectItem({
                            onSelect: function (recs) {
                                fp_item.form.findField('ItemId').setValue(recs[0].data.Id);
                                fp_item.form.findField('ItemName').setValue(recs[0].data.ItemName);
                                fp_item.form.findField('ItemNo').setValue(recs[0].data.ItemCode);
                                fp_item.form.findField('Barcode').setValue(recs[0].data.BarCode);
                                fp_item.form.findField('Spec').setValue(recs[0].data.Specification);
                                selectItem.hide();
                            },
                            supply_id: fp.form.findField('SupplyId').getValue()
                        });
                        selectItem.show();
                    });
                },
                allowBlank: true
            }, {
                xtype: 'textfield',
                fieldLabel: '商品编码',
                name: 'ItemNo'
            }, {
                xtype: 'textfield',
                fieldLabel: '条形码',
                name: 'Barcode'
            }, {
                xtype: 'textfield',
                fieldLabel: '规格',
                name: 'Spec'
            }, {
                xtype: 'combo',
                fieldLabel: '计量单位',
                name: 'Unit',
                valueField: 'Value',
                displayField: 'Value',
                mode: 'remote',
                allowBlank: true,
                store: ds_unit,
                selectOnFocus: true,
                editable: false,
                triggerAction: 'all',
                loadingText: 'loading...',
                maxLength: 64,
                width: 147
            }, {
                fieldLabel: '数量',
                name: 'Quantity',
                xtype: 'numberfield',
                allowBlank: false,
                width: 147,
                maxLength: 64,
                listeners: {
                    'change': function (text, newValue, oldValue) {
                        var amount = newValue * fp_item.form.findField('PurchasePrice').getValue();
                        fp_item.form.findField('PurchaseAmount').setValue(amount);
                        amount = newValue * fp_item.form.findField('SalePrice').getValue();
                        fp_item.form.findField('SaleAmount').setValue(amount);
                    }
                }
            }, {
                fieldLabel: '采购单价',
                name: 'PurchasePrice',
                xtype: 'numberfield',
                allowBlank: false,
                width: 147,
                maxLength: 64,
                listeners: {
                    'change': function (text, newValue, oldValue) {
                        var amount = newValue * fp_item.form.findField('Quantity').getValue();
                        fp_item.form.findField('PurchaseAmount').setValue(amount);
                    }
                }
            }, {
                fieldLabel: '金额',
                name: 'PurchaseAmount',
                xtype: 'numberfield',
                allowBlank: false,
                width: 147,
                maxLength: 64,
                readOnly: true
            }, {
                xtype: 'hidden',
                name: 'StoreId'
            }, {
                xtype: 'combo',
                fieldLabel: '客户仓库',
                name: 'StoreName',
                valueField: 'Value',
                displayField: 'Value',
                mode: 'remote',
                allowBlank: true,
                store: ds_store,
                selectOnFocus: true,
                editable: false,
                triggerAction: 'all',
                loadingText: 'loading...',
                maxLength: 64,
                width: 147,
                listeners: {
                    'select': function (combo, record, index) {
                        var values = record.data.Key.split('/');                        
                        fp_item.form.findField('Address').setValue(values[0]);
                        fp_item.form.findField('Contact').setValue(values[1]);
                        fp_item.form.findField('Tel').setValue(values[2]);
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: '送货地址',
                name: 'Address'
            }, {
                xtype: 'textfield',
                fieldLabel: '联系人',
                name: 'Contact'
            }, {
                xtype: 'textfield',
                fieldLabel: '联系电话',
                name: 'Tel'
            }, {
                fieldLabel: '销售单价',
                name: 'SalePrice',
                xtype: 'numberfield',
                allowBlank: true,
                width: 147,
                maxLength: 64,
                listeners: {
                    'change': function (text, newValue, oldValue) {
                        var amount = newValue * fp_item.form.findField('Quantity').getValue();
                        fp_item.form.findField('SaleAmount').setValue(amount);
                    }
                }
            }, {
                fieldLabel: '销售金额',
                name: 'SaleAmount',
                xtype: 'numberfield',
                allowBlank: true,
                width: 147,
                maxLength: 64,
                readOnly: true
            }, {
                fieldLabel: '备注',
                xtype: 'textfield',
                name: 'Remark'
            }]
        });
        win_item = new Ext.Window({
            title: '添加分录',
            width: 550,
            height: 500,
            modal: true,
            layout: 'fit',
            items: fp_item,
            buttons: [{
                text: '取消',
                handler: function () {
                    win_item.close();
                }
            }, {
                text: '确定',
                handler: function () {
                    var object_purchase = ds_purchase.recordType;
                    var rec_purchase = new object_purchase(fp_item.form.getValues());
                    ds_purchase.add([rec_purchase]);
                    if (client_id) {
                        var object_sale = ds_sale.recordType;
                        var rec_sale = new object_sale(fp_item.form.getValues());
                        ds_sale.add([rec_sale]);
                    }
                    win_item.close();
                }
            }]
        })
    }

    var cal = function () {
        var ds_temp = grid_purchase.getStore();
        var fee = 0;
        for (var i = 0; i < ds_temp.getCount(); i++) {
            var record = ds_temp.getAt(i);
            fee += record.data.Amount;
        }
        fp.form.findField('Amount').setValue(fee);
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
        var purchase_columns = [
                { header: 'po单号', width: 70, dataIndex: 'PoNo' },
                { header: '商品名称', width: 230, dataIndex: 'ItemName' },
                { header: '商品编码', width: 60, dataIndex: 'ItemNo' },
                { header: '条形码', width: 70, dataIndex: 'Barcode' },
                { header: '规格', width: 50, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '数量', width: 50, dataIndex: 'Quantity', renderer: renderFloat },
                { header: '单价', width: 50, dataIndex: 'PurchasePrice', renderer: renderFloat },
                { header: '折扣', width: 50, dataIndex: 'PurchaseDiscount', renderer: renderFloat },
                { header: '金额', width: 90, dataIndex: 'PurchaseAmount', renderer: renderFloat },
                { header: '备注', width: 120, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }
                }
        ];

        var sale_columns = [
                { header: 'po单号', width: 70, dataIndex: 'PoNo' },
                { header: '仓库名称', width: 70, dataIndex: 'StoreName' },
                { header: '商品名称', width: 150, dataIndex: 'ItemName' },
                { header: '商品编码', width: 60, dataIndex: 'ItemNo' },
                { header: '条形码', width: 70, dataIndex: 'Barcode' },
                { header: '规格', width: 50, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '数量', width: 50, dataIndex: 'Quantity', renderer: renderFloat },
                { header: '单价', width: 50, dataIndex: 'SalePrice', renderer: renderFloat },
                { header: '折扣', width: 50, dataIndex: 'SaleDiscount', renderer: renderFloat },
                { header: '金额', width: 70, dataIndex: 'SaleAmount', renderer: renderFloat },
                { header: '送货地址', width: 90, dataIndex: 'Address' },
                { header: '联系人', width: 60, dataIndex: 'Contact' },
                { header: '联系电话', width: 90, dataIndex: 'Tel' },
                { header: '备注', width: 90, dataIndex: 'Remark', renderer: function (value, metadata) {
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

        grid_purchase = new Ext.grid.GridPanel({
            region: 'center',
            height: 243,
            store: ds_purchase,
            sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
            columnLines: true,
            columns: purchase_columns,
            tbar: [{
                text: '增加分录',
                iconCls: 'ico-new',
                disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                handler: function () {
                    buildItemWin();
                    win_item.show();
                    Ext.getCmp(t_id2).focus(false, 200);
                }
            }, {
                text: '删除分录',
                iconCls: 'ico-delete',
                disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                handler: function () {
                    var rec = grid_purchase.getSelectionModel().getSelected();
                    if (rec) {
                        ds_purchase.remove(rec);
                        grid_purchase.getView().refresh();
                    }
                }
            }],
            clicksToEdit: 1,
            listeners: {
                'cellclick': function (grid, rowIndex, columnIndex) {
                }
            },
            border: true
        });

        grid_sale = new Ext.grid.GridPanel({
            region: 'center',
            height: 243,
            store: ds_sale,
            sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
            columnLines: true,
            columns: sale_columns,
            listeners: {
                'cellclick': function (grid, rowIndex, columnIndex) {
                }
            },
            border: true
        });

        var model = config['edit'] ? 'Edit' : 'Add';

        fp = new Ext.form.FormPanel({
            id: model + 'Order-panel',
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
                    xtype: 'hidden',
                    name: 'Status'
                }, {
                    xtype: 'hidden',
                    name: 'SupplyId'
                }, {
                    xtype: 'trigger',
                    id: t_id,
                    fieldLabel: '供应商',
                    name: 'SupplyName',
                    triggerClass: 'x-form-my-trigger',
                    editable: false,
                    allowBlank: false,
                    readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                    onTriggerClick: function () {
                        mycall('system/supply/select', function () {
                            var selectSupply = new SelectSupply({
                                onSelect: function (recs) {
                                    fp.form.findField('SupplyId').setValue(recs[0].data.Id);
                                    fp.form.findField('SupplyName').setValue(recs[0].data.SupplyName);
                                    supply_id = recs[0].data.Id;
                                    selectSupply.hide();
                                }
                            });
                            selectSupply.show();
                        });
                    }
                }, {
                    xtype: 'hidden',
                    name: 'ClientId'
                }, {
                    xtype: 'trigger',
                    fieldLabel: '客户',
                    name: 'ClientName',
                    triggerClass: 'x-form-my-trigger',
                    editable: false,
                    allowBlank: true,
                    readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                    onTriggerClick: function () {
                        mycall('system/client/select', function () {
                            var selectClient = new SelectClient({
                                onSelect: function (recs) {
                                    fp.form.findField('ClientId').setValue(recs[0].data.Id);
                                    fp.form.findField('ClientName').setValue(recs[0].data.ClientName);
                                    client_id = recs[0].data.Id;
                                    selectClient.hide();
                                }
                            });
                            selectClient.show();
                        });
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: '订单日期',
                    name: 'DateOrder',
                    value: new Date(),
                    allowBlank: false,
                    readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                    format: 'Y-m-d',
                    width: 200
                }, {
                    xtype: 'combo',
                    fieldLabel: '发货方式',
                    name: 'SupplyType',
                    mode: 'local',
                    width: 100,
                    store: new Ext.data.SimpleStore({
                        data: [['直送', '直送'], ['自提', '自提']],
                        fields: ['text', 'value']
                    }),
                    displayField: 'text',
                    valueField: 'value',
                    value: '直送',
                    selectOnFocus: true,
                    editable: false,
                    triggerAction: 'all',
                    allowBlank: true,
                    readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                    selectOnFocus: true
                }
                ]
            }
            , {
                xtype: 'panel',
                width: 1080,
                html: '<div style="height:30px; padding: 5 0 5 10;" class="headtoolbar"><img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/><span>采购信息</span></div>'
            }
            , {
                xtype: 'fieldset',
                autoScroll: true,
                width: 1080,
                bodyStyle: 'background-color: #F9F9F9;',
                items: [grid_purchase]
            },
            {
                xtype: 'panel',
                width: 1080,
                html: '<div style="height:30px; padding: 5 0 5 10;" class="headtoolbar"><img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/><span>销售信息</span></div>'
            }
            , {
                xtype: 'fieldset',
                autoScroll: true,
                width: 1080,
                bodyStyle: 'background-color: #F9F9F9;',
                items: [grid_sale]
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
                ds_purchase.removeAll();
                ds_purchase.baseParams.purchase_order_id = record.data.Id;
                ds_purchase.load({ params: { start: 0, limit: 20} });
            }

            Ext.getCmp(t_id).focus(false, 200);

        },
        hide: function () {
            config['onClose']();
        }
    }
}