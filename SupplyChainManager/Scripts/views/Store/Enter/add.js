mycall('store/enter/enter', function () {
    var enter = new Enter({
        reference: currentRec,
        onClose: closeModule,
        owner_id: login_id,
        parentId: parentId,
        owner_name: login_name,
        title: '添加入库',
        item_config: currentItemConfig
    });
    enter.show();
});