Ext.namespace('Ext.ux.form');

Ext.ux.form.CheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {
    columns: 6,
    dataUrl: '', //数据地址
    labelFiled: 'columnChName',
    valueFiled: 'columnName',
    setValue: function (val) {
        if (val.split) {
            val = val.split(',');
        }
        this.reset();
        for (var i = 0; i < val.length; i++) {
            this.items.each(function (c) {
                //debugger;

                if (c.inputValue == val[i]) {
                    c.setValue(true);
                }
            });
        }

    },
    reset: function () {
        this.items.each(function (c) {
            c.setValue(false);
        });
    },

    getValue: function () {
        var val = [];
        this.items.each(function (c) {
            if (c.getValue() == true)
                val.push(c.inputValue);
        });
        return val.join(',');
    },
    onRender: function (ct, position) {
        var items = [];
        //alert(items.length);
        if (!this.items) { //如果没有指定就从URL获取
            Ext.Ajax.request({
                url: this.dataUrl,
                scope: this,
                async: false,
                success: function (response) {
                    var data = Ext.util.JSON.decode(response.responseText);

                    data = data.rows || data;

                    var Items2 = this.items;

                    if (this.panel) {

                        var columns = this.panel.items;


                        if (columns) {
                            for (var i = 0; i < columns.items.length; i++) {
                                column = columns.items[i];
                                column.removeAll();
                            }
                            Items2.clear();
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        var chk = { boxLabel: d[this.labelFiled], name: this.name, inputValue: d[this.valueFiled], tooltip: 'sssf' };

                        //alert(d[this.labelFiled]);
                        items.push(chk);
                        //alert(items.length);
                    }


                }

            });
            this.items = items;
        }
        Ext.ux.form.CheckboxGroup.superclass.onRender.call(this, ct, position);
    }
});

Ext.reg('checkgroupwithdata', Ext.ux.form.CheckboxGroup);