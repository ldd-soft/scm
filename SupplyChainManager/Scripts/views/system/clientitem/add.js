mycall('system/clientitem/clientitem', function () {
    var clientItem = new ClientItem({
        onClose: closeModule,
        parentId: parentId,
        title: '添加客户货品关联',
        action: action,
        reference: currentRec,
        item_id: currentRec != null ? currentRec.data.Id : '',
        item_name: currentRec != null ? currentRec.data.ItemName : '',
        ds: parentDs
    });
    clientItem.show();
    currentTable = '';
    action = '';
});
    