/*
 * @Description: 工具方法
 * @Author: Haor
 * @Date: 2021-03-19
 */

;(function (win) {
    function Utils() {
        this.version = 'V1.0.0'
        this.auth = 'haor';
    }

    /**
     * 获取数据类型
     * @param {*} data
     * @return {String} array|object|function...
     */
    Utils.prototype.getType = function (data) {
        return  Object.prototype.toString.call(data)
            .replace('[object ', '')
            .slice(0, -1)
            .toLowerCase();
    }

    /**
     * 继承
     */
    Utils.prototype.extend = function (target, extTarget) {
        //方法
        if (typeof target === 'object') {
            if (typeof extTarget === 'function') {
                extTarget.call(target);
                for (var k in extTarget.prototype) {
                    target.__proto__[k] = extTarget.prototype[k];
                }
            }

            if (typeof extTarget === 'object') {
                for (var k in extTarget) {
                    target[k] = extTarget[k];
                }
            }
        }

        //构造函数
        if (typeof target === 'function') {
            var data = null;
            if (typeof extTarget === 'object') {
                data = extTarget;
            } 
            if (typeof extTarget === 'function') {
                data = extTarget.prototype;
            }
            for (var k in extTarget.prototype) {
                target.prototype[k] = extTarget.prototype[k];
            }
        }
        
        return target;
    }

    /**
     * 防抖函数
     * @param {Function} fn
     * @param {Number} wait
     */
    Utils.prototype.debounce = function (fn, wait) {
        var timer = null;
        wait = wait || 300;
        return function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(fn.bind(this), wait) 
        }
    }

    
    /**
     * 深度克隆
     * @param {Array|Object} 拷贝的源数据
     * @returns {Array|Object}
     */
    Utils.prototype.deepClone = function (source) {
        var res = Array.isArray(source) ? [] : {};
        var sourceKeys = Object.keys(source);
        for (var i = 0, len = sourceKeys.length; i < len; i++) {
            var dataKey = sourceKeys[i];
            var isReferenceType = ['object', 'array'].indexOf(this.getType(source[dataKey])) !== -1; //是否为引用类型
            if (isReferenceType) {
                res[dataKey] = this.deepClone(source[dataKey]);
            } else {
                res[dataKey] = source[dataKey];
            }
        }
        return res;
    }

    //export
    win.utils = win.utils || new Utils();
})(window);