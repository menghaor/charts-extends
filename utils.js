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
     * 继承
     */
    Utils.prototype.extend = function (target, extTarget) {
        //方法
        if (typeof target === 'object') {
            if (extTarget === 'function') {
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

    //export
    win.utils = win.utils || new Utils();
})(window);