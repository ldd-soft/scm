Ext.ux.RatingColumn = Ext.extend(Ext.grid.ActionColumn, {
    size: 5,        // Number of icons in the column

    inconIndexRe: /ux-rating-icon-(\d+)/,

    constructor: function (config) {
        var items = config.items = [],
            i = 1,
            l = ((config.size || this.size) + 1);

        for (; i < l; i++) {
            items.push({});
        }
        Ext.ux.RatingColumn.superclass.constructor.call(this, config);
        this.renderer = this.renderer.createInterceptor(this.setItemClasses);
    },

    // When we are initialized as a plugin, hook into the grid's render evet
    init: function (grid) {
        grid.on({
            render: this.onHostGridRender,
            single: true
        });
    },

    // Route mousemove and mouseout events of the Grid's body through the View's event processing so we get control with value added (rowIdx)
    onHostGridRender: function (g) {
        g.getView().mainBody.on({
            mousemove: function (e) {
                g.view.processEvent('mousemove', e);
            },
            mouseout: function (e) {
                g.view.processEvent('mouseout', e);
            }
        })
    },

    setItemClasses: function (v) {
        for (var i = 0, it = this.items, l = it.length; i < l; i++) {
            it[i].iconCls = 'ux-rating-icon ux-rating-icon-' + (i + 1);
            if (i < v) {
                it[i].iconCls += ' ux-rating-icon-on';
            }
        }
    },

    processEvent: function (evtName, e, grid, rowIndex, colIndex) {
        var t = Ext.get(e.getTarget()),
            match, iconIdx, icons, i, rec;
        /**
        switch (evtName) {
            case 'mouseout':
                if (t.dom.tagName != 'img') {
                    this.activeCell && this.activeCell.select('img').removeClass('ux-rating-icon-hover');
                    delete this.activeCell;
                    delete this.ignoreMouseMove;
                }
                break;
            case 'mousemove':
                if (match = t.dom.className.match(this.inconIndexRe)) {
                    this.activeCell = t.up('');
                    if ((iconIdx = parseInt(match[1], 10)) != this.ignoreMouseMove) {
                        delete this.ignoreMouseMove;
                        icons = this.activeCell.query('img');
                        for (i = 0; i < icons.length; i++) {
                            Ext.fly(icons[i])[(i < iconIdx) ? 'addClass' : 'removeClass']('ux-rating-icon-hover');
                        }
                    }
                }
                break;
            case 'click':
                if (match = t.dom.className.match(this.inconIndexRe)) {
                    rec = grid.store.getAt(rowIndex);
                    if ((iconIdx = parseInt(match[1], 10)) == rec.get(this.dataIndex)) {
                        rec.set(this.dataIndex, 0);
                    } else {
                        rec.set(this.dataIndex, iconIdx);
                    }
                    this.ignoreMouseMove = iconIdx;
                }
            default:
        } // End switch
        **/

        //      Return any event handler return statuses to honour event cancelling
        return Ext.ux.RatingColumn.superclass.processEvent.apply(this, arguments);
    }
});