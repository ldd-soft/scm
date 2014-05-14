mycall('order/order', function () {
    var order = new Order({
        reference: currentRec,
        onClose: closeModule,
        owner_id: login_id,
        parentId: parentId,
        owner_name: login_name,
        title: '添加订单'
    });
    order.show();
});