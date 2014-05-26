mycall('store/enter/enter', function () {
    var enter = new Enter({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑入库',
        item_config: currentItemConfig
    });
    enter.show();
});