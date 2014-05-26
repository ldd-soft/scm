mycall('purchase/purchase', function () {
    var purchase = new Purchase({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑采购',
        item_config: currentItemConfig
    });
    purchase.show();
});