var innerMessage;

var lang = {};

var _ = function (s, v) {
    if (v != null && typeof (v) == "object") {
        var t = "" + lang[s];
        for (var k in v) {
            t = t.replace("[[+" + k + "]]", v[k]);
        }
        return t;
    }
    else if (lang[s]) {
        return lang[s];
    }
    else {
        return s;
    }
};

function winSizer() {
    windowWidth = window.screen.availWidth;
    windowHeight = window.screen.availHeight;
    window.moveTo(0, 0);
    window.resizeTo(windowWidth, windowHeight);
}

var mycall = function (url, callback) {
    Ext.Ajax.request({
        method: 'GET',
        disableCaching: false,
        url: root_path + 'scripts/views/' + url + '.js?ver=' + new Date().getTime(),
        success: function (response) {
            eval(response.responseText);
            callback();
        },
        failure: function () { }
    });
}

var showMessage = function (text) {
    innerMessage.innerHTML = text;
}

var loadURL = function (url) {
    var oRequest = new XMLHttpRequest();
    oRequest.open('GET', url, false);
    oRequest.setRequestHeader("User-Agent", navigator.userAgent);
    oRequest.send(null)

    return oRequest.responseText;
};

var dateFormat = function (v) {
    var da = new Date();
    if (v && v.toString().indexOf("/Date") >= 0) {
        da = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        dy = da.getFullYear();
        dm = da.getMonth() + 1;
        dd = da.getDate();
        if (dy < 1970)
            dy = dy + 100;
        ys = new String(dy);
        ms = new String(dm);
        ds = new String(dd);
        if (ms.length == 1)
            ms = "0" + ms;
        if (ds.length == 1)
            ds = "0" + ds;
        ys = ys + "-" + ms + "-" + ds;
        return ys;
    } else if (v) {
        da = new Date(v);
    } else {
        return '';
    }
    dy = da.getFullYear();
    dm = da.getMonth() + 1;
    dd = da.getDate();
    if (dy < 1970)
        dy = dy + 100;
    ys = new String(dy);
    ms = new String(dm);
    ds = new String(dd);
    if (ms.length == 1)
        ms = "0" + ms;
    if (ds.length == 1)
        ds = "0" + ds;
    ys = ys + "-" + ms + "-" + ds;
    return ys;
}

var underline = function (v) {
    if (v) {
        return '<a href="#">' + v + '</a>'
    }
    else {
        return '';
    }
}

function renderFloat(val) {
    if (val == 0) {
        return '';
    } else if (val < 0) {
        return '<span style="color:red;">' + Ext.util.Format.number(val, '0.00') + '</span>';
    }
    return Ext.util.Format.number(val, '0.00');
}

Ext.override(Ext.form.ComboBox, {
    setValue: function (v, fireSelect) {
        var text = v;
        if (this.valueField) {
            var r = this.findRecord(this.valueField, v);
            if (r) {
                text = r.data[this.displayField];
                if (fireSelect) {
                    this.fireEvent('select', this, r, this.store.indexOf(r));
                }
            } else if (Ext.isDefined(this.valueNotFoundText)) {
                text = this.valueNotFoundText;
            }
        }
        this.lastSelectionText = text;
        if (this.hiddenField) {
            this.hiddenField.value = v;
        }
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = v;
        return this;
    }
});

Ext.util.Format.undef = function (v) {
    return v !== undefined && v !== null ? v : "";
};

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return;
        }
        if (field.startDateField
						&& (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
								.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } else if (field.endDateField
						&& (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
								.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
        * Always return true since we're only using this vtype to set
        * the min/max allowed values (these are tested for after the
        * vtype test)
        */
        return true;
    }
});

Ext.override(Ext.Component, {
    findParentBy: function (fn) {
        for (var p = this.ownerCt; (p != null) && !fn(p); p = p.ownerCt);
        return p;
    },

    findParentByType: function (xtype) {
        return typeof xtype == 'function' ?
            this.findParentBy(function (p) {
                return p.constructor === xtype;
            }) :
            this.findParentBy(function (p) {
                return p.constructor.xtype === xtype;
            });
    }
});

Ext.override(Ext.form.FormPanel, {
    keys: [{
        key: Ext.EventObject.ENTER,
        scope: this,
        handler: function (o, oEvent, e) {
            var field = Ext.getCmp(oEvent.target.id);
            var form = field.findParentByType('form').getForm();
            var src = oEvent.srcElement ? oEvent.srcElement : oEvent.target;
            if (oEvent.keyCode == 13 && src.type != 'button' && src.type != 'submit' && src.type != 'reset' && src.type != 'textarea' && src.type != '')
                if (Ext.isIE) {
                    window.event.keyCode = Ext.EventObject.TAB;
                } else {
                    var b = false;
                    Ext.iterate(form.getValues(), function (key, value) {
                        if (b) {
                            var f = form.findField(key);
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
    }]
});