mycall('system/item/item', function () {
    var item = new Item({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑货品'
    });
    item.show();
});
    