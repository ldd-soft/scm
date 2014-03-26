ClientItem = function (config) {
    var config = config || {};
    var fp;
    var t_id = Ext.id();

    var cancel = function () {
        config['onClose'](config['parentId']);
    };

    var save = function (btn) {
        if (fp.form.isValid() == false) {
            Ext.MessageBox.alert('提醒', '请输入完整信息!');
            return;
        }
        var url = root_path + 'ClientItem/Create';
        if (config['record']) {
            url = root_path + 'ClientItem/Edit/' + config['record'].data.Id;
        }
        fp.form.submit({
            url: url,
            success: function () {
                config['onClose'](config['parentId']);
                if (config['ds']) {
                    config['ds'].reload();
                }
            },
            failure: function (form, action) {
                Ext.MessageBox.alert('提醒', action.result.msg);
            }
        })
    };

    var model = config['edit'] ? 'Edit' : 'Add';

    var buildPanel = function () {
        fp = new Ext.form.FormPanel({
            id: model + 'ClientItem-panel',
            title: '<img class="HeadingColorTag2" border="0" src="' + root_path + 'content/Images/HeadingColorTag_Theme01.png"/>' + config['title'],
            labelAlign: 'right',
            labelWidth: 240,
            defaultType: 'textfield',
            bodyStyle: 'background-color:#fff; padding: 0 5px 5px 0px',
            layout: 'form',
            defaults: {
                width: 500
            },
            autoScroll: true,
            keys: [{
                key: Ext.EventObject.ENTER,
                scope: this,
                handler: function (o, oEvent, e) {
                    var src = oEvent.srcElement ? oEvent.srcElement : oEvent.target;
                    if (oEvent.keyCode == 13 && src.type != 'button' && src.type != 'submit' && src.type != 'reset' && src.type != 'textarea' && src.type != '')
                        if (Ext.isIE) {
                            window.event.keyCode = Ext.EventObject.TAB;
                        } else {
                            var b = false;
                            Ext.iterate(fp.form.getValues(), function (key, value) {
                                if (b) {
                                    var f = fp.form.findField(key);
                                    if (f.xtype === 'hidden' || f.xtype === 'displayfield') {
                                        b = true;
                                    } else {
                                        f.focus();
                                        b = false;
                                    }
                                }
                                if (src.name == '') {
                                    src.name = Ext.getCmp(src.id).getName();
                                }
                                if (key === src.name) {
                                    b = true;
                                }
                            }, this);
                        }
                }
            }],
            items: [{
                xtype: 'hidden',
                name: 'Id'
            }, 
            {
                xtype: 'panel',
                cls: 'buttons-top',
                width: 900,
                footerStyle: 'background-color: #e0e0e0;',
                buttons: [{
                    text: '取消',
                    handler: cancel
                }, {
                    text: '保存',
                    handler: save
                }]
            },
            {
                xtype: 'fieldset',
                autoScroll: true,
                defaults: {
                    width: 500
                },
                width: 900,
                bodyStyle: 'background-color: #F9F9F9;',
                items: [{
                    xtype: 'hidden',
                    name: 'ItemId',
                    value: config['item_id']
                }, {
                    fieldLabel: '货品名称',
                    name: 'ItemName',
                    id: t_id,
                    xtype: 'textfield',
                    maxLength: 64,
                    readOnly: true,
                    allowBlank: false,
                    value: config['item_name']
                }, {
                    xtype: 'hidden',
                    name: 'ClientId'
                }, {
                    xtype: 'trigger',
                    fieldLabel: '客户名称',
                    name: 'ClientName',
                    maxLength: 255,
                    triggerClass: 'x-form-my-trigger',
                    editable: false,
                    onTriggerClick: function () {
                        mycall('system/client/select', function () {
                            var selectClient = new SelectClient({
                                onSelect: function (recs) {
                                    fp.form.findField('ClientId').setValue(recs[0].data.Id);
                                    fp.form.findField('ClientName').setValue(recs[0].data.ClientName);
                                    selectClient.hide();
                                },
                                is_select_single: true
                            });
                            selectClient.show();
                        });
                    },
                    allowBlank: false
                }, {
                    fieldLabel: '市场价',
                    name: 'MarketPrice',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '进价',
                    name: 'CostPrice',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '销售价',
                    name: 'SalePrice',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '包退天数',
                    name: 'ReturnDays',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '包换天数',
                    name: 'ExchangeDays',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '包修天数',
                    name: 'RepairDays',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '最小订货数量',
                    name: 'MinOrderCount',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '销售类型',
                    name: 'SaleType',
                    xtype: 'textfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '备货天数',
                    name: 'PrepareDays',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '供应商类别',
                    name: 'SupplyType',
                    xtype: 'textfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '税率',
                    name: 'TaxRate',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    xtype: 'hidden',
                    name: 'SupplyId'
                }, {
                    xtype: 'trigger',
                    fieldLabel: '供应商名称',
                    name: 'SupplyName',
                    maxLength: 255,
                    triggerClass: 'x-form-my-trigger',
                    editable: false,
                    onTriggerClick: function () {
                        mycall('system/supply/select', function () {
                            var selectSupply = new SelectSupply({
                                onSelect: function (recs) {
                                    fp.form.findField('SupplyId').setValue(recs[0].data.Id);
                                    fp.form.findField('SupplyName').setValue(recs[0].data.SupplyName);
                                    selectSupply.hide();
                                },
                                is_select_single: true
                            });
                            selectSupply.show();
                        });
                    },
                    allowBlank: true
                }
                ]
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
            var name = fp.id.substring(0, fp.id.indexOf('-'));
            var node = tree.getNodeById(name);
            if (node) {
                tree.getSelectionModel().select(node);
            }
            fp.form.reset();

            if (config['edit']) {
                var record = config['record'];
                fp.form.loadRecord(record);
            }
            Ext.getCmp(t_id).focus(false, 200);

        },
        hide: function () {
            config['onClose']();
        }
    }
}