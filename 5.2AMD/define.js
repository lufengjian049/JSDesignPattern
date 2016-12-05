(function(win, doc){

    var moduleCache = {};

    var t = /(\S+)define\.js(?:\?pro=(\S+))?/.exec(getCurrentUrl()),
        lib = t[1],
        pro = t[2] || '/',
        dir = win.location.href;
    var tReg = /^\.\/|^\//;

    while (tReg.test(pro)) {
        pro = pro.replace(tReg, '')
    }

    var backCount = 0;
    tReg = /^\.\.\//;
    while (tReg.test(pro)) {
        backCount++;
        pro = pro.replace(tReg, '')
    }

    pro = backUrl(lib, backCount) + pro;


    var tplReg = /\.html$/;


    function getCurrentUrl(){
        return document.currentScript.src;
    }

    function backUrl(url, count) {
        for (var i = 0; i < count; i++) {
            url = url.replace(/[^/]+\/?$/, '');
        }
        return url;
    }

    function fixUrl(url) {
        if (tplReg.test(url)) {
            if (/^\{lib\}/.test(url)){
                return url.replace(/^\{lib\}/, lib);
            } else if (/^\{pro\}/.test(url)) {
                return url.replace(/^\{pro\}/, pro);
            } else {
                return url;
            }
        }
        return url.replace(/^\{lib\}/, lib).replace(/^\{pro\}/, pro).replace(/\.js$/g, '') + '.js';
    }

    function loadScript(url) {
        var _script = document.createElement('script');
        _script.charset = 'utf-8';
        _script.async = true;
        _script.src = fixUrl(url);
        document.body.appendChild(_script);
    }

    function defineModule(uuid, mParams, callback) {
        if (moduleCache[uuid]) {
            var _module = moduleCache[uuid];
            _module.status = 'loaded';
            _module.exports = callback ? callback.apply(_module, mParams) : null;
            while (fn = _module.onload.shift()) {
                fn(_module.exports);
            }
        } else {
            moduleCache[uuid] = {
                uuid: uuid,
                status: 'loaded',
                exports: callback && callback.apply(null, mParams),
                onload: []
            }
        }
    }


    function loadModule(uuid, callback) {
        var _module;
        if (moduleCache[uuid]) {
            _module = moduleCache[uuid];
            if (_module.status == 'loaded') {
                setTimeout(callback(_module.exports), 0);
            } else {
                _module.onload.push(callback);
            }
        } else {
            moduleCache[uuid] = {
                uuid: uuid,
                status: 'loading',
                exports: null,
                onload: [callback]
            };
            loadScript(uuid);
        }
    }


    var define = function(modules, callback) {
        
        modules = Array.isArray(modules) ? modules : [];

        for (var i = 0, len = modules.length; i < len; i++) {

            modules[i] = fixUrl(modules[i]);
        }

        var uuid = getCurrentUrl(),
            mlen = modules.length,
            mParams = [],
            i = 0,
            loadCount = 0;

        if (mlen) {
            while (i < mlen) {
                loadCount++;
                (function(i){
                    if (tplReg.test(modules[i])) {
                        loadText(modules[i], function(_json){
                            
                            var tpl = '';

                            if (_json.code == 200) {
                                tpl = _json.result;
                            }
                            loadCount--;
                            mParams[i] = tpl;
                            if (loadCount == 0) {
                                defineModule(uuid, mParams, callback);
                            }
                        })
                    } else {

                        loadModule(modules[i], function(module) {
                            loadCount--;
                            mParams[i] = module;
                            if (loadCount == 0) {
                                setModule(uuid, mParams, callback);
                            }

                        });
                    }

                })(i);
                i++;
            }
        } else {
            defineModule(uuid, [], callback)
        }


    }


    function loadText(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    var code = 200;
                } else {
                    code = xhr.status;
                }
                callback({
                    code: code,
                    result: xhr.responseText
                })
            }
        }
    }


    loadScript(fixUrl('{lib}router'));

    win.define = define;

    win.gObj = {
        loadScript: loadScript,
        loadText: loadText,
        lib: lib,
        pro: pro,
        fixUrl: fixUrl
    }

})(window, document)