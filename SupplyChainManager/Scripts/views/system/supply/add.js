mycall('system/supply/supply', function () {
    var supply = new Supply({
        onClose: closeModule,
        parentId: parentId,
        title: '添加供应商',
        action: action,
        reference: currentRec,
        record_id: currentRec != null ? currentRec.data.Id : '',
        ds: parentDs
    });
    supply.show();
    currentTable = '';
    action = '';
});
    