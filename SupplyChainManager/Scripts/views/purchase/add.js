mycall('purchase/purchase', function () {
    var purchase = new Purchase({
        reference: currentRec,
        onClose: closeModule,
        owner_id: login_id,
        parentId: parentId,
        owner_name: login_name,
        title: '添加采购',
        item_config: currentItemConfig
    });
    purchase.show();
});