Ext.onReady(function(){

	/**
	 *
	 */
	var r = new Ext.ux.form.Rater();
	r.applyTo('r');

	/**
	 *
	 */
	var r2 = new Ext.ux.form.Rater({topText:'Rate this:', bottomText:'2234 ratings', topHoverText:['Poor','Nothing special','OK','Pretty cool','Awesome!']});
	r2.on('rate', function(){
		this.setTopText('<b>Thank you for rating!</b>');
	});
	r2.applyTo('r2');


	/**
	 *
	 */
	var r3 = new Ext.ux.form.Rater({topText:'Rate this:', bottomText:'2234 ratings', displayValue:7.4, maxValue:10});
	r3.on('rate', function(){
		this.setTopText('<b>You rated: ' + this.getValue() + '</b>');
	});
	r3.render('fs3');

	/**
	 *
	 */
    var simple = new Ext.form.Form({
        labelWidth: 75, // label settings here cascade unless overridden
        url:'save-form.php'
    });
    simple.add(
        new Ext.form.TextField({
            fieldLabel: 'First Name',
            name: 'first',
            width:175,
            allowBlank:false
        }),

        new Ext.form.TextField({
            fieldLabel: 'Last Name',
            name: 'last',
            width:175
        }),

        new Ext.form.TextField({
            fieldLabel: 'Company',
            name: 'company',
            width:175
        }),

        new Ext.form.TextField({
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email',
            width:175
        }),

        new Ext.ux.form.Rater({
            fieldLabel: 'Rating',
            name: 'rating',
			value: 3.6,
            maxValue:5
        })

    );

    simple.addButton('Save');
    simple.addButton('Cancel');

    simple.render('form-ct');


	Ext.fly('btn1').on('click', function(){
		r2.reInit({value:'', displayValue:3.4, topHoverText:['1','2','3','4','5']});
	})
	Ext.fly('btn2').on('click', function(){
		r2.reInit({value:'', displayValue:1.6, topHoverText:['Poor','Nothing special','OK','Pretty cool','Awesome!']});
	})


        
});
