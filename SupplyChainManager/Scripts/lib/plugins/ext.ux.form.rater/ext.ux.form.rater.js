//to do
//make it work with editorgrid
//how the rater shall look after rating

Ext.namespace("Ext.ux.form");

Ext.ux.form.Rater = function(config){
	Ext.ux.form.Rater.superclass.constructor.call(this, config);
	this.addEvents({
		'beforerating' : true,
		'rate' : true
	});
}

Ext.extend(Ext.ux.form.Rater, Ext.form.NumberField, {
	//public configs
	unit : 20,							// default size (px) of each star
	disabled : false,					// self explainatory
	ratedValue : undefined,				// to display rated value (dark stars), if set Rater automatically gets disabled
	maxValue : 5,						// default maximum rating
	displayValue : undefined,			// initial value to display - yellow stars - if not set, field's value will get displayed
	animate : true,

	topText : undefined,				// default text above the stars - can be plain text or html markup
	bottomText : undefined,				// default text beneath the stars - can be plain text or html markup
	topHoverText : undefined,			// array with text when hovering over stars displayed above the stars
	bottomHoverText : undefined,		// arrayarray with text when hovering over stars displayed beneath the stars

	//private configs
	rated : false,						// true after getting rated
	allowNegative : false,				// don't allow negative values
	
	/** css config **/
	wrapClass : 'ux-form-rater-wrap',		// container class to hold rater
	starsClass : 'ux-form-rater-stars',		// container class to hold stars
	hoverClass : 'ux-form-rater-hover',		// class when star get hovered
	voteClass : 'ux-form-rater-vote',		// class for displaying current rating
	votedClass : 'ux-form-rater-voted',		// class for displaying user rated rating

	textTopClass : 'ux-form-rater-text-top',		//class for top text container
	textBottomClass : 'ux-form-rater-text-bottom',	//class for bottom text container

	autoSize: Ext.emptyFn,

	// private
	onRender : function(ct, position){
		Ext.ux.form.Rater.superclass.onRender.call(this, ct, position);

		this.wrap = this.el.wrap({cls: this.wrapClass});
		//this.wrap.setSize(this.unit * this.maxValue, this.unit);		//dunno if this one should have the dimensions set
		if(Ext.isIE) this.wrap.setHeight(this.unit);					//fix for ie using in dynamic form
		this.el.addClass('x-hidden');

		this.createStars();
		this.createTextContainers();

		//correct out of bound values
		this.displayValue = ( this.displayValue > this.maxValue) ? this.maxValue : this.displayValue;

		//display yellow stars
		if(this.displayValue > 0 || this.getValue() > 0){
			this.displayRating();
		}

	},

	// private
	createStars : function(){
		if(this.getStars().getCount() > 0){
			return;
		}

		var ul = this.wrap.createChild({tag:'ul', cls:this.starsClass}).setSize(this.unit * this.maxValue, this.unit);

		//append to rating container
		var tplr = new Ext.Template('<li class="rating"></li>');				//template for displaying the rating (yellow)
		var tpls = new Ext.Template('<li class="star"></li>');					//template for each rating (star)

		tplr.append(ul, [], true).setHeight(this.unit)							//append rating to its ul container

		for(var i = this.maxValue; i > 0; i--){
			var star = tpls.append(ul, [], true);								//append star to its ul container
			star.setSize(this.unit * i, this.unit);								//dimensions of the stars - declines in size, overlapping each other
		}

		this.alignStars();
	},

	//private
	createTextContainers : function(){
		var ct = this.getStarsContainer();

		if(!this.textTopContainer) this.textTopContainer = Ext.DomHelper.insertBefore(ct, {tag:"div", cls:this.textTopClass}, true);
		if(!this.textBottomContainer) this.textBottomContainer = Ext.DomHelper.insertAfter(ct, {tag:"div", cls:this.textBottomClass}, true);

		//hide the containers on default
		this.textTopContainer.addClass('x-hidden');
		this.textBottomContainer.addClass('x-hidden');
	},

	// private
	initEvents : function(){
		Ext.ux.form.Rater.superclass.initEvents.call(this);

		var ct = this.getStarsContainer();
		var stars = this.getStars();

		stars.on('mouseover', this.displayHover, this);
		stars.on('mouseout', this.removeHover, this, {delay:5});				//delayed for anti-flicker
		stars.on('click', this.rate, this);

		//set the hover text - top
		this.initText('top');
		this.initText('bottom');

		//**** focus blur might be the problem and not working as editor, still working on it
		ct.on('mouseover', this.onFocus, this);									//maintain focus while hovering stars - useful in editor
		ct.on('mouseout', this.onBlur, this);									//blur when not hovering stars - useful in editor
		ct.on('click', this.onFocus, this);										//maintain focus while hovering stars - useful in editor

	},
	
	//private
	initText : function(topOrBottom){
		var stars = this.getStars();
		var text = (topOrBottom == 'bottom') ? 'bottomText' : 'topText';
		var setText = (topOrBottom == 'bottom') ? 'setBottomText' : 'setTopText';
		var hoverText = (topOrBottom == 'bottom') ? 'bottomHoverText' : 'topHoverText';

		this[setText](this[text]);

		if(!(this[hoverText] instanceof Array)){								//when provided hovertext is not an array
			this[hoverText] = null;
			return;
		}

		if(Ext.isEmpty(this[text])){
			this[text] = '&nbsp;';												//fill up container with a space when no text has been set
		}

		var mouseover = function(){
			if(this.disabled) return;
			this[setText](this[hoverText][this.hoverValue-1])
		};

		var mouseout = function(){
			if(this.disabled) return;
			this[setText](this[text]);
		};

		for (var i = 0; i < stars.getCount(); i++){
			//remove listener first to enable reinit
			stars.item(i).un('mouseover', mouseover, this);
			stars.item(i).un('mouseout', mouseout, this);

			stars.item(i).on('mouseover', mouseover, this, {delay:5});	//delayed so hovervalue gets set
			stars.item(i).on('mouseout', mouseout, this);
		}

	},

	/**
	 * Reinit the Rater with the provided config
	 */
	reInit : function(config){
		Ext.apply(this, config);
		this.rated = false;
		this.initText('top');
		this.initText('bottom');
		this.setValue(this.value);
		this.setDisabled(false);
		this.displayRating();
	},

	/**
	 * Return true/false when Rater is rated or not
	 */
	isRated : function(){
		return this.rated;
	},

	/**
	 * Returns the text in the top text container
	 */
	getTopText : function(){
		return this.textTopContainer.dom.innerHTML;
	},

	/**
	 * Returns the text in the bottom text container
	 */
	getBottomText : function(){
		return this.textBottomContainer.dom.innerHTML;
	},

	/**
	 * Sets the text in the top text container
	 */
	setTopText : function(t){
		this.textTopContainer.dom.innerHTML = t;
		(t == null || t == '') ? this.textTopContainer.addClass('x-hidden') : this.textTopContainer.removeClass('x-hidden') ;
	},

	/**
	 * Sets the text in the bottom text container
	 */
	setBottomText : function(t){
		this.textBottomContainer.dom.innerHTML = t;
		(t == null || t == '') ? this.textBottomContainer.addClass('x-hidden') : this.textBottomContainer.removeClass('x-hidden') ;
	},

	// private
	getStarsContainer : function(){
		return this.wrap.select('.'+this.starsClass, true).item(0);;
	},

	// private
	getRating : function(){
		return this.wrap.select("li.rating", true);
	},
	
	// private
	getStars : function(){
		return this.wrap.select("li.star", true);
	},

	// private
	alignStars : function(){
		var ct = this.getStarsContainer();
		var rating = this.getRating();
		var stars = this.getStars();
		var leftOffset = Ext.fly(document.body).getAlignToXY(ct)[0];			//left absolute positioning of rating and stars
		var isInForm = (ct.findParent('.x-form-item', 5)) ? true : false;		//used to fix weird aligning problem - dont't have a nice solution yet
		var isInEditor = (ct.findParent('.x-editor', 5)) ? true : false;		//used to fix weird aligning problem - dont't have a nice solution yet

		if(!isInForm && !isInEditor){											//left offset of the rating <li> (yellow stars)
			rating.setLeft(leftOffset);
			stars.setLeft(leftOffset);
		}else{
			rating.alignTo(ct, 'tl');
			stars.alignTo(ct, 'tl');
		}

	},

	// private
	displayHover : function(e){
		if(this.disabled) return;

		var target = Ext.get(e.getTarget());			//get originating element from the event
		//target.addClass(this.hoverClass);				//add class show the hover stars

		var stars = this.getStars();
		var i = 0;
		
		//loop star till originating star to get the value and store it in hoverValue for later use
		while (stars.item(i) != null){
			if(stars.item(i) == target){
				this.hoverValue = this.maxValue - i;
				return;
			}
			i++;
		}
	},
	
	// private ??
	// value to display - finalRating = true for dark stars
	displayRating : function(v, finalRating){
		var el = this.getRating();										//get <li> for displaying the value (yellow star)

		//when v is not provided
		if(Ext.isEmpty(v)){
			var v = (this.displayValue == null) ? this.getValue() : this.displayValue;
			v = Ext.isEmpty(v) ? 0 : v;
		}else{
			var v = v;
		}

		//highest priority
		if(this.ratedValue > 0){
			v = this.ratedValue;
			finalRating = true;
			this.rated = true;
			this.disabled = true;
		}

		var replaceClass = function(vtd, vt){
			(finalRating != true) ?
				el.replaceClass(vtd, vt):			//remove dark stars and show yellow stars
				el.replaceClass(vt, vtd);			//remove yellow stars and show dark stars
		}

		//when no animation is used
		if(this.animate != true){
			replaceClass(this.votedClass, this.voteClass);
			el.setWidth(v * this.unit);										//set width according to the value
			return;
		}

		//set width according to the value with animation
		var showRating = function(){
			replaceClass(this.votedClass, this.voteClass);
			el.setWidth(v * this.unit, {easing:'easeIn'}).fadeIn();			//set width according to the value
		}
		el.setWidth(0, {easing: 'slideOut', duration: .45, callback: showRating, scope : this}).fadeOut();
	},

	// private
	rate : function(e){
		if(this.disabled) return;

		var hv = this.hoverValue;

		this.setValue(hv);
		this.setTopText(this.topText);					//revert to default text if set
		this.setBottomText(this.bottomText);			//revert to default text if set

		if (this.fireEvent("beforerating", this) === false){
			return;
		}

		//proceed when 'beforerating not false'
		this.removeHover(e);
		this.onBlur();
		this.rated = true;
		this.disabled = false;
		this.el.dom.readOnly = true						//set to readonly

		this.displayRating(hv, true);

		this.fireEvent("rate", this, hv); 
	},
	
	// private
	removeHover : function(e){
		if(this.disabled) return;

		var el = e.getTarget();
		Ext.fly(el).removeClass(this.hoverClass);
	},
	
	// private
	removeListeners : function(){
		this.wrap.select("*", true).removeAllListeners();
	},

	// private
	onDisable : function(){
		Ext.ux.form.Rater.superclass.onDisable.call(this);
		this.wrap.addClass('x-item-disabled');
	},

	// private
	onEnable : function(){
		Ext.ux.form.Rater.superclass.onEnable.call(this);
		this.wrap.removeClass('x-item-disabled');
	},
	
	// private
	onHide : function(){
		this.wrap.addClass('x-hidden');
	},

	// private
	onShow : function(){
		this.wrap.removeClass('x-hidden');
	}
});

Ext.reg('raterfield', Ext.ux.form.Rater);