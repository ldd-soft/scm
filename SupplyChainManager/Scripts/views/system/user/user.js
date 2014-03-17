User = function (config) {
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
        var url = root_path + 'User/Create';
        if (config['record']) {
            url = root_path + 'User/Edit/' + config['record'].data.Id;
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
            id: model + 'User-panel',
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
                    fieldLabel: '登录名',
                    name: 'Login',
                    id: t_id,
                    xtype: 'textfield',
                    maxLength: 64,
                    allowBlank: false
                }, {
                    fieldLabel: '姓名',
                    name: 'Name',
                    xtype: 'textfield',
                    allowBlank: false
                }, {
                    fieldLabel: '职位',
                    name: 'Position',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    fieldLabel: '所在城市',
                    name: 'City',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    fieldLabel: '电话',
                    name: 'Tel',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    fieldLabel: '传真',
                    name: 'Fax',
                    xtype: 'textfield',
                    allowBlank: true
                }, {
                    fieldLabel: '邮箱',
                    name: 'Email',
                    xtype: 'textfield',
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