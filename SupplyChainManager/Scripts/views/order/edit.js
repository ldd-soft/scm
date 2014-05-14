mycall('order/order', function () {
    var order = new Order({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑订单'
    });
    order.show();
});