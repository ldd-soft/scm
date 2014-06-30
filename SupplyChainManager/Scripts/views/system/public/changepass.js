ChangePassword = function(config) {
    var config = config || {};
    var win;
    var fp;
    
    var buildForm = function() {
        fp = new Ext.FormPanel({
            labelWidth : 120,
            labelAlign : 'right',
            url: root_path + 'User/ChangePassword',
			border : false,
			bodyStyle: 'background-color:#fff; padding: 10 5px 5px 0px',
			anchor: '100%',
			defaults : {
			    inputType : 'password',
				msgTarget : 'side' // 验证信息显示右边
			},
			defaultType : 'textfield',
			items : [{
			    fieldLabel : '填写旧密码',
				name : 'oldPassword',
				allowBlank : false
			}, {
			    fieldLabel : '填写新密码',
				name : 'password',
				allowBlank : false
			}, {
				fieldLabel : '确认新密码',
				name : 'pass-cfrm',
				allowBlank : false
			}],
			buttonAlign : 'center',
			minButtonWidth : 60,
			buttons : [{
			    text : '修改',
				handler : function(btn) {
				    var frm = this.ownerCt.ownerCt.form;
					if (frm.isValid()) {
					    if (frm.findField('password').getValue() != frm.findField('pass-cfrm').getValue()) {
						    Ext.Msg.show({
							    title : '提示',
								msg : '填写的新密码不一致！',
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.INFO
							});
							return;
						}
						frm.submit({
						    waitTitle : '请稍候',
							waitMsg : '正在提交表单数据,请稍候...',
							success : function(form, action) {
							    Ext.Msg.show({
								    title : '提示',
									msg : '密码修改成功！',
									buttons : Ext.Msg.OK,
									fn : function() {
											// 注销
									    window.location = root_path + 'Account/Logout';
									},
									icon : Ext.Msg.INFO
								});
								frm.reset();
								win.hide();
							},
							failure : function(form, action) {
							    var result = action.result.msg;
								Ext.Msg.show({
								    title : '错误提示',
									msg : result,
									buttons : Ext.Msg.OK,
									fn : function() {
									    if (result == '会话过期,请重新登录后再修改密码！') {
												// 注销
										    window.location = root_path + 'Account/Logout';
										}
									},
									icon : Ext.Msg.ERROR
								});
							}
						});
					}
				}
			}, {
			    text : '清空',
				handler : function() {
				    this.ownerCt.ownerCt.form.reset();
				}
			}, {
			    text : '关闭',
				handler : function() {
				    win.close();
				}
            }]
        });
    }
  
    var buildWin = function() {
        win = new Ext.Window({
			closeAction : 'close',
			resizable : false,
			bodyStyle: 'background-color:#fff; padding: 0 5px 5px 0px',
			modal: true,
			title : '修改用户密码',
			width : 350,
			height : 180,
			items : [fp]
		})
    };

    buildForm();    
    buildWin();

    return {
        show: function() {        
            win.show();
        },
        hide: function() {
            win.hide();
        }
    }    
}