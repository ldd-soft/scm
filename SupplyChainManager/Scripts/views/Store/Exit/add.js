mycall('store/exit/exit', function () {
    var exit = new Exit({
        reference: currentRec,
        onClose: closeModule,
        owner_id: login_id,
        parentId: parentId,
        owner_name: login_name,
        title: '添加出库',
        item_config: currentItemConfig
    });
    exit.show();
});