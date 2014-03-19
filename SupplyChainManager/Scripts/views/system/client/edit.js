mycall('system/client/client', function () {
    var client = new Client({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑客户'
    });
    client.show();
});
    