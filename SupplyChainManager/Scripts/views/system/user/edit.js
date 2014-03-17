mycall('system/user/user', function () {
    var user = new User({
        onClose: closeModule,
        parentId: parentId,
        edit: true,
        record: currentRec,
        title: '编辑用户'
    });
    user.show();
});
    