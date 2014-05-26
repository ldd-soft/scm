mycall('sale/sale', function () {
    var sale = new Sale({
        reference: currentRec,
        onClose: closeModule,
        owner_id: login_id,
        parentId: parentId,
        owner_name: login_name,
        title: '添加销售',
        item_config: currentItemConfig
    });
    sale.show();
});