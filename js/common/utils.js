/**
 *
 * @param {Function} func 需要节流的函数
 * @param {Number} wait 间隔时间
 * @param {Object} options 选项，options.leading表示刚开始时是否执行，options.trailing表示结束时是否执行
 */
export function throttle(func, wait, options) {
    let timeout, context, args;
    let previous = 0;
    if (!options) options = {};

    let later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    let throttled = function() {
        let now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };
    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    }
    return throttled;
}