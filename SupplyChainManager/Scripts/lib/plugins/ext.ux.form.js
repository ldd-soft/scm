Ext.ns('Ext.ux', 'Ext.ux.layout');

Ext.ux.layout.HorizontalFitLayout = Ext.extend(Ext.layout.ContainerLayout, {
    /**
    * @cfg {bool} containsScrollbar
    */
    containsScrollbar: false,
    /**
    * @private
    */
    monitorResize: true,

    /**
    * @private
    */
    onLayout: function (ct, target) {
        Ext.layout.FitLayout.superclass.onLayout.call(this, ct, target);
        if (!this.container.collapsed) {
            var size = target.getStyleSize();
            size.width = ct.containsScrollbar ? size.width - 16 : size.width;

            ct.items.each(function (item) {
                this.setItemSize(item, size);
            }, this);
        }
    },
    /**
    * @private
    */
    setItemSize: function (item, size) {
        if (item && size.height > 0) { // display none?
            item.setWidth(size.width);
        }
    }
});
Ext.Container.LAYOUTS['hfit'] = Ext.ux.layout.HorizontalFitLayout;

Ext.ux.form.IconTextField = Ext.extend(Ext.form.TextField, {
    /**
    * @cfg {String} LabelIcon icon to be displayed in front of the label
    */
    labelIcon: '',
    /**
    * @private
    */
    initComponent: function () {
        Ext.ux.form.IconTextField.superclass.initComponent.call(this);
        if (this.labelIcon.length > 0) {
            this.fieldLabel = '<img src="' + this.labelIcon + '" class="x-ux-form-icontextfield-labelicon">' + this.fieldLabel;
        }
    }
});
Ext.reg('icontextfield', Ext.ux.form.IconTextField);

Ext.ux.form.ColumnFormPanel = Ext.extend(Ext.Panel, {

    formDefaults: {
        xtype: 'icontextfield',
        anchor: '100%',
        labelSeparator: '',
        columnWidth: .333
    },

    layout: 'hfit',
    labelAlign: 'top',
    /**
    * @private
    */
    initComponent: function () {
        var items = [];

        // each item is an array with the config of one row
        for (var i = 0, j = this.items.length; i < j; i++) {

            var initialRowConfig = this.items[i];
            var rowConfig = {
                border: false,
                layout: 'column',
                items: []
            };
            // each row consits n column objects 
            for (var n = 0, m = initialRowConfig.length; n < m; n++) {
                var column = initialRowConfig[n];
                var idx = rowConfig.items.push({
                    columnWidth: column.columnWidth ? column.columnWidth : this.formDefaults.columnWidth,
                    layout: 'form',
                    labelAlign: this.labelAlign,
                    defaults: this.formDefaults,
                    //Is n the last column object? Then no padding.
                    bodyStyle: n + 1 >= m ? 'padding-right: 0px;' : 'padding-right: 5px;',
                    border: false,
                    items: column
                });

                if (column.width) {
                    rowConfig.items[idx - 1].width = column.width;
                    delete rowConfig.items[idx - 1].columnWidth;
                }
            }
            items.push(rowConfig);
        }
        this.items = items;

        Ext.ux.form.ColumnFormPanel.superclass.initComponent.call(this);
    }
});

Ext.reg('columnform', Ext.ux.form.ColumnFormPanel);

Ext.ux.form.MirrorTextFieldManager = function () {
    var MirrorTextFields = {};

    function MirrorField(field, newValue, oldValue) {
        var m = MirrorTextFields[field.name];
        for (var i = 0, l = m.length; i < l; i++) {
            m[i].setRawValue(newValue);
        }
        return true;
    }

    return {
        register: function (field) {
            var m = MirrorTextFields[field.name];
            if (!m) {
                m = MirrorTextFields[field.name] = [];
            }
            m.push(field);
            field.on("change", MirrorField);
        },

        unregister: function (field) {
            var m = MirrorTextFields[field.name];
            if (m) {
                m.remove(field);
                field.un("change", MirrorField);
            }
        },

        setAll: function (field, value) {
            var m = MirrorTextFields[field.name];
            if (m) {
                MirrorField(field, value);
            }
        }
    };
} ();

Ext.ux.form.MirrorTextField = Ext.extend(Ext.ux.form.IconTextField, {
    /**
    * @private
    */
    initComponent: function () {
        Ext.ux.form.MirrorTextField.superclass.initComponent.call(this);
        Ext.ux.form.MirrorTextFieldManager.register(this);
    },
    /**
    * @private
    */
    setValue: function (value) {
        Ext.ux.form.MirrorTextFieldManager.setAll(this, value);
    },
    /**
    * @private
    */
    onDestroy: function () {
        if (this.rendered) {
            Ext.ux.form.MirrorTextFieldManager.unregister(this);
        }
    }
});
Ext.reg('mirrortextfield', Ext.ux.form.MirrorTextField);

Ext.override(Ext.layout.FormLayout, {
    getTemplateArgs: function (field) {
        var noLabelSep = !field.fieldLabel || field.hideLabel;
        var labelSep = (typeof field.labelSeparator == 'undefined' ? this.labelSeparator : field.labelSeparator);
        if (!field.allowBlank) labelSep += '<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
        return {
            id: field.id,
            label: field.fieldLabel,
            labelStyle: field.labelStyle || this.labelStyle || '',
            elementStyle: this.elementStyle || '',
            labelSeparator: noLabelSep ? '' : labelSep,
            itemCls: (field.itemCls || this.container.itemCls || '') + (field.hideLabel ? ' x-hide-label' : ''),
            clearCls: field.clearCls || 'x-form-clear-left'
        };
    }
});

MyHtmlEditor = Ext.extend(Ext.form.HtmlEditor, {
    initComponent: function () {
        MyHtmlEditor.superclass.initComponent.call(this);

        this.on('initialize', function () {
            Ext.EventManager.on(this.getDoc(), {
                'blur': this.onBlur,
                'focus': this.onFocus,
                buffer: 100,
                scope: this
            });
        });
    }
});
Ext.reg('myhtmleditor', MyHtmlEditor);

Ext.form.myDateField = Ext.extend(Ext.form.DateField, {
    onTriggerClick: function () {
        Ext.form.myDateField.superclass.onTriggerClick.call(this);   //先执行一下父类的函数内容，否则下面的this.menu找不到
        this.menu.picker.setValue(this.getValue() || this.defaultDate);     //调用menuPicker的setValue方法设定一下值
    }
});
Ext.reg('myDateField', Ext.form.myDateField);  //注册一个类型，便于使用

Ext.ux.RemoteCheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {
    baseParams: null,
    url: '',
    defaultItems: [
    new Ext.form.Checkbox(
    {
        xtype: 'checkbox',
        boxLabel: 'No Items',
        disabled: true
    })],
    fieldId: 'id',
    fieldName: 'name',
    fieldLabel: 'boxLabel',
    fieldValue: 'inputValue',
    fieldChecked: 'checked',
    reader: null,

    //private
    initComponent: function () {

        this.addEvents(
        /**
        * @event add
        * Fires when a checkbox is added to the group
        * @param {Ext.form.CheckboxGroup} this
        * @param {object} chk The checkbox that was added.
        */
        'add',
        /**
        * @event beforeadd
        * Fires before a checkbox is added to the group
        * @param {Ext.form.CheckboxGroup} this
        * @param {object} chk The checkbox to be added.
        */
        'beforeadd',
        /**
        * @event load
        * Fires when a the group has finished loading (adding) new records
        * @param {Ext.form.CheckboxGroup} this
        */
        'load',
        /**
        * @event beforeremove
        * Fires before a checkbox is removed from the group
        * @param {Ext.form.CheckboxGroup} this
        * @param {object} chk The checkbox to be removed.
        */
        'beforeremove');

        Ext.ux.RemoteCheckboxGroup.superclass.initComponent.apply(this, arguments);
    },

    onRender: function () {
        Ext.ux.RemoteCheckboxGroup.superclass.onRender.apply(this, arguments);
        if (this.showMask) {
            this.loadmask = new Ext.LoadMask(this.ownerCt.getEl(), {
                msg: "Loading..."
            });
        }
        this.reload();
    },

    reload: function () {
        if ((this.url != '') && (this.reader != null)) {
            this.removeAll();
            if (this.showMask) {
                this.loadmask.show();
            }

            handleCB = function (responseObj, options) {
                var response = Ext.decode(responseObj.responseText);

                if (response.success) {
                    var data = this.reader.readRecords(Ext.decode(responseObj.responseText));
                    for (var i = 0; i < data.records.length; i++) {
                        var record = data.records[i];
                        var item = new Ext.form.Checkbox(
                        {
                            xtype: 'checkbox',
                            listeners: {
                                'render': this.cbRenderer
                            },
                            boxLabel: record.get(this.fieldValue),
                            inputValue: record.get(this.fieldValue)
                        });

                        if (this.fieldId != '') {
                            item.id = record.get(this.fieldId);
                        }

                        if (this.fieldName != '') {
                            item.name = record.get(this.fieldName);
                        }

                        if (this.fieldChecked != '') {
                            item.checked = record.get(this.fieldChecked);
                        }

                        if (record.get('disabled')) {
                            item.disabled = true;
                        }

                        item.on('check', this.cbHandler, this.cbHandlerScope ? this.cbHandlerScope : this, { buffer: 10 });

                        if (this.fireEvent('beforeadd', this, item) !== false) {
                            var items = this.items;
                            var columns = this.panel.items;
                            var column = columns.itemAt(items.getCount() % columns.getCount());
                            var chk = column.add(item);
                            items.add(item);
                            items[i] = chk;
                            this.doLayout();

                            this.fireEvent('add', this, item);
                        }
                    }

                    this.fireEvent('load', this);
                }
                if (this.showMask) {
                    this.loadmask.hide();
                }
            }

        }

        var fail = function () {
            console.log("fail");
        };

        Ext.Ajax.request(
        {
            headers: ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'],
            method: 'POST',
            url: this.url,
            params: this.baseParams,
            success: handleCB,
            failure: fail,
            scope: this
        });
    },
    removeAll: function () {
        cbObj = this;
        for (var j = 0; j < this.columns.length; j++) {
            if (cbObj.panel.getComponent(j).items.length > 0) {
                cbObj.panel.getComponent(j).items.each(

                function (i) {
                    if (cbObj.fireEvent('beforeremove', cbObj, i) !== false) {
                        i.destroy();
                    }
                });
            }
        }
    },
    getGroupValue: function () {
        var valuesArray = [];
        for (var j = 0; j < this.columns.length; j++) {
            if (this.panel.getComponent(j).items.length > 0) {
                this.panel.getComponent(j).items.each(

                function (i) {
                    if (i.checked) {
                        valuesArray.push(i.inputValue);
                    }
                });
            }
        }
        return valuesArray.join('/');
    }

});
Ext.reg("remotecheckboxgroup", Ext.ux.RemoteCheckboxGroup);