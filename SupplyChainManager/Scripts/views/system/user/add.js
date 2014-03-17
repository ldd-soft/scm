mycall('system/user/user', function () {
    var user = new User({
        onClose: closeModule,
        parentId: parentId,
        title: '添加用户',
        action: action,
        reference: currentRec,
        record_id: currentRec != null ? currentRec.data.Id : '',
        ds: parentDs
    });
    user.show();
    currentTable = '';
    action = '';
});
    