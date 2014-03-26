mycall('system/item/item', function () {
    var item = new Item({
        onClose: closeModule,
        parentId: parentId,
        title: '添加货品',
        action: action,
        reference: currentRec,
        record_id: currentRec != null ? currentRec.data.Id : '',
        ds: parentDs
    });
    item.show();
    currentTable = '';
    action = '';
});
    