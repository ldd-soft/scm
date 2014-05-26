var role;
var root, tree;
var currentId, newId;
var currentRec, currentTable;
var currentItemConfig;
var currentTab;
var parentId;
var action;
var parentDs;
var moduleList = {};

function oncheck(str) {
    if (Ext.fly('box' + str).hasClass('checked')) {
        Ext.fly('box' + str).removeClass('checked');
        document.getElementById('check' + str).checked = false;
    } else {
        Ext.fly('box' + str).addClass('checked');
        document.getElementById('check' + str).checked = true;
    }
}

var closeModule = function (parentModule, moduleId) {
    var cardPanel = Ext.getCmp('content-panel');
    var cardToRemove = cardPanel.getLayout().activeItem;
    if (moduleId) {
        cardToRemove = cardPanel.findById(moduleId + '-panel');
    }
    if (cardToRemove) {
        var id = cardToRemove.id.substr(0, cardToRemove.id.indexOf('-'));
        if (id == 'Home') {
            return;
        }

        cardPanel.remove(cardToRemove);

        var snode = tree.getNodeById(id);
        if (snode) {
            snode.remove();
        }

        if (parentModule) {
            cardPanel.layout.setActiveItem(parentModule + '-panel');
        } else {
            cardPanel.getLayout().setActiveItem(0);
        }

        var cardFocus = cardPanel.getLayout().activeItem;
        if (cardFocus) {

            id = cardFocus.id.substr(0, cardFocus.id.indexOf('-'));
            snode = tree.getNodeById(id);
            if (snode) {
                tree.getSelectionModel().select(snode);
            }

        }

    }
}

var loadModule = function (name, title, url) {
    var cardPanel = Ext.getCmp('content-panel');
    newId = name + '-panel';
    if (!cardPanel.findById(newId)) {
        moduleList[name] = { name: name, title: title, url: url };
        loadScript(name, title, url);
        return;
    }
    else if (cardPanel.getLayout().activeItem) {
        currentId = cardPanel.getLayout().activeItem.id;
        if (currentId != newId) {
            cardPanel.layout.setActiveItem(name + '-panel');
            var node = tree.getNodeById(name);
            if (node) {
                tree.getSelectionModel().select(node);
            }
        }
    }

};

var loadScript = function (name, title, url) {

    Ext.Ajax.request({
        method: 'GET',
        disableCaching: false,
        url: root_path + 'scripts/views/' + url + '.js?ver=' + new Date().getTime(),
        success: function (response) {
            var cardPanel;
            eval(response.responseText);

            if (cardPanel) {
                cardPanel.layout.setActiveItem(name + '-panel');
                cardPanel.doLayout();
            }

            var node = new Ext.tree.TreeNode({
                id: name,
                text: title,
                iconCls: 'icon-new',
                leaf: true
            });
            root.appendChild(node);
            tree.getSelectionModel().select(node);

        },
        failure: function () {
        }
    });
};

var initData = function () {

};
var layout;
var buildLayout = function () {

    var tb = new Ext.Toolbar({ cls: 'menuBox' });

    tb.add({ xtype: 'displayfield', width: 180, value: '' });

    root = new Ext.tree.AsyncTreeNode({
        text: 'root'
    });

    tree = new Ext.tree.TreePanel({
        root: root,
        cls: 'shortcut',
        region: 'center',
        lines: false,
        border: false,
        rootVisible: false,
        contextMenu: new Ext.menu.Menu({
            items: [{
                text: 'Close'
            }],
            listeners: {
                itemclick: function (item) {
                    var n = item.parentMenu.contextNode;
                    closeModule(null, n.id);
                }
            }
        }),
        listeners: {
            contextmenu: function (node, e) {
                //          Register the context node with the menu so that a Menu Item's handler function can access
                //          it via its parentMenu property.
                node.select();
                var c = node.getOwnerTree().contextMenu;
                c.contextNode = node;
                c.showAt(e.getXY());
            }
        }
    });

    tree.on('click', function (node) {
        if (node.isLeaf()) {

            loadModule(node.id, node.text);
        } else {
            node.expand(true);
        }
    });

    layout = new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'north',
            height: 72,
            contentEl: 'banner'
        }, {
            id: 'mainTree-panel',
            region: 'west',
            width: 170,
            collapseMode: 'mini',
            hideCollapseTool: true,
            split: true,
            layout: 'border',
            items: [tree],
            defaults: {
                autoScroll: true,
                border: false
            },
            layoutConfig: {
                animate: true
            }
        }, {
            id: 'content-panel',
            region: 'center',
            layout: 'card',
            margins: '2 5 5 0',
            activeItem: 0,
            border: false,
            collapsible: false,
            items: []
        }]
    });

    new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: root_path + 'Home/GetMainMenus'
        }),
        reader: new Ext.data.JsonReader({}, ['Id', 'Title']),
        autoLoad: true
    }).on('load', function (store, records) {
        for (var i = 0; i < records.length; i++) {
            tb.add({
                text: records[i].data.Title,
                menu: new Ext.ux.menu.StoreMenu({
                    url: root_path + 'Home/GetSubMenus',
                    baseParams: { Id: records[i].data.Id }
                }),
                width: 150,
                minWidth: 80
            });
        }
        tb.add('->');
        tb.add({
            text: '',
            width: 30,
            icon: root_path + 'content/images/icon-refresh.png',
            handler: function () {
                var cardPanel = Ext.getCmp('content-panel');
                var cardToRemove = cardPanel.getLayout().activeItem;
                var id = cardToRemove.id.substr(0, cardToRemove.id.indexOf('-'));
                var name = moduleList[id].name;
                var title = moduleList[id].title;
                var url = moduleList[id].url;
                if (name == 'Home') {
                    eventStore.reload()
                    ds_schedule.reload();
                    ds_approve.reload();
                } else {
                    closeModule(null);
                    loadModule(name, title, url);
                }
            }
        });
        tb.add({
            text: '',
            width: 30,
            icon: root_path + 'content/images/icon-close.png',
            handler: function () { closeModule(null); }
        });
        tb.render('banner');
        layout.doLayout();
    });
};


var init = function () {
    initData();
    buildLayout();
};

Ext.onReady(init);

Ext.MessageBox.minWidth = 450;
Ext.MessageBox.minHeight = 300;
