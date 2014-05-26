mycall('store/exit/exit', function () {
    var exit = new Exit({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑出库',
        item_config: currentItemConfig
    });
    exit.show();
});