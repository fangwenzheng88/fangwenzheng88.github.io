[toc]

> 观察者模式（observer）广泛的应用于javascript语言中，浏览器事件（如鼠标单击click，键盘事件keyDown）都是该模式的例子。设计这种模式背后的主要原因是促进形成低耦合，在这种模式中不是简单的对象调用对象，而是一个对象“订阅”另一个对象的某个活动，当对象的活动状态发生了改变，就去通知订阅者，而订阅者也称为观察者。

<!-- more -->

# EventEmitter 事件触发器

主要包括三样：

* 事件监听(on)
* 事件触发(emit)
* 事件销毁(off)

```
const toString = Object.prototype.toString;
const isType = obj => toString.call(obj).slice(8, -1).toLowerCase();
const isArray = obj => Array.isArray(obj) || isType(obj) === 'array';
const isNullOrUndefined = obj => obj === null || obj === undefined;
function _EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}

function _addListener(type, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn must be a function');
    }
    var listener = new _EE(fn, context || this, once);
    (this._events[type] || (this._events[type] = [])).push(listener);
    return this;
};

class EventEmitter {
    constructor() {
        if (this._events === undefined) {
            this._events = Object.create(null);
        }
    }

    on(type, fn, context) {
        return _addListener.call(this, type, fn, context);
    }

    once(type, fn, context) {
        return _addListener.call(this, type, fn, context, true);
    }

    emit(type, ...args) {
        const listeners = this._events[type];

        if (isNullOrUndefined(listeners)) return false;
        let i = listeners.length;
        while (i--) {
            let e = listeners[i];
            e.fn.apply(e.context || null, args);
            if (e.once) {
                if (listeners.length === 1) {
                    delete this._events[type];
                } else {
                    listeners.splice(i, 1);
                }
            }
        }

        return true;
    }

    off(type, fn) {
        const listeners = this._events[type];

        if (isArray(listeners)) {
            const i = listeners.findIndex(function (e) {
                return e.fn === fn;
            });

            if (i !== -1) {
                if (listeners.length === 1) {
                    delete this._events[type];
                } else {
                    listeners.splice(i, 1);
                }
            }
        }

        return this;
    }

    offAll(type) {
        const events = this._events[type];
        if (!isNullOrUndefined(events)) {
            delete this._events[type];
        }
        return this;
    }
}

export default EventEmitter;
```
