mycall('system/supply/supply', function () {
    var supply = new Supply({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑供应商'
    });
    supply.show();
});
    