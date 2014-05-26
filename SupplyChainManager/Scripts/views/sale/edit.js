mycall('sale/sale', function () {
    var sale = new Sale({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑销售',
        item_config: currentItemConfig
    });
    sale.show();
});