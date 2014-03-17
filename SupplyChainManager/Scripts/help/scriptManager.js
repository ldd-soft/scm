/**
* Script Manager class
*/
Ext.ux.ScriptManager = Ext.extend(Ext.util.Observable, {
    // The timeout in seconds to be used for requests
    timeout: 30,

    /**
    * @private
    * Array which will hold the scripts
    */
    scripts: [],

    // Whether to cache the javascript files or not
    disableCaching: false,

    /**
    * @constructor
    * 
    * Component constructor
    */
    constructor: function (config) {
        Ext.apply(this, config);

        // Call our superclass constructor to complete construction process.
        Ext.ux.ScriptManager.superclass.constructor.call(this, config)
    },

    /**
    * Accepts the config for loading Javascript files
    * @param {Object} o Config options
    */
    loadJs: function (o) {
        if (!o) {
            return;
        }

        if (o.debug) {
            this.addAsScript(o);
            return;
        }

        if (!Ext.isArray(o.scripts)) {
            o.scripts = [o.scripts];
        }

        o.url = o.scripts.shift();

        if (o.scripts.length == 0) {
            this._loadUrl(o);
        } else {
            o.scope = this;
            this._loadUrl(o, function () {
                this.loadJs(o);
            });
        }
    },

    /**
    * Loads the css files dynamically
    *
    * @param {Object} o Config options -
    * {Array} scripts Array of css file paths |
    * {String} id Any existing css file with this id will be overwritten by the new file |
    * {Function} callback Function to be called once the files are loaded | 
    * {Object} scope On this scope the callback function will be called
    *
    * @returns void
    */
    loadCss: function (o) {
        var id = o.id || '';
        var file;

        if (!Ext.isArray(o.scripts)) {
            o.scripts = [o.scripts];
        }

        for (var i = 0; i < o.scripts.length; i++) {
            file = o.scripts[i];
            id = '' + Math.floor(Math.random() * 100);
            Ext.util.CSS.createStyleSheet('', id);
            Ext.util.CSS.swapStyleSheet(id, file);
        }

        if (o.callback && Ext.isFunction(o.callback)) {
            o.callback.createDelegate(o.scope || window).call();
        }
    },

    /**
    * Adds the JS and CSS files as respective tags in DOM. This feature is used in debug:true option
    * @param {Object} o Config options
    * @returns void
    */
    addAsScript: function (o) {
        var count = 0;
        var script;
        var files = o.scripts;
        if (!Ext.isArray(files)) {
            files = [files];
        }

        var head = document.getElementsByTagName('head')[0];

        Ext.each(files, function (file) {
            script = document.createElement('script');
            script.type = 'text/javascript';
            if (Ext.isFunction(o.callback)) {
                script.onload = script.onreadystatechange = function () {
                    count++;
                    if (count == files.length) {
                        o.callback.call();
                    }
                }
            }
            script.src = file;
            head.appendChild(script);
        });
    },

    /**
    * @private
    *
    * Sends the AJAX request for loading the Javascript file
    * @param {String} url Url of the file to be loaded or the 
    * config object with array of urls ans other config options
    *
    * @param {Function} callback Callback function which 
    * will be called once all the files are loaded
    *
    * @returns Null
    */
    _loadUrl: function (url, callback) {
        var cfg, callerScope;

        // If
        if (typeof url == 'object') { // must be config object
            cfg = url;
            url = cfg.url;
            callback = callback || cfg.callback;
            callerScope = cfg.scope;
            if (typeof cfg.timeout != 'undefined') {
                this.timeout = cfg.timeout;
            }
            if (typeof cfg.disableCaching != 'undefined') {
                this.disableCaching = cfg.disableCaching;
            }
        }

        // If the url exists in the scripts array, then call the callback function
        // This works as an recursive function call for multiple files
        if (this.scripts[url]) {
            if (callback && Ext.isFunction(callback)) {
                callback.createDelegate(callerScope || window).call();
            }
            return null;
        }

        // Ajax request for loading the file
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            success: this.processSuccess,
            failure: this.processFailure,
            scope: this,
            timeout: (this.timeout * 1000),
            disableCaching: this.disableCaching,
            argument: {
                'url': url + '?ver=' + new Date().getTime(),
                'scope': callerScope || window,
                'callback': callback,
                'options': cfg
            }
        });

        return null;

    },

    /**
    * @private
    * Function will be called if Ajax loading of scripts are successfull
    * @param {Object} response Ajax response object which will contain the script file content
    * @returns void
    */
    processSuccess: function (response) {
        this.scripts[response.argument.url] = true;
        window.execScript ? window.execScript(response.responseText) : window
        .eval(response.responseText);
        if (response.argument.options.scripts.length == 0) {
        }
        if (typeof response.argument.callback == 'function') {
            response.argument.callback.call(response.argument.scope);
        }
    },

    /**
    * @private
    * Function will be called if Ajax loading of scripts fails. It shows an error alert
    * @param {Object} response Ajax response object which will contain the script file content
    * @returns void
    */
    processFailure: function (response) {
        Ext.MessageBox.show({
            title: 'Application Error',
            msg: 'Script library could not be loaded.',
            closable: false,
            icon: Ext.MessageBox.ERROR,
            minWidth: 200,
            buttons: Ext.Msg.OK
        });
        setTimeout(function () {
            Ext.MessageBox.hide();
        }, 2000);
    }
});

// Create an instance of the Script Manager
ScriptMgr = new Ext.ux.ScriptManager();
