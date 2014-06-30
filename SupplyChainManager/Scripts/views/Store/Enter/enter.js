Enter = function (config) {
    var config = config || {};
    var fp;
    var ds_item, grid_item;
    var fp_reject, win_reject;
    var t_id = Ext.id();
    var client_id;

    var cancel = function () {
        config['onClose'](config['parentId']);
    };

    var save = function (btn) {
        if (fp.form.isValid() == false) {
            Ext.MessageBox.alert('警告', '请填写完整信息!');
            return;
        }
        var url = root_path + 'Enter/Create';
        var master = fp.form.getValues();
        if (config['record']) {
            url = root_path + 'Enter/Edit/' + config['record'].data.Id;
            fp.form.updateRecord(config['record']);
            master = config['record'].data;
        }
        var ds_temp = grid_item.getStore();
        var data_items = [];
        var is_quantity_valid = true, is_date_product_valid = true, is_dup_record = false;
        var rec_temp;
        ds_temp.each(function (record) {
            if (!record.data.QuantityReal) {
                is_quantity_valid = false;
            }
            if (!record.data.DateProduct) {
                is_date_product_valid = false;
            }
            if (rec_temp && rec_temp.data.DateProduct && record.data.DateProduct && rec_temp.data.ItemId == record.data.ItemId && rec_temp.data.DateProduct.getTime() == record.data.DateProduct.getTime()) {
                is_dup_record = true;
            }
            data_items.push(record.data);
            rec_temp = record;
        });
        if (!is_quantity_valid) {
            Ext.MessageBox.alert('警告', '请填写实收数!');
            return;
        }
        if (!is_date_product_valid) {
            Ext.MessageBox.alert('警告', '请填写生产日期!');
            return;
        }
        if (is_dup_record) {
            Ext.MessageBox.alert('警告', '同一种商品不能有相同的生产日期!');
            return;
        }
        Ext.getBody().mask("processing...", "x-mask-loading");
        Ext.Ajax.request({
            method: 'POST',
            url: url,
            headers: {
                contentType: 'application/json'
            },
            jsonData: {
                enter: master,
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
        var supply_id = fp.form.findField('RecordId').getValue();
        var store_id = fp.form.findField('StoreId').getValue();
        if (!supply_id) {
            Ext.MessageBox.alert('提示', '请先选择商家!');
            return;
        }
        if (!store_id) {
            Ext.MessageBox.alert('提示', '请先选择入库仓库!');
            return;
        }
        mycall('store/enter/selectPurchase', function () {
            var selectPurchase = new SelectPurchase({
                onSelect: function (rec) {
                    ds_item.removeAll();
                    fp.form.findField('PurchaseId').setValue(rec.data.Id);
                    Ext.each(rec.data.PurchaseItem, function (record) {
                        if (ds_item.find('ItemId', record.ItemId) == -1) {
                            var object = ds_item.recordType;
                            var store_id = fp.form.findField('StoreId').getValue();
                            var store_name = fp.form.findField('StoreName').getValue();
                            var rec = new object({ TableName: 'PurchaseItem', RecordId: record.Id, ItemId: record.ItemId, ItemName: record.ItemName, StoreId: store_id, StoreName: store_name, QuantityNeed: record.Quantity - (record.QuantityReal == null ? 0 : record.QuantityReal), Price: record.Promotion == null ? record.Price : record.Promotion, Spec: record.Spec, Unit: record.Unit, Barcode: record.Barcode, ItemNo: record.ItemNo });
                            ds_item.add([rec]);
                        }
                    });
                    //selectItem.hide();
                },
                type: fp.form.findField('EnterType').getValue(),
                supply_id: supply_id,
                store_id: store_id
            });
            selectPurchase.show();
        });
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

        var ds_company = new Ext.data.Store({
            url: root_path + 'Client/ListCompany',
            reader: new Ext.data.JsonReader({
                totalProperty: 'TotalProperty',
                successProperty: 'Success',
                id: 'Id',
                root: 'Root',
                fields: ['Id', 'Name']
            })
        });

        ds_company.on('load', function (store, record, opts) {
            if (store.getCount() > 0) {
                fp.form.findField('RecordId').setValue(store.getAt(0).data.Id);
                fp.form.findField('RecordName').setValue(store.getAt(0).data.Name);
            }
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

        var columns_item = [
                new Ext.grid.RowNumberer(),
                { header: '商品编号', width: 70, dataIndex: 'ItemId' },
                { header: '商品名称', width: 320, dataIndex: 'ItemName' },
                { header: '规格', width: 70, dataIndex: 'Spec' },
                { header: '单位', width: 50, dataIndex: 'Unit' },
                { header: '仓库名称', width: 70, dataIndex: 'StoreName' },
                { header: '应收数量', width: 70, dataIndex: 'QuantityNeed' },
                { header: '实收数量', width: 70, dataIndex: 'QuantityReal', editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    maxValue: 100000,
                    decimalPrecision: 0
                })
                },
                { header: '生产日期', width: 100, dataIndex: 'DateProduct', sortable: true, renderer: dateFormat, editor: new Ext.form.DateField({
                    allowBlank: false
                })
                },
                { header: '缺货数量', width: 70, dataIndex: 'QuantityMiss' },
                { header: '缺货处理', width: 80, dataIndex: 'MissProcess', editor: new Ext.form.ComboBox({
                    mode: 'local',
                    store: new Ext.data.SimpleStore({
                        data: [['入库完成', '入库完成'], ['继续等待', '继续等待']],
                        fields: ['text', 'value']
                    }),
                    displayField: 'text',
                    valueField: 'value',
                    value: '入库完成',
                    selectOnFocus: true,
                    editable: false,
                    triggerAction: 'all'
                })
                },
                { header: '备注', width: 80, dataIndex: 'Remark', renderer: function (value, metadata) {
                    metadata.attr = 'style="white-space:normal;"';
                    return value;
                }, editor: new Ext.form.TextField({
                    allowBlank: true
                })
                }
        ];

        ds_item = new Ext.data.Store({
            url: root_path + 'EnterItem/Index',
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
                    }
                }
            }, {
                text: '拆分批次',
                iconCls: 'ico-classify',
                disabled: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                handler: function () {
                    var rec = grid_item.getSelectionModel().getSelected();
                    if (rec) {
                        if (!rec.data.QuantityReal) {
                            Ext.MessageBox.alert('提示', '请先录入本批次实收数量!');
                            return;
                        }
                        var object = ds_item.recordType;
                        var rowIndex = ds_item.indexOf(rec);
                        var new_rec = new object({ TableName: 'PurchaseItem', RecordId: rec.data.RecordId, ItemId: rec.data.ItemId, ItemName: rec.data.ItemName, StoreId: rec.data.StoreId, StoreName: rec.data.StoreName, QuantityNeed: rec.data.QuantityNeed - rec.data.QuantityReal, Price: rec.data.Price, Spec: rec.data.Spec, Unit: rec.data.Unit, Barcode: rec.data.Barcode, ItemNo: rec.data.ItemNo });
                        ds_item.insert(rowIndex + 1, new_rec);
                        rec.set('QuantityNeed', rec.data.QuantityReal);
                        rec.set('QuantityMiss', 0);
                        ds_item.commitChanges();
                    }
                }
            }],
            clicksToEdit: 1,
            listeners: {
                'cellclick': function (grid, rowIndex, columnIndex) {
                },
                'afteredit': function (e) {
                    if (e.field == 'QuantityReal') {
                        var quantityNeed = parseInt(e.record.get('QuantityNeed'));
                        var quantityReal = parseInt(e.record.get('QuantityReal'));
                        var quantityMiss = quantityNeed - quantityReal;
                        if (quantityNeed < quantityReal) {
                            Ext.MessageBox.alert('提示', '实收数量不能超过应收数量!');
                            e.record.set('QuantityReal', 0);
                            return;
                        }
                        e.record.set('QuantityMiss', quantityMiss);
                    }
                }
            },
            border: true
        });

        var model = config['edit'] ? 'Edit' : 'Add';

        fp = new Ext.form.FormPanel({
            id: model + 'Enter-panel',
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
                        xtype: 'combo',
                        name: 'EnterType',
                        fieldLabel: '入库类型',
                        mode: 'local',
                        width: 100,
                        store: new Ext.data.SimpleStore({
                            data: [['采购入库', '采购入库'], ['销售退货入库', '销售退货入库']],
                            fields: ['text', 'value']
                        }),
                        displayField: 'text',
                        valueField: 'value',
                        value: '采购入库',
                        selectOnFocus: true,
                        editable: false,
                        readOnly: true,
                        triggerAction: 'all',
                        allowBlank: false,
                        //readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核')),
                        selectOnFocus: true,
                        listeners: {
                            'select': function (combo, record, index) {
                                var type = (index == 0 ? 'Supply' : 'Client');
                                fp.form.findField('TableName').setValue(type);
                            }
                        }
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">商家简称：</span>',
                        width: 80
                    }, {
                        xtype: 'textfield',
                        id: t_id,
                        name: 'CompanyCode',
                        allowBlank: true,
                        width: 100,
                        enableKeyEvents: true,
                        listeners: {
                            'keyup': function (text, e) {
                                fp.form.findField('RecordName').clearValue();
                                fp.form.findField('RecordName').store.baseParams.type = (fp.form.findField('EnterType').getValue() == '采购入库' ? 'supply' : 'client');
                                fp.form.findField('RecordName').store.baseParams.code = this.getValue();
                                fp.form.findField('RecordName').store.load();
                            }
                        }
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">商家名称：</span>',
                        width: 80
                    }, {
                        xtype: 'hidden',
                        name: 'TableName',
                        value: 'Supply'
                    }, {
                        xtype: 'hidden',
                        name: 'RecordId'
                    }, {
                        xtype: 'combo',
                        name: 'RecordName',
                        valueField: 'Id',
                        displayField: 'Name',
                        mode: 'remote',
                        allowBlank: false,
                        store: ds_company,
                        selectOnFocus: true,
                        editable: true,
                        triggerAction: 'all',
                        loadingText: 'loading...',
                        maxLength: 64,
                        width: 350,
                        listeners: {
                            'select': function (combo, record, index) {
                                fp.form.findField('RecordId').setValue(record.data.Id);
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
                        xtype: 'hidden',
                        name: 'StoreId'
                    }, {
                        xtype: 'combo',
                        fieldLabel: '入库仓库',
                        name: 'StoreName',
                        valueField: 'Value',
                        displayField: 'Value',
                        mode: 'remote',
                        allowBlank: false,
                        store: ds_store,
                        selectOnFocus: true,
                        editable: true,
                        triggerAction: 'all',
                        loadingText: 'loading...',
                        maxLength: 64,
                        width: 100,
                        listeners: {
                            'select': function (combo, record, index) {
                                fp.form.findField('StoreId').setValue(record.data.Key);
                                var ds_temp = grid_item.getStore();
                                for (var i = 0; i < ds_temp.getCount(); i++) {
                                    var row = ds_temp.getAt(i);
                                    row.data.StoreId = record.data.Key;
                                    row.data.StoreName = record.data.Value;
                                    row.commit();
                                }
                            }
                        }
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">物流名称：</span>',
                        width: 80
                    }, {
                        xtype: 'textfield',
                        name: 'DeliverName',
                        width: 270,
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核'))
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">物流联系人：</span>',
                        width: 95
                    }, {
                        xtype: 'textfield',
                        name: 'DeliverContact',
                        width: 80,
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核'))
                    }, {
                        xtype: 'displayfield',
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">物流联系电话：</span>',
                        width: 105
                    }, {
                        xtype: 'textfield',
                        name: 'DeliverTel',
                        width: 130,
                        allowBlank: true,
                        readOnly: (config['edit'] && (config['record'].data.AddId != login_id || config['record'].data.Status != '待审核'))
                    }
                ]
                }, {
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    allowBlank: true,
                    items: [{
                        xtype: 'combo',
                        fieldLabel: '运费支付方式',
                        name: 'DeliverPayType',
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
                        value: '<span style="width: 80px;text-align: right;font-size: 13px;font-weight: bold;">运费金额：</span>',
                        width: 80
                    }, {
                        name: 'DeliverAmount',
                        xtype: 'numberfield',
                        allowBlank: true,
                        width: 100,
                        maxLength: 64
                    }
                ]
                }, {
                    fieldLabel: '采购单号',
                    xtype: 'textfield',
                    readOnly: true,
                    width: 140,
                    name: 'PurchaseId'
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
                ds_item.baseParams.enter_id = record.data.Id;
                ds_item.load({ params: { start: 0, limit: 20} });
            }

            Ext.getCmp(t_id).focus(false, 200);

        },
        hide: function () {
            config['onClose']();
        }
    }
}