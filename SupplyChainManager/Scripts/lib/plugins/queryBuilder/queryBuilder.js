Ext.override(Ext.data.Store,{
  addField: function(field){
    field = new Ext.data.Field(field);
    this.recordType.prototype.fields.replace(field);
    if(typeof field.defaultValue != 'undefined'){
      this.each(function(r){
        if(typeof r.data[field.name] == 'undefined'){
          r.data[field.name] = field.defaultValue;
        }
      });
    }
    delete this.reader.ef;
    this.reader.buildExtractors();
  },
  removeField: function(name){
    this.recordType.prototype.fields.removeKey(name);
    this.each(function(r){
      delete r.data[name];
      if(r.modified){
        delete r.modified[name];
      }
    });
    delete this.reader.ef;
    this.reader.buildExtractors();
  }
});
Ext.override(Ext.grid.ColumnModel,{
	addColumn: function(column, colIndex){
		if(typeof column == 'string'){
			column = {header: column, dataIndex: column};
		}
		var config = this.config;
		this.config = [];
		if(typeof colIndex == 'number'){
			config.splice(colIndex, 0, column);
		}else{
			colIndex = config.push(column);
		}
		this.setConfig(config);
		return colIndex;
	},
	removeColumn: function(colIndex){
		var config = this.config;
		this.config = [config[colIndex]];
		config.splice(colIndex, 1);
		this.setConfig(config);
	}
});
Ext.override(Ext.grid.GridPanel,{
	addColumn: function(field, column, colIndex){
		if(!column){
			if(field.dataIndex){
				column = field;
				field = field.dataIndex;
			} else{
				column = field.name || field;
			}
		}
		this.store.addField(field);
		return this.colModel.addColumn(column, colIndex);
	},
	removeColumn: function(name, colIndex){
		this.store.removeField(name);
		if(typeof colIndex != 'number'){
			colIndex = this.colModel.findColumnIndex(name);
		}
		if(colIndex >= 0){
			this.colModel.removeColumn(colIndex);
		}
	}
});

Ext.namespace('Ext.ux.QueryBuilder');

/****************************************************
 * Query Builder class.
 * 
 * Author: Surinder singh http://www.sencha.com/forum/member.php?75710-Surinder-singh, surinder83singh@gmail.com
 * @class Ext.ux.QueryBuilder
 ************************************************/
Ext.ux.QueryBuilder = function(config){
	Ext.apply( this, config );
	config.plain 		= true;
	config.layout		= 'border';	
	
	this.treePanel =  new Ext.tree.TreePanel({
        useArrows		: true,
        autoScroll		: true,
        animate			: true,
        enableDD		: false,
        containerScroll	: true,
        border			: false,
		rootVisible		: false,
		queryBuilder	: this,
        dataUrl			: config.treeDataUrl? config.treeDataUrl : '',
		listeners:{
			click:function( node ){				
				if( node.attributes.json ){
					this.queryBuilder.selectedNode = node;					
					var rowsArray = eval( node.attributes.json );
					this.queryBuilder.queryBuilderForm.loadSavedForm( rowsArray );
				}else{
					node.toggle();	
				}
			}
		},
        root: {
            nodeType	: 'async',
            draggable	: false,
            id			: 'Root'
        }
    });
	this.queryBuilderForm 		= new Ext.ux.QueryBuilderForm({
		fieldStoreUrl: config.fieldStoreUrl? config.fieldStoreUrl : '', 
		multipleValuesStoreUrl: config.multipleValuesStoreUrl? config.multipleValuesStoreUrl : '',
		listeners: {
			scope		: this,
			setRowState	: this.updateRecordCountLabel	
		}
	});
	this.hiddenFieldJson	 	= new Ext.form.Hidden({
		value	: '',
		name	: 'json'
	});
	this.hiddenFieldQueryId	 	= new Ext.form.Hidden({
		value	: 0,
		name	: 'id'
	});
	this.hiddenFieldFilter	 	= new Ext.form.Hidden({
		value	: 0,
		name	: 'filter'
	});
	this.fieldTitle	 			= new Ext.form.TextField({
		xtype		: 'textfield',
		fieldLabel	: 'Title',
		name		: 'title',
		width		: 150
	});
	this.fieldParentComboStore = new Ext.data.Store({       
		url: this.parentNodesComboStoreUrl? this.parentNodesComboStoreUrl: '',
		autoLoad:true,
		reader: new Ext.data.JsonReader({
			root: 'data',
			totalProperty: 'total',
			id: 'id'
		},[
			{name: 'id', type:'string'},
			{name: 'text', type:'string'}
		 ])
	});
	
	this.fieldParent		 	= new Ext.form.ComboBox({
		allowBlank: false,
		store: this.fieldParentComboStore,
		displayField	: 'text',
		valueField		: 'id',
		typeAhead		: true,
		width			: 150,
		mode			: 'local',
		forceSelection	: true,
		triggerAction	: 'all',
		selectOnFocus	: true,				
		fieldLabel		: 'Parent',
		hiddenField		: 'parent',
		name			: 'parent'
	});
	this.queryBuilderFormWindow = new Ext.ux.QueryBuilderFormWindow({
		renderTo		: document.body,
		idField			: this.hiddenFieldQueryId,
		queryBuilder	: this,
		filePath		: this.filePath,
		querySaveUrl	: config.querySaveUrl? config.querySaveUrl : '', 
		formDetails		: {
			layout			: 'form',
			labelWidth		: 50,
			border			: false,
			bodyStyle		: {'padding':'5px', 'background-color':'#F5F5F5'},
			items			: [ this.fieldParent, this.fieldTitle, this.hiddenFieldJson, this.hiddenFieldQueryId, this.hiddenFieldFilter ]
		},
		listeners: {
			save: function( form, id ){
				var title 		= this.queryBuilder.fieldTitle.getValue();
				var json 		= this.queryBuilder.hiddenFieldJson.getValue();
				var parentId 	= this.queryBuilder.fieldParent.getValue();
				
				if( this.queryBuilder.selectedNode && this.queryBuilder.selectedNode.id == id ){//update old record
					this.queryBuilder.selectedNode.setText( title );
					this.queryBuilder.selectedNode.attributes.json = json;
					//check if  parent have been changed
					if( parentId != this.queryBuilder.selectedNode.parentNode.id ){
						//remove the node from old parentNode
						this.queryBuilder.selectedNode.remove();
						var parentNode = this.queryBuilder.treePanel.getNodeById( parentId );						
						if( parentNode ){
							this.queryBuilder.selectedNode = parentNode.appendChild({text:title, json:json, id:id, leaf:true});
						}
					}					
				}else{//add new node
					var parentNode = this.queryBuilder.treePanel.getNodeById( parentId );
					if( parentNode ){
						this.queryBuilder.selectedNode = parentNode.appendChild({text:title, json:json, id:id, leaf:true});
					}
				}
			}	
		}
	}); 
	this.recordCountLabel = new Ext.Toolbar.TextItem({
		text: '# Records'
	});
	config.items=[{
		region		: 'west',
		split		: true,
		collapsible	: true,
		title		: 'Queries',
		minSize		: 100,
		maxSize		: 300,
		width		: 150,
		autoScroll	: true,
		items		: this.treePanel
	},{
		region		: 'center',
		title		: 'Search conditions',
		minSize		: 375,
		autoScroll	: true,
		bbar: [this.recordCountLabel, '->', {
				text: 'New',
				icon : this.filePath+'icons/new2.png',
				scope: this, 
				handler: function(){
					this.selectedNode = null;
					this.hiddenFieldQueryId.setValue( 0 );
					this.fieldTitle.setValue( '' );
					this.hiddenFieldJson.setValue( '' );
					this.hiddenFieldFilter.setValue( '' );
					this.queryBuilderForm.loadSavedForm( [] )
				}
			},{
				text:'Run',
				icon : this.filePath+'icons/run2.png',
				scope: this, 
				handler: function(){					
					var filter	= this.getFilter();
					this.addRemoveAdditionalFields();//added for additional fields , v-1.3
					this.fireEvent('run', { filter: filter } );
					if( this.hideOnRun ){
						this.hide();	
					}
				}
			},{
				text	: 'Save',
				icon 	: this.filePath+'icons/save2.png',
				scope	: this, 
				handler	: function( button ){
					var isValid = this.queryBuilderForm.validateQueryForm();
					if( isValid ){
						this.queryBuilderFormWindow.show(button.getEl(), false);
						
						/*Set the field values */
						var filter 	= this.getFilter();
						var json  	= Ext.encode( this.queryBuilderForm.rowStates );
						this.hiddenFieldJson.setValue( json );
						this.hiddenFieldFilter.setValue( filter );
						if( this.selectedNode ){
							this.hiddenFieldQueryId.setValue( this.selectedNode.id );					
							this.fieldTitle.setValue( this.selectedNode.text );
							this.fieldParent.setValue( this.selectedNode.parentNode.id );
						} 
					}else{
						Ext.MessageBox.alert( 'Error', 'Error in form. Please correct the invalid fields' );	
					}
				}
			},{
				text	: 'Clear All',
				icon 	: this.filePath+'icons/clearAll.png',
				scope	: this, 
				handler	: function(){
					this.queryBuilderForm.loadSavedForm( [] );	
				}
			}
		],
		items: this.queryBuilderForm
	}];
	Ext.ux.QueryBuilder.superclass.constructor.call(this, config);
	this.addEvents( 'save', 'run' );
};

Ext.extend(Ext.ux.QueryBuilder, Ext.Window, {
    modal: true,
	closeAction		: 'hide',
	hideOnRun		: true,
	filePath		: '',
	addRemoveAdditionalFields: function(){//add-remove the additional fields required for current query
		if(this.grid){
			var grid				= this.grid;
			var additionalFields 	= this.queryBuilderForm.additionalFields;
			var cm 					= this.grid.getColumnModel();
			var cols 				= cm.config;
			var i					= 0;
			for(i=0; i<10;i++){
				Ext.each(cols, function(col, colindex) {
					if (col && col.mandatory===false) {						
						grid.removeColumn(col.dataIndex);
						grid.getView().refresh( true );
					}
				});
			}
			var added		= [];
			Ext.each(additionalFields, function(field){
				//console.dir(field);
				if(added.indexOf(field.dataIndex)<0){
					added.push(field.dataIndex);
					grid.addColumn({name: field.dataIndex, defaultValue:  field.defaultValue?field.defaultValue:''}, {mandatory:false, header: field.name?field.name:field.dataIndex, dataIndex: field.dataIndex});
				}
			});
			
		}
	},
	showRecordCount : function(result){
		var count = result.responseText;
		
		this.recordCountLabel.removeClass('loading-indicator');
		if( count >1 ){
			this.recordCountLabel.setText(count+" Records");
		}else if(count==1){
			this.recordCountLabel.setText(count+" Record");
		}else{
			this.recordCountLabel.setText("No Record");
		}
	},
	updateRecordCountLabel	: function(){
		this.recordCountLabel.setText("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		this.recordCountLabel.addClass('loading-indicator');
		
		Ext.Ajax.request({
			url: this.countRecordUrl,
			success: this.showRecordCount,
			params: { filter: this.getFilter()  },
			scope: this
		});
	},
	getFilter 		: function(){
		return  this.queryBuilderForm.generateSqlFilter();		
	}
});
