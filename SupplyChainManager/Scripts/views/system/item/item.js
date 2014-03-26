Item = function (config) {
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
        var url = root_path + 'Item/Create';
        if (config['record']) {
            url = root_path + 'Item/Edit/' + config['record'].data.Id;
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
        var ds_item_type = new Ext.data.Store({
            url: root_path + 'Dictionary/List',
            baseParams: { 'module': 'item', 'field': 'type' },
            reader: new Ext.data.JsonReader(
            { totalProperty: 'TotalProperty', successProperty: 'Success', idProperty: 'Id', root: 'Root' },
            [{ name: 'Id', type: 'int' },
            { name: 'Key', type: 'string' },
            { name: 'Value', type: 'string' }
            ]
        )
        });

        var ds_item_brand = new Ext.data.Store({
            url: root_path + 'Dictionary/List',
            baseParams: { 'module': 'item', 'field': 'brand' },
            reader: new Ext.data.JsonReader(
            { totalProperty: 'TotalProperty', successProperty: 'Success', idProperty: 'Id', root: 'Root' },
            [{ name: 'Id', type: 'int' },
            { name: 'Key', type: 'string' },
            { name: 'Value', type: 'string' }
            ]
        )
        });
        
        var ds_item_unit = new Ext.data.Store({
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

        fp = new Ext.form.FormPanel({
            id: model + 'Item-panel',
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
                    fieldLabel: '货品名称',
                    name: 'ItemName',
                    id: t_id,
                    xtype: 'textfield',
                    maxLength: 64,
                    allowBlank: false
                }, {
                    fieldLabel: '货品编码',
                    name: 'ItemCode',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    xtype: 'combo',
                    fieldLabel: '货品类别',
                    name: 'ItemType',
                    valueField: 'Value',
                    displayField: 'Value',
                    mode: 'remote',
                    allowBlank: true,
                    store: ds_item_type,
                    selectOnFocus: true,
                    editable: false,
                    triggerAction: 'all',
                    loadingText: 'loading...',
                    maxLength: 64,
                    width: 147
                }, {
                    xtype: 'combo',
                    fieldLabel: '品牌',
                    name: 'Brand',
                    valueField: 'Value',
                    displayField: 'Value',
                    mode: 'remote',
                    allowBlank: true,
                    store: ds_item_brand,
                    selectOnFocus: true,
                    editable: false,
                    triggerAction: 'all',
                    loadingText: 'loading...',
                    maxLength: 64,
                    width: 147
                }, {
                    fieldLabel: '规格',
                    name: 'Specification',
                    xtype: 'textfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '条形码',
                    name: 'BarCode',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    fieldLabel: 'SKU',
                    name: 'SKU',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    fieldLabel: '产品毛重',
                    name: 'NetWeight',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    xtype: 'combo',
                    fieldLabel: '计量单位',
                    name: 'MeasureUnit',
                    valueField: 'Value',
                    displayField: 'Value',
                    mode: 'remote',
                    allowBlank: true,
                    store: ds_item_unit,
                    selectOnFocus: true,
                    editable: false,
                    triggerAction: 'all',
                    loadingText: 'loading...',
                    maxLength: 64,
                    width: 147
                }, {
                    fieldLabel: '箱规',
                    name: 'CartonSpec',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '产地',
                    name: 'Producer',
                    xtype: 'textfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '包装类型',
                    name: 'Packages',
                    xtype: 'textfield',
                    allowBlank: true,
                    width: 147
                }, {
                    fieldLabel: '保质天数',
                    name: 'Guarantee',
                    xtype: 'numberfield',
                    allowBlank: true,
                    width: 147
                }, {
                    xtype: 'checkbox',
                    fieldLabel: '是否有保质期',
                    name: 'IsGuarantee',
                    inputValue: 'true',
                    checked: false,
                    allowBlank: true
                }, {
                    xtype: 'combo',
                    fieldLabel: '产品批次类型',
                    name: 'BatchType',
                    mode: 'local',
                    store: new Ext.data.SimpleStore({
                        data: [['生产日期', '生产日期'], ['入库日期', '入库日期']],
                        fields: ['text', 'value']
                    }),
                    displayField: 'text',
                    valueField: 'value',
                    selectOnFocus: true,
                    editable: false,
                    triggerAction: 'all',
                    loadingText: 'load...',
                    emptyText: '',
                    value: '生产日期',
                    width: 150,
                    listeners: {
                        'select': function (combo, record, index) {

                        }
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