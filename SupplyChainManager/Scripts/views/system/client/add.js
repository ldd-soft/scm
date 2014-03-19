mycall('system/client/client', function () {
    var client = new Client({
        onClose: closeModule,
        parentId: parentId,
        title: '添加客户',
        action: action,
        reference: currentRec,
        record_id: currentRec != null ? currentRec.data.Id : '',
        ds: parentDs
    });
    client.show();
    currentTable = '';
    action = '';
});
    