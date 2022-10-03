var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (d) {
    return d.raw = d
};
$jscomp.createTemplateTagFirstArgWithRaw = function (d, f) {
    d.raw = f;
    return d
};
$jscomp.arrayIteratorImpl = function (d) {
    var f = 0;
    return function () {
        return f < d.length ? {
            done: !1,
            value: d[f++]
        } : {
            done: !0
        }
    }
};
$jscomp.arrayIterator = function (d) {
    return {
        next: $jscomp.arrayIteratorImpl(d)
    }
};
$jscomp.makeIterator = function (d) {
    var f = "undefined" != typeof Symbol && Symbol.iterator && d[Symbol.iterator];
    return f ? f.call(d) : $jscomp.arrayIterator(d)
};
$jscomp.owns = function (d, f) {
    return Object.prototype.hasOwnProperty.call(d, f)
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (d, f, c) {
    if (d == Array.prototype || d == Object.prototype) return d;
    d[f] = c.value;
    return d
};
$jscomp.getGlobal = function (d) {
    d = ["object" == typeof globalThis && globalThis, d, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var f = 0; f < d.length; ++f) {
        var c = d[f];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (d, f) {
    var c = $jscomp.propertyToPolyfillSymbol[f];
    if (null == c) return d[f];
    c = d[c];
    return void 0 !== c ? c : d[f]
};
$jscomp.polyfill = function (d, f, c, g) {
    f && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(d, f, c, g) : $jscomp.polyfillUnisolated(d, f, c, g))
};
$jscomp.polyfillUnisolated = function (d, f, c, g) {
    c = $jscomp.global;
    d = d.split(".");
    for (g = 0; g < d.length - 1; g++) {
        var b = d[g];
        if (!(b in c)) return;
        c = c[b]
    }
    d = d[d.length - 1];
    g = c[d];
    f = f(g);
    f != g && null != f && $jscomp.defineProperty(c, d, {
        configurable: !0,
        writable: !0,
        value: f
    })
};
$jscomp.polyfillIsolated = function (d, f, c, g) {
    var b = d.split(".");
    d = 1 === b.length;
    g = b[0];
    g = !d && g in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var a = 0; a < b.length - 1; a++) {
        var e = b[a];
        if (!(e in g)) return;
        g = g[e]
    }
    b = b[b.length - 1];
    c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? g[b] : null;
    f = f(c);
    null != f && (d ? $jscomp.defineProperty($jscomp.polyfills, b, {
        configurable: !0,
        writable: !0,
        value: f
    }) : f !== c && (void 0 === $jscomp.propertyToPolyfillSymbol[b] && (c = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[b] = $jscomp.IS_SYMBOL_NATIVE ?
        $jscomp.global.Symbol(b) : $jscomp.POLYFILL_PREFIX + c + "$" + b), $jscomp.defineProperty(g, $jscomp.propertyToPolyfillSymbol[b], {
            configurable: !0,
            writable: !0,
            value: f
        })))
};
$jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function (d, f) {
    for (var c = 1; c < arguments.length; c++) {
        var g = arguments[c];
        if (g)
            for (var b in g) $jscomp.owns(g, b) && (d[b] = g[b])
    }
    return d
};
$jscomp.polyfill("Object.assign", function (d) {
    return d || $jscomp.assign
}, "es6", "es3");
$jscomp.underscoreProtoCanBeSet = function () {
    var d = {
        a: !0
    },
        f = {};
    try {
        return f.__proto__ = d, f.a
    } catch (c) { }
    return !1
};
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (d, f) {
    d.__proto__ = f;
    if (d.__proto__ !== f) throw new TypeError(d + " is not extensible");
    return d
} : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (d) {
    if (!(d instanceof Object)) throw new TypeError("Iterator result " + d + " is not an object");
};
$jscomp.generator.Context = function () {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function () {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function () {
    this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function (d) {
    this.yieldResult = d
};
$jscomp.generator.Context.prototype.throw_ = function (d) {
    this.abruptCompletion_ = {
        exception: d,
        isException: !0
    };
    this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype["return"] = function (d) {
    this.abruptCompletion_ = {
        "return": d
    };
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (d) {
    this.abruptCompletion_ = {
        jumpTo: d
    };
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function (d, f) {
    this.nextAddress = f;
    return {
        value: d
    }
};
$jscomp.generator.Context.prototype.yieldAll = function (d, f) {
    var c = $jscomp.makeIterator(d),
        g = c.next();
    $jscomp.generator.ensureIteratorResultIsObject_(g);
    if (g.done) this.yieldResult = g.value, this.nextAddress = f;
    else return this.yieldAllIterator_ = c, this.yield(g.value, f)
};
$jscomp.generator.Context.prototype.jumpTo = function (d) {
    this.nextAddress = d
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
    this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (d, f) {
    this.catchAddress_ = d;
    void 0 != f && (this.finallyAddress_ = f)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (d) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = d || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (d, f) {
    this.nextAddress = d;
    this.catchAddress_ = f || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (d) {
    this.catchAddress_ = d || 0;
    d = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return d
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (d, f, c) {
    c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = d || 0;
    this.finallyAddress_ = f || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (d, f) {
    var c = this.finallyContexts_.splice(f || 0)[0];
    if (c = this.abruptCompletion_ = this.abruptCompletion_ || c) {
        if (c.isException) return this.jumpToErrorHandler_();
        void 0 != c.jumpTo && this.finallyAddress_ < c.jumpTo ? (this.nextAddress = c.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else this.nextAddress = d
};
$jscomp.generator.Context.prototype.forIn = function (d) {
    return new $jscomp.generator.Context.PropertyIterator(d)
};
$jscomp.generator.Context.PropertyIterator = function (d) {
    this.object_ = d;
    this.properties_ = [];
    for (var f in d) this.properties_.push(f);
    this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
    for (; 0 < this.properties_.length;) {
        var d = this.properties_.pop();
        if (d in this.object_) return d
    }
    return null
};
$jscomp.generator.Engine_ = function (d) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = d
};
$jscomp.generator.Engine_.prototype.next_ = function (d) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, d, this.context_.next_);
    this.context_.next_(d);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function (d) {
    this.context_.start_();
    var f = this.context_.yieldAllIterator_;
    if (f) return this.yieldAllStep_("return" in f ? f["return"] : function (c) {
        return {
            value: c,
            done: !0
        }
    }, d, this.context_["return"]);
    this.context_["return"](d);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function (d) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], d, this.context_.next_);
    this.context_.throw_(d);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (d, f, c) {
    try {
        var g = d.call(this.context_.yieldAllIterator_, f);
        $jscomp.generator.ensureIteratorResultIsObject_(g);
        if (!g.done) return this.context_.stop_(), g;
        var b = g.value
    } catch (a) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(a), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    c.call(this.context_, b);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
    for (; this.context_.nextAddress;) try {
        var d = this.program_(this.context_);
        if (d) return this.context_.stop_(), {
            value: d.value,
            done: !1
        }
    } catch (f) {
        this.context_.yieldResult = void 0, this.context_.throw_(f)
    }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        d = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (d.isException) throw d.exception;
        return {
            value: d["return"],
            done: !0
        }
    }
    return {
        value: void 0,
        done: !0
    }
};
$jscomp.generator.Generator_ = function (d) {
    this.next = function (f) {
        return d.next_(f)
    };
    this["throw"] = function (f) {
        return d.throw_(f)
    };
    this["return"] = function (f) {
        return d.return_(f)
    };
    this[Symbol.iterator] = function () {
        return this
    }
};
$jscomp.generator.createGenerator = function (d, f) {
    var c = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(f));
    $jscomp.setPrototypeOf && d.prototype && $jscomp.setPrototypeOf(c, d.prototype);
    return c
};
$jscomp.asyncExecutePromiseGenerator = function (d) {
    function f(g) {
        return d.next(g)
    }

    function c(g) {
        return d["throw"](g)
    }
    return new Promise(function (g, b) {
        function a(e) {
            e.done ? g(e.value) : Promise.resolve(e.value).then(f, c).then(a, b)
        }
        a(d.next())
    })
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (d) {
    return $jscomp.asyncExecutePromiseGenerator(d())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (d) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(d)))
};
$jscomp.initSymbol = function () { };
$jscomp.polyfill("Symbol", function (d) {
    if (d) return d;
    var f = function (a, e) {
        this.$jscomp$symbol$id_ = a;
        $jscomp.defineProperty(this, "description", {
            configurable: !0,
            writable: !0,
            value: e
        })
    };
    f.prototype.toString = function () {
        return this.$jscomp$symbol$id_
    };
    var c = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_",
        g = 0,
        b = function (a) {
            if (this instanceof b) throw new TypeError("Symbol is not a constructor");
            return new f(c + (a || "") + "_" + g++, a)
        };
    return b
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function (d) {
    if (d) return d;
    d = Symbol("Symbol.iterator");
    for (var f = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < f.length; c++) {
        var g = $jscomp.global[f[c]];
        "function" === typeof g && "function" != typeof g.prototype[d] && $jscomp.defineProperty(g.prototype, d, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
            }
        })
    }
    return d
}, "es6",
    "es3");
$jscomp.iteratorPrototype = function (d) {
    d = {
        next: d
    };
    d[Symbol.iterator] = function () {
        return this
    };
    return d
};
$jscomp.polyfill("Promise", function (d) {
    function f() {
        this.batch_ = null
    }

    function c(e) {
        return e instanceof b ? e : new b(function (h, k) {
            h(e)
        })
    }
    if (d && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return d;
    f.prototype.asyncExecute = function (e) {
        if (null == this.batch_) {
            this.batch_ = [];
            var h = this;
            this.asyncExecuteFunction(function () {
                h.executeBatch_()
            })
        }
        this.batch_.push(e)
    };
    var g = $jscomp.global.setTimeout;
    f.prototype.asyncExecuteFunction = function (e) {
        g(e, 0)
    };
    f.prototype.executeBatch_ = function () {
        for (; this.batch_ && this.batch_.length;) {
            var e = this.batch_;
            this.batch_ = [];
            for (var h = 0; h < e.length; ++h) {
                var k = e[h];
                e[h] = null;
                try {
                    k()
                } catch (l) {
                    this.asyncThrow_(l)
                }
            }
        }
        this.batch_ = null
    };
    f.prototype.asyncThrow_ = function (e) {
        this.asyncExecuteFunction(function () {
            throw e;
        })
    };
    var b = function (e) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = !1;
        var h = this.createResolveAndReject_();
        try {
            e(h.resolve, h.reject)
        } catch (k) {
            h.reject(k)
        }
    };
    b.prototype.createResolveAndReject_ = function () {
        function e(l) {
            return function (n) {
                k || (k = !0, l.call(h, n))
            }
        }
        var h = this,
            k = !1;
        return {
            resolve: e(this.resolveTo_),
            reject: e(this.reject_)
        }
    };
    b.prototype.resolveTo_ = function (e) {
        if (e === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (e instanceof b) this.settleSameAsPromise_(e);
        else {
            a: switch (typeof e) {
                case "object":
                    var h = null != e;
                    break a;
                case "function":
                    h = !0;
                    break a;
                default:
                    h = !1
            }
            h ? this.resolveToNonPromiseObj_(e) : this.fulfill_(e)
        }
    };
    b.prototype.resolveToNonPromiseObj_ = function (e) {
        var h = void 0;
        try {
            h = e.then
        } catch (k) {
            this.reject_(k);
            return
        }
        "function" == typeof h ? this.settleSameAsThenable_(h, e) : this.fulfill_(e)
    };
    b.prototype.reject_ = function (e) {
        this.settle_(2, e)
    };
    b.prototype.fulfill_ = function (e) {
        this.settle_(1, e)
    };
    b.prototype.settle_ = function (e, h) {
        if (0 != this.state_) throw Error("Cannot settle(" + e + ", " + h + "): Promise already settled in state" + this.state_);
        this.state_ = e;
        this.result_ = h;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_()
    };
    b.prototype.scheduleUnhandledRejectionCheck_ = function () {
        var e = this;
        g(function () {
            if (e.notifyUnhandledRejection_()) {
                var h = $jscomp.global.console;
                "undefined" !== typeof h && h.error(e.result_)
            }
        }, 1)
    };
    b.prototype.notifyUnhandledRejection_ = function () {
        if (this.isRejectionHandled_) return !1;
        var e = $jscomp.global.CustomEvent,
            h = $jscomp.global.Event,
            k = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof k) return !0;
        "function" === typeof e ? e = new e("unhandledrejection", {
            cancelable: !0
        }) :
            "function" === typeof h ? e = new h("unhandledrejection", {
                cancelable: !0
            }) : (e = $jscomp.global.document.createEvent("CustomEvent"), e.initCustomEvent("unhandledrejection", !1, !0, e));
        e.promise = this;
        e.reason = this.result_;
        return k(e)
    };
    b.prototype.executeOnSettledCallbacks_ = function () {
        if (null != this.onSettledCallbacks_) {
            for (var e = 0; e < this.onSettledCallbacks_.length; ++e) a.asyncExecute(this.onSettledCallbacks_[e]);
            this.onSettledCallbacks_ = null
        }
    };
    var a = new f;
    b.prototype.settleSameAsPromise_ = function (e) {
        var h = this.createResolveAndReject_();
        e.callWhenSettled_(h.resolve, h.reject)
    };
    b.prototype.settleSameAsThenable_ = function (e, h) {
        var k = this.createResolveAndReject_();
        try {
            e.call(h, k.resolve, k.reject)
        } catch (l) {
            k.reject(l)
        }
    };
    b.prototype.then = function (e, h) {
        function k(p, q) {
            return "function" == typeof p ? function (r) {
                try {
                    l(p(r))
                } catch (u) {
                    n(u)
                }
            } : q
        }
        var l, n, m = new b(function (p, q) {
            l = p;
            n = q
        });
        this.callWhenSettled_(k(e, l), k(h, n));
        return m
    };
    b.prototype["catch"] = function (e) {
        return this.then(void 0, e)
    };
    b.prototype.callWhenSettled_ = function (e, h) {
        function k() {
            switch (l.state_) {
                case 1:
                    e(l.result_);
                    break;
                case 2:
                    h(l.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + l.state_);
            }
        }
        var l = this;
        null == this.onSettledCallbacks_ ? a.asyncExecute(k) : this.onSettledCallbacks_.push(k);
        this.isRejectionHandled_ = !0
    };
    b.resolve = c;
    b.reject = function (e) {
        return new b(function (h, k) {
            k(e)
        })
    };
    b.race = function (e) {
        return new b(function (h, k) {
            for (var l = $jscomp.makeIterator(e), n = l.next(); !n.done; n = l.next()) c(n.value).callWhenSettled_(h, k)
        })
    };
    b.all = function (e) {
        var h = $jscomp.makeIterator(e),
            k = h.next();
        return k.done ? c([]) : new b(function (l,
            n) {
            function m(r) {
                return function (u) {
                    p[r] = u;
                    q--;
                    0 == q && l(p)
                }
            }
            var p = [],
                q = 0;
            do p.push(void 0), q++, c(k.value).callWhenSettled_(m(p.length - 1), n), k = h.next(); while (!k.done)
        })
    };
    return b
}, "es6", "es3");
$jscomp.iteratorFromArray = function (d, f) {
    d instanceof String && (d += "");
    var c = 0,
        g = !1,
        b = {
            next: function () {
                if (!g && c < d.length) {
                    var a = c++;
                    return {
                        value: f(a, d[a]),
                        done: !1
                    }
                }
                g = !0;
                return {
                    done: !0,
                    value: void 0
                }
            }
        };
    b[Symbol.iterator] = function () {
        return b
    };
    return b
};
$jscomp.polyfill("Array.prototype.keys", function (d) {
    return d ? d : function () {
        return $jscomp.iteratorFromArray(this, function (f) {
            return f
        })
    }
}, "es6", "es3");
$jscomp.findInternal = function (d, f, c) {
    d instanceof String && (d = String(d));
    for (var g = d.length, b = 0; b < g; b++) {
        var a = d[b];
        if (f.call(c, a, b, d)) return {
            i: b,
            v: a
        }
    }
    return {
        i: -1,
        v: void 0
    }
};
$jscomp.polyfill("Array.prototype.find", function (d) {
    return d ? d : function (f, c) {
        return $jscomp.findInternal(this, f, c).v
    }
}, "es6", "es3");
$jscomp.polyfill("Object.is", function (d) {
    return d ? d : function (f, c) {
        return f === c ? 0 !== f || 1 / f === 1 / c : f !== f && c !== c
    }
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function (d) {
    return d ? d : function (f, c) {
        var g = this;
        g instanceof String && (g = String(g));
        var b = g.length,
            a = c || 0;
        for (0 > a && (a = Math.max(a + b, 0)); a < b; a++) {
            var e = g[a];
            if (e === f || Object.is(e, f)) return !0
        }
        return !1
    }
}, "es7", "es3");
$jscomp.checkStringArgs = function (d, f, c) {
    if (null == d) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
    if (f instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
    return d + ""
};
$jscomp.polyfill("String.prototype.includes", function (d) {
    return d ? d : function (f, c) {
        return -1 !== $jscomp.checkStringArgs(this, f, "includes").indexOf(f, c || 0)
    }
}, "es6", "es3");
$jscomp.polyfill("String.prototype.startsWith", function (d) {
    return d ? d : function (f, c) {
        var g = $jscomp.checkStringArgs(this, f, "startsWith");
        f += "";
        for (var b = g.length, a = f.length, e = Math.max(0, Math.min(c | 0, g.length)), h = 0; h < a && e < b;)
            if (g[e++] != f[h++]) return !1;
        return h >= a
    }
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.fill", function (d) {
    return d ? d : function (f, c, g) {
        var b = this.length || 0;
        0 > c && (c = Math.max(0, b + c));
        if (null == g || g > b) g = b;
        g = Number(g);
        0 > g && (g = Math.max(0, b + g));
        for (c = Number(c || 0); c < g; c++) this[c] = f;
        return this
    }
}, "es6", "es3");
$jscomp.typedArrayFill = function (d) {
    return d ? d : Array.prototype.fill
};
$jscomp.polyfill("Int8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint8ClampedArray.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Int16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Int32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Uint32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Float32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
$jscomp.polyfill("Float64Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
(function (d) {
    function f(a) {
        this.globals = {
            accessToken: "",
            countryId: "",
            documentId: "",
            sides: [],
            countries: [],
            kycWorkflow: [],
            totalConfigs: 0,
            configNumber: 0,
            docImage: "",
            faceImage: ""
        };
        this.init(a)
    }

    function c(a, e, h, k) {
        function l() {
            this.docBackCaptureTitle = this.docFrontCaptureTitle = "Capture ";
            this.docCaptureDescription = "";
            this.docCaptureBottomDescription = "Make sure your document is without any glare and is fully inside";
            this.docCaptureReviewTopTitle = "Review your photo";
            this.docReviewDescription = "";
            this.docCaptureReviewBottomDescription =
                "Please Review if the document is visible";
            this.docUploadReviewTitle = "Review your document";
            this.docUploadReviewDescription = "";
            this.docUploadReviewBottomDescription = "Please Review if the document is visible";
            this.docUploadReviewBottomDescriptionPreviewUnsupported = "";
            this.docUploadReviewBottomDescriptionDocumentUnsupported = " Document Unsupported. Please upload a valid image or pdf";
            this.docUploadReviewBottomDescriptionDocumentSizeExceeded = " Document size cannot be greater than 12MB ";
            this.docUploadReviewReuploadButtonText =
                "Reupload Document";
            this.docUploadReviewSubmitButtonText = "Use this Document";
            this.docInstructionsTitle = "ID Capture Tips";
            this.docInstructions1 = "Hold your ID within the box";
            this.docInstructions2 = "Do not place outside";
            this.docInstructions3 = "Avoid glare from lights";
            this.docInstructionsProceed = "Proceed to Capture ID";
            this.docChoiceScreenTitle = "Please choose an option to provide your ID document for verification";
            this.docChoiceScreenUploadButtonText = "Upload document from device";
            this.docChoiceScreenCaptureButtonText =
                "Capture document photo";
            this.docRetakeScreenTitle = "Retake photo";
            this.docRetakeScreenDescription = "";
            this.docRetakeScreenButtonText = "Retake ID Card Photo"
        }

        function n() {
            this.faceCaptureTitle = "Capture Selfie";
            this.faceCaptureDescription = "";
            this.faceCaptureBottomDescription = "Make sure your face is inside the circle and is fully visible";
            this.faceCaptureReviewTitle = "Review Your Photo";
            this.faceCaptureReviewDescription = "";
            this.faceCaptureReviewBottomDescription = "Please Review if your face is fully visible";
            this.faceNotDetectedDescription = "Please place your face inside the circle";
            this.faceTooBigDescription = "Please Move away from the camera";
            this.faceTooSmallDescription = "Please move closer to the camera";
            this.faceDetectedDescription = "Capture Now";
            this.faceInstructionsTitle = "Selfie Tips";
            this.faceInstructionsTop1 = "Good Lighting on your face";
            this.faceInstructionsTop2 = "Look directly into the webcam";
            this.faceInstructionsBrightLight = "Bright Light";
            this.faceInstructionsNoGlasses = "No Glasses";
            this.faceInstructionsNoHat =
                "No Hat";
            this.faceInstructionsProceed = "Proceed to Take Selfie";
            this.faceRetakeScreenTitle = "Retake Photo";
            this.faceRetakeScreenDescription = "";
            this.faceRetakeScreenButtonText = "Retake Selfie"
        }
        this.accessToken = a;
        this.userWorkflow = e;
        this.defaultCountryId = k;
        this.transactionId = h;
        this.kycWorkflow = [];
        this.configNumber = this.totalConfigs = 0;
        this.documentResult = [];
        this.livenessResult = [];
        this.faceMatchResult = [];
        this.regionName = "Global";
        this.chooseDocumentCaptureOption = this.shouldShowDocReviewScreen = this.shouldShowFaceInstructionPage =
            this.shouldShowDocInstructionPage = !1;
        this.documentParams = {};
        this.livenessParams = {};
        this.documentHeaders = {};
        this.livenessHeaders = {};
        this.handleFaceRetries = this.handleDocRetries = !1;
        this.livenessThreshold = .8;
        this.documentType = "CARD";
        this.baseUrl = "https://ind.idv.hyperverge.co";
        this.imageBackArrow = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/backArrow.png";
        this.imageClose = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/close.png";
        this.countryPickerTitle = "Select Country";
        this.countryPickerDescription = "This will help us identify your identity";
        this.countryPickerButtonText = "Continue";
        this.documentPickerTitle = "Select Document";
        this.documentPickerDescription = "This will help us identify your identity";
        this.documentPickerButtonText = "Continue";
        this.flow = {
            countryPicker: "COUNTRY_PICKER",
            documentPicker: "DOCUMENT_PICKER",
            document: "DOCUMENT",
            documentFront: "DOCUMENT_FRONT",
            documentBack: "DOCUMENT_BACK",
            faceMatch: "FACE_MATCH",
            face: "FACE"
        };
        this.resultStatus = {
            approve: "AUTO_APPROVED",
            reject: "AUTO_REJECT",
            review: "NEEDS_REVIEW",
            cancel: "USER_DROPPED_OFF"
        };
        this.documentSelectId = "documentSelect";
        this.countrySelectId = "countrySelect";
        this.documentSelectPopupId = "HV_Document_Picker_popup";
        this.countrySelectPopupId = "HV_Country_Picker_popup";
        this.documentSides = [this.flow.documentFront, this.flow.documentBack];
        this.failureTag = "Failure";
        this.cancelledTag = "Cancelled";
        this.successTag = "Success";
        this.docTextConfig = new l;
        this.faceTextConfig = new n;
        l.prototype.setDocFrontCaptureTitle = function (m) {
            this.docFrontCaptureTitle =
                m
        };
        l.prototype.setDocBackCaptureTitle = function (m) {
            this.docBackCaptureTitle = m
        };
        l.prototype.setDocCaptureDescription = function (m) {
            this.docCaptureDescription = m
        };
        l.prototype.setDocCaptureBottomDescription = function (m) {
            this.docCaptureBottomDescription = m
        };
        l.prototype.setDocCaptureReviewTitle = function (m) {
            this.docCaptureReviewTopTitle = m
        };
        l.prototype.setDocReviewDescription = function (m) {
            this.docReviewDescription = m
        };
        l.prototype.setDocReviewBottomDescription = function (m) {
            this.docCaptureReviewBottomDescription = m
        };
        l.prototype.setDocInstructionsTitle = function (m) {
            this.docInstructionsTitle = m
        };
        l.prototype.setDocInstructions1 = function (m) {
            this.docInstructions1 = m
        };
        l.prototype.setDocInstructions2 = function (m) {
            this.docInstructions2 = m
        };
        l.prototype.setDocInstructions3 = function (m) {
            this.docInstructions3 = m
        };
        l.prototype.setDocInstructionsProceed = function (m) {
            this.docInstructionsProceed = m
        };
        l.prototype.setDocChoiceScreenTitle = function (m) {
            this.docChoiceScreenTitle = m
        };
        l.prototype.setDocChoiceScreenUploadButtonText = function (m) {
            this.docChoiceScreenUploadButtonText =
                m
        };
        l.prototype.setDocChoiceScreenCaptureButtonText = function (m) {
            this.docChoiceScreenCaptureButtonText = m
        };
        l.prototype.setDocUploadReviewTitle = function (m) {
            this.docUploadReviewTitle = m
        };
        l.prototype.setDocUploadReviewDescription = function (m) {
            this.docUploadReviewDescription = m
        };
        l.prototype.setDocUploadReviewBottomDescription = function (m) {
            this.docUploadReviewBottomDescription = m
        };
        l.prototype.setDocUploadReviewBottomDescriptionPreviewUnsupported = function (m) {
            this.docUploadReviewBottomDescriptionPreviewUnsupported =
                m
        };
        l.prototype.setDocUploadReviewBottomDescriptionDocumentUnsupported = function (m) {
            this.docUploadReviewBottomDescriptionDocumentUnsupported = m
        };
        l.prototype.setDocUploadReviewBottomDescriptionDocumentSizeExceeded = function (m) {
            this.docUploadReviewBottomDescriptionDocumentSizeExceeded = m
        };
        l.prototype.setDocUploadReviewReuploadButtonText = function (m) {
            this.docUploadReviewReuploadButtonText = m
        };
        l.prototype.setDocUploadReviewSubmitButtonText = function (m) {
            this.docUploadReviewSubmitButtonText = m
        };
        l.prototype.setDocRetakeScreenTitle =
            function (m) {
                this.docRetakeScreenTitle = m
            };
        l.prototype.setDocRetakeScreenDescription = function (m) {
            this.docRetakeScreenDescription = m
        };
        l.prototype.setDocRetakeScreenButtonText = function (m) {
            this.docRetakeScreenButtonText = m
        };
        n.prototype.setFaceCaptureTitle = function (m) {
            this.faceCaptureTitle = m
        };
        n.prototype.setFaceCaptureDescription = function (m) {
            this.faceCaptureDescription = m
        };
        n.prototype.setFaceCaptureBottomDescription = function (m) {
            this.faceCaptureBottomDescription = m
        };
        n.prototype.setFaceCaptureReviewTitle = function (m) {
            this.faceCaptureReviewTitle =
                m
        };
        n.prototype.setFaceCaptureReviewDescription = function (m) {
            this.faceCaptureReviewDescription = m
        };
        n.prototype.setFaceCaptureReviewBottomDescription = function (m) {
            this.faceCaptureReviewBottomDescription = m
        };
        n.prototype.setFaceNotDetectedDescription = function (m) {
            this.faceNotDetectedDescription = m
        };
        n.prototype.setFaceTooBigDescription = function (m) {
            this.faceTooBigDescription = m
        };
        n.prototype.setFaceTooSmallDescription = function (m) {
            this.faceTooSmallDescription = m
        };
        n.prototype.setFaceDetectedDescription = function (m) {
            this.faceDetectedDescription =
                m
        };
        n.prototype.setFaceInstructionsTitle = function (m) {
            this.faceInstructionsTitle = m
        };
        n.prototype.setFaceInstructionsTop1 = function (m) {
            this.faceInstructionsTop1 = m
        };
        n.prototype.setFaceInstructionsTop2 = function (m) {
            this.faceInstructionsTop2 = m
        };
        n.prototype.setFaceInstructionsBrightLight = function (m) {
            this.faceInstructionsBrightLight = m
        };
        n.prototype.setFaceInstructionsNoGlasses = function (m) {
            this.faceInstructionsNoGlasses = m
        };
        n.prototype.setFaceInstructionsNoHat = function (m) {
            this.faceInstructionsNoHat = m
        };
        n.prototype.setFaceInstructionsProceed =
            function (m) {
                this.faceInstructionsProceed = m
            };
        n.prototype.setFaceRetakeScreenTitle = function (m) {
            this.faceRetakeScreenTitle = m
        };
        n.prototype.setFaceRetakeScreenDescription = function (m) {
            this.faceRetakeScreenDescription = m
        };
        n.prototype.setFaceRetakeScreenButtonText = function (m) {
            this.faceRetakeScreenButtonText = m
        }
    }

    function g(a, e, h) {
        this.type = "DOCUMENT";
        this.useForFaceMatch = a;
        this.countryId = e;
        this.documentId = h
    }

    function b() {
        this.type = "FACE"
    }
    loadHyperKycCSS();
    f.prototype.init = function (a) {
        var e = this;
        Object.keys(a).forEach(function (h) {
            e.globals[h] =
                a[h]
        })
    };
    f.prototype.updateDocumentFlow = function (a) {
        var e = this;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (h) {
            e.globals.sides = a;
            a.slice().reverse().forEach(function (k) {
                e.globals.kycWorkflow.splice(e.globals.configNumber + 1, 0, "DOCUMENT_" + k.toUpperCase())
            });
            e.globals.totalConfigs = e.globals.kycWorkflow.length;
            h.jumpToEnd()
        })
    };
    f.prototype.makepopup = function (a, e, h, k) {
        var l = this,
            n = document.createElement("div"),
            m = document.createElement("span"),
            p = document.createElement("img");
        p.src = a.imageClose;
        m.appendChild(p);
        this.popup = document.createElement("div");
        this.popup.setAttribute("class", "hv-modal hv-show-modal");
        this.popup.setAttribute("id", e.popupId);
        n.setAttribute("class", "hv-modal-content");
        n.setAttribute("id", k);
        m.setAttribute("class", "hv-close-button");
        m.style["float"] = "right";
        k = document.createElement("span");
        k.setAttribute("class", "hv-back-button");
        p = document.createElement("img");
        p.src = a.imageBackArrow;
        k.appendChild(p);
        n.appendChild(m);
        0 !== this.globals.configNumber && n.appendChild(k);
        this.popup.appendChild(n);
        document.body.appendChild(this.popup);
        m.addEventListener("click", function (q) {
            document.getElementById(e.popupId).outerHTML = "";
            trackRudderAnalyticsEvent("SDKErrorReturned", {
                source: q,
                errorCode: "013",
                errorMessage: "Operation Cancelled By User"
            });
            h(a.cancelledTag)
        });
        k.addEventListener("click", function () {
            document.getElementById(e.popupId).outerHTML = "";
            --l.globals.configNumber;
            h("", !0)
        });
        return n
    };
    f.prototype.makeDropdown = function (a, e) {
        var h = document.createElement("div");
        h.setAttribute("class", "hv-radio-list");
        a.forEach(function (k) {
            var l = document.createElement("input");
            l.setAttribute("type", "radio");
            l.setAttribute("id", k.name);
            l.setAttribute("value", k.id);
            l.setAttribute("name", e);
            l.setAttribute("class", "hv-picker");
            var n = document.createElement("label");
            n.setAttribute("class", "select-label");
            n.setAttribute("for", k.name);
            n.innerHTML = k.name;
            k = document.createElement("hr");
            k.setAttribute("class", "hv-divider");
            l.addEventListener("click", function () {
                document.getElementById(e + "Button").disabled = !1
            });
            h.appendChild(l);
            h.appendChild(n);
            h.appendChild(k)
        });
        return h
    };
    f.prototype.makePicker = function (a, e, h, k, l) {
        var n = document.createElement("center"),
            m = document.createElement("div");
        m.innerHTML = a;
        m.setAttribute("class", "hv-title");
        a = document.createElement("div");
        a.innerHTML = e;
        a.setAttribute("class", "hv-instructions");
        divForCover = document.createElement("div");
        divForCover.setAttribute("class", "hv-divforcover");
        proceedButton = document.createElement("button");
        proceedButton.setAttribute("class", "btn");
        proceedButton.setAttribute("class",
            "hv-capture-btn");
        proceedButton.setAttribute("id", l + "Button");
        proceedButton.disabled = !0;
        proceedButton.innerHTML = h;
        divForCover.appendChild(proceedButton);
        n.appendChild(m);
        n.appendChild(a);
        n.appendChild(k);
        n.appendChild(divForCover);
        return n
    };
    f.prototype.documentPicker = function (a, e) {
        var h = this,
            k, l, n, m, p, q, r, u, t, w, y, x;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (v) {
            k = a;
            l = k.documentSelectPopupId;
            n = k.documentSelectId;
            m = k.documentPickerTitle;
            p = k.documentPickerDescription;
            q = k.documentPickerButtonText;
            r = {
                popupId: l
            };
            u = h.makepopup(a, r, e, "hv-user-document-picker");
            t = h.globals.countries.find(function (z) {
                return z.id === h.globals.countryId
            }).documents;
            w = h.makeDropdown(t, n);
            y = h.makePicker(m, p, q, w, n);
            u.appendChild(y);
            x = document.getElementById(n + "Button");
            x.addEventListener("click", function () {
                trackRudderAnalyticsEvent("DocumentSelection", {});
                h.globals.documentId = document.querySelector("input[name=" + n + "]:checked").value;
                document.getElementById(r.popupId).outerHTML = "";
                var z = t.find(function (A) {
                    return A.id ===
                        h.globals.documentId
                }).sides;
                h.updateDocumentFlow(z);
                e(h.globals.documentId)
            });
            v.jumpToEnd()
        })
    };
    f.prototype.updateWorkflow = function (a) {
        var e = this,
            h, k, l, n, m;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (p) {
            h = a;
            k = h.updatedUserFlow;
            l = h.flow;
            n = h.defaultCountryId;
            m = e.globals.configNumber + 1;
            k.forEach(function (q) {
                var r = q.countryId,
                    u = q.documentId;
                q.type.split("_")[0] === l.document && u && r === n && (e.globals.kycWorkflow.splice(m, 0, q), m += 1)
            });
            e.globals.totalConfigs = e.globals.kycWorkflow.length;
            p.jumpToEnd()
        })
    };
    f.prototype.countryPicker = function (a, e) {
        var h = this,
            k, l, n, m, p, q, r, u, t, w, y;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (x) {
            k = a;
            l = k.countrySelectPopupId;
            n = k.countrySelectId;
            m = k.countryPickerTitle;
            p = k.countryPickerDescription;
            q = k.countryPickerButtonText;
            r = {
                popupId: l
            };
            u = h.makepopup(a, r, e, "hv-user-country-picker");
            t = h.makeDropdown(h.globals.countries, n);
            w = h.makePicker(m, p, q, t, n);
            u.appendChild(w);
            y = document.getElementById(n + "Button");
            y.addEventListener("click", function () {
                trackRudderAnalyticsEvent("CountrySelection", {});
                h.globals.countryId = a.defaultCountryId = document.querySelector("input[name=" + n + "]:checked").value;
                a.setBaseUrl(h.globals.countries.find(function (v) {
                    return v.id === h.globals.countryId
                }).base_url);
                document.getElementById(r.popupId).outerHTML = "";
                h.updateWorkflow(a);
                e(h.globals.countryId)
            });
            x.jumpToEnd()
        })
    };
    f.prototype.setDocConfig = function (a, e) {
        var h = new d.HVDocConfig,
            k = a.shouldShowDocInstructionPage,
            l = a.shouldShowDocReviewScreen,
            n = a.chooseDocumentCaptureOption,
            m = a.documentType,
            p = a.handleDocRetries,
            q = a.baseUrl,
            r = a.documentHeaders,
            u = a.documentParams,
            t = a.docTextConfig,
            w = t.docFrontCaptureTitle,
            y = t.docBackCaptureTitle,
            x = t.docCaptureDescription,
            v = t.docCaptureBottomDescription,
            z = t.docCaptureReviewTopTitle,
            A = t.docReviewDescription,
            D = t.docCaptureReviewBottomDescription,
            E = t.docInstructionsTitle,
            B = t.docInstructions1,
            G = t.docInstructions2,
            H = t.docInstructions3,
            J = t.docInstructionsProceed,
            F = t.docChoiceScreenTitle,
            C = t.docChoiceScreenUploadButtonText,
            I = t.docChoiceScreenCaptureButtonText,
            M = t.docUploadReviewTitle,
            L = t.docUploadReviewDescription,
            N = t.docUploadReviewBottomDescription,
            O = t.docUploadReviewBottomDescriptionPreviewUnsupported,
            P = t.docUploadReviewBottomDescriptionDocumentUnsupported,
            Q = t.docUploadReviewBottomDescriptionDocumentSizeExceeded,
            K = t.docUploadReviewReuploadButtonText,
            R = t.docUploadReviewSubmitButtonText,
            S = t.docRetakeScreenTitle,
            T = t.docRetakeScreenDescription;
        t = t.docRetakeScreenButtonText;
        "FRONT" === e && h.docTextConfig.setDocCaptureTitle(w + " " + this.globals.documentId.toUpperCase() + " " + e);
        "BACK" ===
            e && h.docTextConfig.setDocCaptureTitle(y + " " + this.globals.documentId.toUpperCase() + " " + e);
        h.docTextConfig.setDocCaptureDescription(x);
        h.docTextConfig.setDocCaptureBottomDescription(v);
        h.docTextConfig.setDocCaptureReviewTitle(z);
        h.docTextConfig.setDocReviewDescription(A);
        h.docTextConfig.setDocReviewBottomDescription(D);
        h.docTextConfig.setDocInstructionsTitle(E);
        h.docTextConfig.setDocInstructions1(B);
        h.docTextConfig.setDocInstructions2(G);
        h.docTextConfig.setDocInstructions3(H);
        h.docTextConfig.setDocInstructionsProceed(J);
        h.docTextConfig.setDocChoiceScreenTitle(F);
        h.docTextConfig.setDocChoiceScreenUploadButtonText(C);
        h.docTextConfig.setDocChoiceScreenCaptureButtonText(I);
        h.docTextConfig.setDocUploadReviewTitle(M);
        h.docTextConfig.setDocUploadReviewDescription(L);
        h.docTextConfig.setDocUploadReviewBottomDescription(N);
        h.docTextConfig.setDocUploadReviewBottomDescriptionPreviewUnsupported(O);
        h.docTextConfig.setDocUploadReviewBottomDescriptionDocumentUnsupported(P);
        h.docTextConfig.setDocUploadReviewBottomDescriptionDocumentSizeExceeded(Q);
        h.docTextConfig.setDocUploadReviewReuploadButtonText(K);
        h.docTextConfig.setDocUploadReviewSubmitButtonText(R);
        h.docTextConfig.setDocRetakeScreenTitle(S);
        h.docTextConfig.setDocRetakeScreenDescription(T);
        h.docTextConfig.setDocRetakeScreenButtonText(t);
        h.setShouldShowInstructionPage(k);
        h.setShouldShowDocReviewScreen(l);
        h.setChooseDocumentCaptureOption(n);
        h.setDocumentType(m);
        h.setShouldHandleRetries(p);
        h.setOCRDetails(q + "/v1/readId", e, Object.assign({}, {
            countryId: this.globals.countryId.toLowerCase(),
            documentId: this.globals.documentId.toLowerCase()
        }, u), r);
        return h
    };
    f.prototype.setFaceConfig = function (a) {
        var e = new d.HVFaceConfig,
            h = a.shouldShowFaceInstructionPage,
            k = a.livenessParams,
            l = a.livenessHeaders,
            n = a.livenessThreshold,
            m = a.handleFaceRetries,
            p = a.baseUrl;
        a = a.faceTextConfig;
        var q = a.faceCaptureDescription,
            r = a.faceCaptureBottomDescription,
            u = a.faceCaptureReviewTitle,
            t = a.faceCaptureReviewDescription,
            w = a.faceCaptureReviewBottomDescription,
            y = a.faceNotDetectedDescription,
            x = a.faceTooBigDescription,
            v = a.faceTooSmallDescription,
            z = a.faceDetectedDescription,
            A = a.faceInstructionsTitle,
            D = a.faceInstructionsTop1,
            E = a.faceInstructionsTop2,
            B = a.faceInstructionsBrightLight,
            G = a.faceInstructionsNoGlasses,
            H = a.faceInstructionsNoHat,
            J = a.faceInstructionsProceed,
            F = a.faceRetakeScreenTitle,
            C = a.faceRetakeScreenDescription,
            I = a.faceRetakeScreenButtonText;
        e.faceTextConfig.setFaceCaptureTitle(a.faceCaptureTitle);
        e.faceTextConfig.setFaceCaptureDescription(q);
        e.faceTextConfig.setFaceCaptureBottomDescription(r);
        e.faceTextConfig.setFaceCaptureReviewTitle(u);
        e.faceTextConfig.setFaceCaptureReviewDescription(t);
        e.faceTextConfig.setFaceCaptureReviewBottomDescription(w);
        e.faceTextConfig.setFaceNotDetectedDescription(y);
        e.faceTextConfig.setFaceTooBigDescription(x);
        e.faceTextConfig.setFaceTooSmallDescription(v);
        e.faceTextConfig.setFaceDetectedDescription(z);
        e.faceTextConfig.setFaceInstructionsTitle(A);
        e.faceTextConfig.setFaceInstructionsTop1(D);
        e.faceTextConfig.setFaceInstructionsTop2(E);
        e.faceTextConfig.setFaceInstructionsBrightLight(B);
        e.faceTextConfig.setFaceInstructionsNoGlasses(G);
        e.faceTextConfig.setFaceInstructionsNoHat(H);
        e.faceTextConfig.setFaceInstructionsProceed(J);
        e.faceTextConfig.setFaceRetakeScreenTitle(F);
        e.faceTextConfig.setFaceRetakeScreenDescription(C);
        e.faceTextConfig.setFaceRetakeScreenButtonText(I);
        e.setShouldShowInstructionPage(h);
        e.setLivenessAPIParameters(k);
        e.setLivenessAPIHeaders(l);
        e.setShouldHandleRetries(m);
        e.setLivenessThreshold(n);
        e.setLivenessEndpoint(p + "/v1/checkLiveness");
        return e
    };
    f.prototype.processWorkflow = function (a, e, h) {
        var k = this,
            l = this.globals.kycWorkflow[this.globals.configNumber],
            n = a.flow,
            m = a.documentSides,
            p = a.baseUrl,
            q = !0;
        if ("object" === typeof l) {
            var r = l,
                u = r.countryId,
                t = r.documentId,
                w = r.useForFaceMatch;
            l = r.type;
            this.globals.countryId = u;
            this.globals.documentId = t;
            q = w
        }
        if (l === n.countryPicker) this.countryPicker(a, function (x, v) {
            e(a, [n.countryPicker, x], void 0 === v ? !1 : v)
        });
        else if (l === n.documentPicker) this.documentPicker(a, function (x, v) {
            e(a, [n.documentPicker, x], void 0 === v ? !1 : v)
        });
        else if (m.includes(l)) {
            var y = l.split("_")[1];
            m = this.setDocConfig(a, y);
            HVDocsModule.start(m, function (x,
                v) {
                a.docId = k.globals.documentId;
                null !== v && l === n.documentFront && q && (k.globals.docImage = v.imgBase64);
                e(a, ["DOCUMENT_" + y + "_" + k.globals.configNumber, [x, v]])
            }, function (x, v, z) {
                h(a, x, v, z)
            })
        } else l === n.face ? (m = this.setFaceConfig(a), HVFaceModule.start(m, function (x, v) {
            null !== v && (k.globals.faceImage = v.imgBase64);
            e(a, [n.face, [x, v]])
        }, function (x, v, z) {
            h(a, x, v, z)
        })) : l === n.faceMatch && (HVNetworkHelper.setEnableLoader(!0), HVNetworkHelper.setGlobalFaceMatchEndpoint(p + "/v1/matchFace"), HVNetworkHelper.makeFaceMatchCall(GlobalWebSDKObject.globals.faceImage,
            GlobalWebSDKObject.globals.docImage, {}, {},
            function (x, v) {
                HVNetworkHelper.setEnableLoader(!1);
                e(a, [n.faceMatch, [x, v]])
            }))
    };
    c.prototype.setBaseUrl = function (a) {
        this.baseUrl = a
    };
    c.prototype.setCountryPickerTitle = function (a) {
        this.countryPickerTitle = a
    };
    c.prototype.setCountryPickerDescription = function (a) {
        this.countryPickerDescription = a
    };
    c.prototype.setCountryPickerButtonText = function (a) {
        this.countryPickerButtonText = a
    };
    c.prototype.setDocumentPickerTitle = function (a) {
        this.documentPickerTitle = a
    };
    c.prototype.setDocumentPickerDescription =
        function (a) {
            this.documentPickerDescription = a
        };
    c.prototype.setDocumentPickerButtonText = function (a) {
        this.documentPickerButtonText = a
    };
    c.prototype.setShouldShowDocInstructionPage = function (a) {
        this.shouldShowDocInstructionPage = a
    };
    c.prototype.setShouldShowDocReviewScreen = function (a) {
        this.shouldShowDocReviewScreen = a
    };
    c.prototype.setChooseDocumentCaptureOption = function (a) {
        this.chooseDocumentCaptureOption = a
    };
    c.prototype.setDocumentType = function (a) {
        this.documentType = a
    };
    c.prototype.setDocumentAPIParameters = function (a) {
        var e =
            this;
        Object.keys(a).forEach(function (h) {
            e.documentParams[h] = a[h]
        })
    };
    c.prototype.setDocumentAPIHeaders = function (a) {
        this.documentHeaders = a
    };
    c.prototype.setShouldHandleDocRetries = function (a) {
        this.handleDocRetries = a
    };
    c.prototype.setShouldShowFaceInstructionPage = function (a) {
        this.shouldShowFaceInstructionPage = a
    };
    c.prototype.setLivenessAPIParameters = function (a) {
        var e = this;
        Object.keys(a).forEach(function (h) {
            e.livenessParams[h] = a[h]
        })
    };
    c.prototype.setLivenessAPIHeaders = function (a) {
        this.livenessHeaders = a
    };
    c.prototype.setLivenessEndpoint = function (a) {
        this.livenessEndpoint = a
    };
    c.prototype.setLivenessThreshold = function (a) {
        this.livenessThreshold = a
    };
    c.prototype.setShouldHandleFaceRetries = function (a) {
        this.handleFaceRetries = a
    };
    "function" === typeof define && define.amd ? (define(function () {
        return f
    }), define(function () {
        return c
    }), define(function () {
        return g
    }), define(function () {
        return b
    })) : "object" === typeof module && module.exports ? (module.exports = f, module.exports = c, module.exports = g, module.exports = b) : (d.GlobalWebSDK =
        f, d.HyperKycConfig = c, d.Document = g, d.Face = b)
})(window);

function loadHyperKycCSS() {
    var d = document.createElement("style");
    d.innerHTML = "\n  .hv-divider {\n    margin: 0;\n  }\n  .hv-capture-btn:disabled,\n  .hv-capture-btn[disabled]{\n    background-color: #cccccc;\n    color: #666666;\n  }\n  .hv-picker {\n    display: none;\n  }\n  .select-label {\n    position: relative;\n    color: black;\n    font-family: 'Poppins', sans-serif;\n    font-size: 2.3vh;\n    border-radius: 1px;\n    padding: 10px 50px;\n    display: flex;\n    align-items: center;\n    cursor: pointer;\n  }\n  .hv-picker:checked + .select-label{\n    background-image: url(https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/checkmark.png);\n    background-repeat: no-repeat;\n    background-position: right;\n  }\n  .hv-picker:checked{\n    height: 2px;\n    width: 2px;\n    border:: 2px solid white;\n    background-color: black;\n  }\n  .hv-radio-list {\n    max-height:380px;\n    margin:0;\n    overflow:auto;\n    margin: 10px 0 10px 0;\n    text-indent:10px\n  }\n  .hv-back-button {\n    float: left;\n    width: 1.5rem;\n    line-height: 1.5rem;\n    text-align: center;\n    cursor: pointer;\n    border-radius: 0.25rem;\n    background-color: white;\n    font-size: 30px;\n    margin-top: 0.3em;\n    font-weight: 600;\n  }\n  .hv-back-button:hover {\n    background-color: darkgray;\n  }\n  ";
    document.getElementsByTagName("head")[0].appendChild(d)
}
var GlobalWebSDKObject = "";

function GSDK_CONFIGURATIONS() {
    return {
        S3_CONFIG_URL: "https://hv-central-config.s3.ap-south-1.amazonaws.com/gsdk-country-doc-list/"
    }
}

function getCountries() {
    var d, f, c;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
        switch (g.nextAddress) {
            case 1:
                return g.setCatchFinallyBlocks(2), d = GSDK_CONFIGURATIONS().S3_CONFIG_URL + "countries.json", g.yield(fetch(d, {
                    method: "GET"
                }), 4);
            case 4:
                return f = g.yieldResult, g.yield(f.json(), 5);
            case 5:
                return c = g.yieldResult, c.sort(function (b, a) {
                    return b.name < a.name ? -1 : b.name > a.name ? 1 : 0
                }), g["return"](c);
            case 2:
                return g.enterCatchBlock(), g["return"]({})
        }
    })
}
var HyperKYCModule = {
    launch: function (d, f) {
        var c, g, b, a;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
            if (1 == e.nextAddress) return c = d, g = c.accessToken, b = c.transactionId, GlobalWebSDKObject = new GlobalWebSDK({
                accessToken: g
            }), a = GlobalWebSDKObject.globals, e.yield(getCountries(), 2);
            a.countries = e.yieldResult;
            HyperSnapSDK.init(g, HyperSnapParams.Region.Global);
            HyperSnapSDK.startUserSession(b);
            HyperKycFlow.start(d, f);
            e.jumpToEnd()
        })
    }
},
    HyperKycFlow = {
        results: {},
        requestIds: [],
        mainCallback: function () { },
        start: function (d, f) {
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
                HyperKycFlow.results = {};
                HyperKycFlow.requestIds = [];
                HyperKycFlow.mainCallback = f;
                HyperKycFlow.validateConfig(d);
                HyperKycFlow.createGlobalWorkflow(d);
                HyperKycFlow.process(d);
                c.jumpToEnd()
            })
        },
        validateConfig: function (d) {
            var f, c, g, b, a, e, h;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (k) {
                f = d;
                c = f.userWorkflow;
                g = f.flow;
                b = f.defaultCountryId;
                a = GlobalWebSDKObject.globals;
                e = a.countries;
                e.find(function (l) {
                    return l.id ===
                        b
                }) && (GlobalWebSDKObject.globals.countryId = b, d.setBaseUrl(GlobalWebSDKObject.globals.countries.find(function (l) {
                    return l.id === b
                }).base_url));
                0 === c.length && HyperKycFlow.createResult(d, failureTag, "User workflow cannot be empty");
                h = [];
                c.forEach(function (l) {
                    var n = [],
                        m = [],
                        p = l.documentId,
                        q = l.countryId;
                    if (l.type === g.document && (p || q)) {
                        var r = e.find(function (u) {
                            return u.id === q
                        });
                        r && (n = r.documents);
                        if (n = n.find(function (u) {
                            return u.id === p
                        })) m = n.sides;
                        0 < m.length && m.forEach(function (u) {
                            h.push(Object.assign({},
                                l, {
                                type: "DOCUMENT_" + u.toUpperCase()
                            }))
                        })
                    } else h.push(Object.assign({}, l))
                });
                d.updatedUserFlow = h;
                k.jumpToEnd()
            })
        },
        createGlobalWorkflow: function (d) {
            var f, c, g, b, a, e, h, k;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
                f = d;
                c = f.updatedUserFlow;
                g = f.flow;
                b = f.defaultCountryId;
                e = a = !1;
                h = [];
                k = 0;
                GlobalWebSDKObject.globals.countryId || h.push(g.countryPicker);
                c.forEach(function (n) {
                    var m = n.type,
                        p = n.documentId,
                        q = n.countryId;
                    m.split("_")[0] === g.document ? (a = !0, p && q === b ? h.push(n) : p || q ? a = !1 : h.push(g.documentPicker)) :
                        m === g.face && (h.push(g.face), e = !0)
                });
                a && e && h.push(g.faceMatch);
                k += h.length;
                GlobalWebSDKObject.globals.kycWorkflow = h;
                GlobalWebSDKObject.globals.totalConfigs = k;
                l.jumpToEnd()
            })
        },
        process: function (d) {
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (f) {
                GlobalWebSDKObject.processWorkflow(d, HyperKycFlow.callback, HyperKycFlow.uiCallback);
                f.jumpToEnd()
            })
        },
        callback: function (d, f, c) {
            c = void 0 === c ? !1 : c;
            var g, b, a, e, h, k, l, n, m, p, q, r, u, t, w;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (y) {
                g = d;
                b = g.successTag;
                a = g.failureTag;
                e = g.cancelledTag;
                h = g.flow;
                k = g.documentSides;
                "string" !== typeof f[1] || ["", e].includes(f[1]) ? "string" !== typeof f[1] && 0 !== f[1].length && null !== f[1][1] && (k.includes(f[0].substring(0, f[0].lastIndexOf("_"))) && (f[1][1].documentId = d.docId), n = {}, Object.assign(HyperKycFlow.results, (n[f[0]] = f[1][1], n)), HyperKycFlow.requestIds.push(f[1][1].response.metadata.requestId)) : (l = {}, Object.assign(HyperKycFlow.results, (l[f[0]] = f[1], l)));
                c || (GlobalWebSDKObject.globals.configNumber += 1);
                2 < f[0].split("_").length &&
                    (f[0] = f[0].substring(0, f[0].lastIndexOf("_")));
                [h.documentFront, h.documentBack, h.face, h.faceMatch].includes(f[0]) && 0 !== f[1].length ? (m = f[1][0], p = f[1][1], m && "013" === m.errorCode ? HyperKycFlow.createResult(d, e) : p && p.response.result.error || m ? (m ? (r = "sdk", q = m.errorCode) : (r = "api", q = p.response.statusCode), HyperKycFlow.createResult(d, a, r, (null == (u = p) ? void 0 : null == (t = u.response) ? void 0 : null == (w = t.result) ? void 0 : w.error) || m.errorMsg, q)) : GlobalWebSDKObject.globals.totalConfigs === GlobalWebSDKObject.globals.configNumber ?
                    HyperKycFlow.createResult(d, b) : GlobalWebSDKObject.processWorkflow(d, HyperKycFlow.callback, HyperKycFlow.uiCallback)) : f[1] === e ? HyperKycFlow.createResult(d, e) : GlobalWebSDKObject.processWorkflow(d, HyperKycFlow.callback, HyperKycFlow.uiCallback);
                y.jumpToEnd()
            })
        },
        uiCallback: function (d, f, c, g) {
            var b, a, e, h, k, l, n, m, p, q, r, u;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (t) {
                b = GlobalWebSDKObject.globals;
                a = b.kycWorkflow;
                e = b.configNumber;
                h = d.flow;
                k = h.documentPicker;
                l = h.countryPicker;
                n = d;
                m = n.imageBackArrow;
                p = n.imageClose;
                q = n.documentSides;
                c.innerHTML = "";
                r = document.createElement("img");
                r.src = p;
                c.appendChild(r);
                c.style["float"] = "right";
                u = document.createElement("span");
                r = document.createElement("img");
                r.src = m;
                u.appendChild(r);
                u.setAttribute("class", "hv-back-button");
                u.addEventListener("click", function () {
                    document.body.removeChild(g.popup);
                    g.reset();
                    g.resetLivenessVideoRecording();
                    var w = a[e - 1];
                    ("string" === typeof a[e] ? q.includes(a[e]) : q.includes(a[e].type)) && [k, l].includes(w) && (a = a.filter(function (y) {
                        return !(q.includes(y.type) ||
                            q.includes(y))
                    }), GlobalWebSDKObject.globals.totalConfigs = a.length + 1);
                    --GlobalWebSDKObject.globals.configNumber;
                    GlobalWebSDKObject.globals.kycWorkflow = a;
                    HyperKycFlow.callback(d, ["Back", []], !0)
                });
                0 !== e && f.appendChild(u);
                t.jumpToEnd()
            })
        },
        createResult: function (d, f, c, g, b) {
            c = void 0 === c ? "" : c;
            g = void 0 === g ? "" : g;
            b = void 0 === b ? "" : b;
            var a, e, h, k, l, n, m, p, q, r, u, t, w;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (y) {
                a = [];
                e = !1;
                h = d;
                k = h.accessToken;
                l = h.userWorkflow;
                n = h.transactionId;
                m = h.flow;
                p = h.documentSides;
                q = h.failureTag;
                r = HyperKycFlow;
                u = r.results;
                t = {
                    selectedCountryId: u[m.countryPicker] || GlobalWebSDKObject.globals.countryId,
                    config: {
                        accessToken: k,
                        workflow: l,
                        transactionId: n
                    },
                    docListData: [],
                    faceData: {},
                    faceMatchData: {}
                };
                Object.keys(u).forEach(function (x) {
                    if (![m.countryPicker, m.documentPicker].includes(x)) {
                        e = !0;
                        var v, z = (null == (v = u[x].response.result.summary) ? void 0 : v.action) || "";
                        a.push(z);
                        v = {
                            action: z,
                            responseHeaders: u[x].headers,
                            responseResult: u[x].response
                        };
                        if (p.includes(x.substring(0, x.lastIndexOf("_")))) v.documentId =
                            u[x].documentId, v.side = x.split("_")[1], v.docImagePath = u[x].imgBase64, t.docListData.push(v);
                        else if (x === m.face) {
                            v.croppedImagePath = "";
                            var A;
                            v.fullFaceImagePath = null == (A = u[x]) ? void 0 : A.imgBase64;
                            v.videoPath = "";
                            t.faceData = v
                        } else x === m.faceMatch && (t.faceMatchData = v)
                    }
                });
                w = {};
                w[f] = {
                    data: t
                };
                f === q && (w[f].reason = g, trackRudderAnalyticsEvent("SDKErrorReturned", {
                    source: c,
                    errorCode: b,
                    errorMessage: g
                }));
                e && HyperKycFlow.finishTransaction(d, f, a);
                HyperSnapSDK.endUserSession();
                GlobalWebSDKObject = "";
                HyperKycFlow.mainCallback(w);
                y.jumpToEnd()
            })
        },
        finishTransaction: function (d, f, c) {
            var g, b, a, e, h, k, l, n, m, p, q, r, u, t;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (w) {
                if (1 == w.nextAddress) return g = "", b = d, a = b.cancelledTag, e = b.failureTag, h = b.resultStatus, k = b.transactionId, l = b.accessToken, f === e ? g = h.reject : f === a ? g = h.cancel : (n = c.filter(function (y) {
                    return "pass" === y
                }).length, m = c.filter(function (y) {
                    return "fail" === y
                }).length, p = c.filter(function (y) {
                    return "manualReview" === y
                }).length, 0 < m ? g = h.reject : 0 < p ? g = h.review : n === c.length && (g =
                    h.approve)), q = HyperKycFlow.requestIds.filter(function (y) {
                        return void 0 !== y
                    }), r = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/finishTransaction", u = {
                        "Content-Type": "application/json",
                        transactionID: k,
                        authorization: l
                    }, t = getBrowser(), t.name && (u.browser = t.name), t.version && (u.browserVersion = t.version), u.device = getDevice(), u.userAgent = window.navigator.userAgent, u.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME, u.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION, w.yield(fetch(r, {
                        method: "POST",
                        headers: u,
                        body: JSON.stringify({
                            transactionId: k,
                            requestIds: q,
                            appId: WebSDKObject.globals.appId,
                            status: g
                        })
                    }), 2);
                w.jumpToEnd()
            })
        }
    };
(function (d) {
    function f(b) {
        this.globals = {
            startTime: "",
            transactionID: "",
            appId: "",
            sentry: !0,
            rudderanalytics: !0,
            sentryLoaded: !1,
            attempts: JSON.parse(localStorage.getItem("attempts")) || {},
            totalAttempts: parseInt(localStorage.getItem("totalAttempts")) || 0,
            logoImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC0FBMVEUAAAArp78mpb0forsforsforsforslpL0go7wkpL0jpL0forsgo7wforsforsforsforuPy9sforsho7wforsforsforsdobsforsio7wforsppr4forseorsdobsforsio7wforsforsforsforsforseorsmpb4fortcu86l0+J2xtYforsfortDsMYcobseorsforub0N8eorsforsforu+3Okforsforsforsfort0wtQforsforvL4e0forsforsforsfort7xNZovdAfortauMxWt8s9rcS62+ie0eB6xNZovdBIssjq7PYforsforvE3uu02eYforvf6PPS5O/Q4+6w1+Wt1uSp1eMbobqJydofort5x9cdors8rcTq7PYYn7nl6/Tg6fPb5/HH3+y/3eq22eeWzt5cu85tv9Jcus5StcoYn7nh6fPb5/IYn7nI4OwforsXn7mGyNmAxtdgus5eus5RtMqDy9rs7vbl6/TV5fAWn7kWnrlcu86o1OORzNx0xdVcu85euc5cu852xtZrwtPn6/UWn7kVnrkYn7l2xtaDxtgYn7kfort/ytl2xtYVnrlcu85cu85aus2n2uSGzdqn2uTt7fYforvu7vf////w7/fT0+f68vrV1ejS0ubs7Pbn5/Ph4fDX1+nj4/Aaobr08PkWn7nf3+4Yn7nc3Oz38fkdorvy7/jz7/jd3e0Tnrj28Pn48frZ2erq6vX88/tHsseVz95BsMY9rsTp6fR6xdZYuc1OtMktqMBzwdQ5rMQ0qsIopr4kpb3e6PLa5/HN4u1ku88QnLfr7Pbl5fLX5fHS5O/B3uq42+ir1uSCyNn5/f7z+vzm6/TP4+7D4uyf2OKg0uGN0N2IzNtcu872/P3v+Pr28fnj6vTX7vPg6/PU5fDK4eyp2+Wn1OOb0N+Iydrp9vjh8/bm7fXQ7PHH6O5ovtGv1+WER/aUAAAAmXRSTlMAAxT1Yew1BggbF/sL/vnGjIs7Aei6hU4pDvES0sp+MB/WrZd3c0cQ2bqknWdZLiSrn5hWUc7CwKabeWhe5dK2sZGPcldLSEQnvp1tWzX44d7Lti3r2tayrquIg21kRCP18u3t4svGuZKJYUtA++/o4dDCpn52UU48Dvrx39Cv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",
            accelerometerGObj: {},
            accelerometerObj: {},
            orientationObj: {},
            gyroscopeObj: {},
            sensorDataEvents: {},
            sensorCaptureStarted: !1,
            sensorDataFileName: ""
        };
        this.init(b)
    }

    function c() {
        function b() {
            this.docCaptureTitle = "Capture ID Card";
            this.docCaptureDescription = "";
            this.docCaptureBottomDescription = "Make sure your document is without any glare and is fully inside";
            this.docCaptureReviewTopTitle = "Review your photo";
            this.docReviewDescription = "";
            this.docCaptureReviewBottomDescription = "Please Review if the document is visible";
            this.docCaptureReviewRetakeBtnText = "Retake Photo";
            this.docUploadReviewTitle = "Review your document";
            this.docUploadReviewDescription = "";
            this.docUploadReviewBottomDescription = "Please Review if the document is visible";
            this.docUploadReviewBottomDescriptionPreviewUnsupported = "";
            this.docUploadReviewBottomDescriptionDocumentUnsupported = " Document Unsupported. Please upload a valid image or pdf";
            this.docUploadReviewBottomDescriptionDocumentSizeExceeded = " Document size cannot be greater than 12MB ";
            this.docUploadReviewReuploadButtonText =
                "Reupload Document";
            this.docUploadReviewSubmitButtonText = "Use this Document";
            this.docInstructionsTitle = "ID Capture Tips";
            this.docInstructions1 = "Hold your ID within the box";
            this.docInstructions2 = "Do not place outside";
            this.docInstructions3 = "Avoid glare from lights";
            this.docInstructionsProceed = "Proceed to Capture ID";
            this.docChoiceScreenTitle = "Please choose an option to provide your ID document for verification";
            this.docChoiceScreenUploadButtonText = "Upload document from device";
            this.docChoiceScreenCaptureButtonText =
                "Capture document photo";
            this.docRetakeScreenTitle = "Retake photo";
            this.docRetakeScreenDescription = "";
            this.docRetakeScreenButtonText = "Retake ID Card Photo"
        }
        this.chooseDocumentCaptureOption = !1;
        this.configType = "OCR";
        this.rudderStackType = "Document";
        this.handleRetries = !1;
        this.popupId = "HV_Document_popup_" + computeRandomString(10);
        this.uiCustomizationId = {
            userChoiceScreen: "hv-doc-user-choice-screen",
            uploadReviewScreen: "hv-doc-upload-review-screen",
            instructionScreen: "hv-doc-instruction-screen",
            captureScreen: "hv-doc-capture-screen",
            captureReviewScreen: "hv-doc-capture-review-screen",
            retakeScreen: "hv-doc-retake-screen"
        };
        this.endpoint = "";
        this.params = {};
        this.headers = {};
        this.documentType = "CARD";
        this.apiCall = !1;
        this.proxyEndpoint = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/ocr";
        this.mode = "document";
        this.ratio = .625;
        this.width = 640;
        this.shouldShowDocReviewScreen = this.shouldShowInstructionPage = this.mirrorMode = !1;
        this.Document = {
            Card: "CARD",
            Passport: "PASSPORT",
            A4: "A4",
            Other: "OTHER"
        };
        this.DocumentSide = {
            FRONT: "FRONT",
            BACK: "BACK"
        };
        this.actualDocumentSide =
            "FRONT";
        this.useBranding = !0;
        this.docTextConfig = new b;
        this.docUIConfig = new function () {
            this.imageSubmitBtnText = "Continue";
            this.docChoiceScreenCaptureButtonIcon = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/whiteCameraIcon.png";
            this.docChoiceScreenUploadButtonIcon = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/whiteUploadIcon.png";
            this.tick = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/tick.png";
            this.cross = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/cross.png";
            this.image = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/doc1.png";
            this.image1 = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/doc2.png";
            this.image2 = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/doc3.png";
            this.exclamation = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/exclamation.png"
        };
        b.prototype.setDocCaptureTitle = function (a) {
            this.docCaptureTitle = a
        };
        b.prototype.setDocCaptureDescription = function (a) {
            this.docCaptureDescription =
                a
        };
        b.prototype.setDocCaptureBottomDescription = function (a) {
            this.docCaptureBottomDescription = a
        };
        b.prototype.setDocCaptureReviewTitle = function (a) {
            this.docCaptureReviewTopTitle = a
        };
        b.prototype.setDocReviewDescription = function (a) {
            this.docReviewDescription = a
        };
        b.prototype.setDocReviewBottomDescription = function (a) {
            this.docCaptureReviewBottomDescription = a
        };
        b.prototype.setDocReviewRetakeButtonText = function (a) {
            this.docCaptureReviewRetakeBtnText = a
        };
        b.prototype.setDocInstructionsTitle = function (a) {
            this.docInstructionsTitle =
                a
        };
        b.prototype.setDocInstructions1 = function (a) {
            this.docInstructions1 = a
        };
        b.prototype.setDocInstructions2 = function (a) {
            this.docInstructions2 = a
        };
        b.prototype.setDocInstructions3 = function (a) {
            this.docInstructions3 = a
        };
        b.prototype.setDocInstructionsProceed = function (a) {
            this.docInstructionsProceed = a
        };
        b.prototype.setDocChoiceScreenTitle = function (a) {
            this.docChoiceScreenTitle = a
        };
        b.prototype.setDocChoiceScreenUploadButtonText = function (a) {
            this.docChoiceScreenUploadButtonText = a
        };
        b.prototype.setDocChoiceScreenCaptureButtonText =
            function (a) {
                this.docChoiceScreenCaptureButtonText = a
            };
        b.prototype.setDocUploadReviewTitle = function (a) {
            this.docUploadReviewTitle = a
        };
        b.prototype.setDocUploadReviewDescription = function (a) {
            this.docUploadReviewDescription = a
        };
        b.prototype.setDocUploadReviewBottomDescription = function (a) {
            this.docUploadReviewBottomDescription = a
        };
        b.prototype.setDocUploadReviewBottomDescriptionPreviewUnsupported = function (a) {
            this.docUploadReviewBottomDescriptionPreviewUnsupported = a
        };
        b.prototype.setDocUploadReviewBottomDescriptionDocumentUnsupported =
            function (a) {
                this.docUploadReviewBottomDescriptionDocumentUnsupported = a
            };
        b.prototype.setDocUploadReviewBottomDescriptionDocumentSizeExceeded = function (a) {
            this.docUploadReviewBottomDescriptionDocumentSizeExceeded = a
        };
        b.prototype.setDocUploadReviewReuploadButtonText = function (a) {
            this.docUploadReviewReuploadButtonText = a
        };
        b.prototype.setDocUploadReviewSubmitButtonText = function (a) {
            this.docUploadReviewSubmitButtonText = a
        };
        b.prototype.setDocRetakeScreenTitle = function (a) {
            this.docRetakeScreenTitle = a
        };
        b.prototype.setDocRetakeScreenDescription =
            function (a) {
                this.docRetakeScreenDescription = a
            };
        b.prototype.setDocRetakeScreenButtonText = function (a) {
            this.docRetakeScreenButtonText = a
        }
    }

    function g() {
        function b() {
            this.faceCaptureTitle = "Capture Selfie";
            this.faceCaptureDescription = "";
            this.faceCaptureBottomDescription = "Make sure your face is inside the circle and is fully visible";
            this.faceCaptureReviewTitle = "Review Your Photo";
            this.faceCaptureReviewDescription = "";
            this.faceCaptureReviewBottomDescription = "Please Review if your face is fully visible";
            this.faceNotDetectedDescription =
                "Please place your face inside the circle";
            this.faceTooBigDescription = "Please Move away from the camera";
            this.faceTooSmallDescription = "Please move closer to the camera";
            this.faceDetectedDescription = "Capture Now";
            this.faceInstructionsTitle = "Selfie Tips";
            this.faceInstructionsTop1 = "Good Lighting on your face";
            this.faceInstructionsTop2 = "Look directly into the webcam";
            this.faceInstructionsBrightLight = "Bright Light";
            this.faceInstructionsNoGlasses = "No Glasses";
            this.faceInstructionsNoHat = "No Hat";
            this.faceInstructionsProceed =
                "Proceed to Take Selfie";
            this.faceRetakeScreenTitle = "Retake Photo";
            this.faceRetakeScreenDescription = "";
            this.faceRetakeScreenButtonText = "Retake Selfie"
        }
        this.configType = "FACE";
        this.rudderStackType = "liveness";
        this.handleRetries = !1;
        this.livenessThreshold = .8;
        this.lowerLivenessReviewThreshold = .3;
        this.upperLivenessReviewThreshold = .85;
        this.popupId = "HV_Face_popup_" + computeRandomString(10);
        this.uiCustomizationId = {
            instructionScreen: "hv-face-instruction-screen",
            captureScreen: "hv-face-capture-screen",
            retakeScreen: "hv-face-retake-screen"
        };
        this.endpoint = "";
        this.mode = "selfie";
        this.mirrorMode = !0;
        this.params = {
            validateFaceSize: "no"
        };
        this.headers = {};
        this.documentType = "CARD";
        this.apiCall = !0;
        this.proxyEndpoint = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/liveness";
        this.ratio = 1;
        this.width = 1800;
        this.shouldShowInstructionPage = !1;
        this.Vietnam = {
            url: "https://apac-faceid.hyperverge.co/v2/photo/liveness"
        };
        this.India = {
            url: "https://ind-faceid.hyperverge.co/v1/photo/liveness"
        };
        this.UnitedStates = {
            url: "https://usa-faceid.hyperverge.co/v1/photo/liveness"
        };
        this.Africa = {
            url: "https://zaf-face.hyperverge.co/v2/photo/liveness"
        };
        this.Global = {
            url: "https://ind.idv.hyperverge.co/v1/checkLiveness"
        };
        this.LivenessMode = {
            none: !1,
            textureLiveness: !0
        };
        this.useBranding = !0;
        this.faceTextConfig = new b;
        this.faceUIConfig = new function () {
            this.imageSubmitBtnText = "Continue";
            this.selfie = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/selfie-webcam.png";
            this.tick = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/tick.png";
            this.bulb = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/bulb.png";
            this.glasses = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/glasses.png";
            this.hat = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/hat.png";
            this.exclamation = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/exclamation.png"
        };
        b.prototype.setFaceCaptureTitle = function (a) {
            this.faceCaptureTitle = a
        };
        b.prototype.setFaceCaptureDescription = function (a) {
            this.faceCaptureDescription = a
        };
        b.prototype.setFaceCaptureBottomDescription = function (a) {
            this.faceCaptureBottomDescription =
                a
        };
        b.prototype.setFaceCaptureReviewTitle = function (a) {
            this.faceCaptureReviewTitle = a
        };
        b.prototype.setFaceCaptureReviewDescription = function (a) {
            this.faceCaptureReviewDescription = a
        };
        b.prototype.setFaceCaptureReviewBottomDescription = function (a) {
            this.faceCaptureReviewBottomDescription = a
        };
        b.prototype.setFaceNotDetectedDescription = function (a) {
            this.faceNotDetectedDescription = a
        };
        b.prototype.setFaceTooBigDescription = function (a) {
            this.faceTooBigDescription = a
        };
        b.prototype.setFaceTooSmallDescription = function (a) {
            this.faceTooSmallDescription =
                a
        };
        b.prototype.setFaceDetectedDescription = function (a) {
            this.faceDetectedDescription = a
        };
        b.prototype.setFaceInstructionsTitle = function (a) {
            this.faceInstructionsTitle = a
        };
        b.prototype.setFaceInstructionsTop1 = function (a) {
            this.faceInstructionsTop1 = a
        };
        b.prototype.setFaceInstructionsTop2 = function (a) {
            this.faceInstructionsTop2 = a
        };
        b.prototype.setFaceInstructionsBrightLight = function (a) {
            this.faceInstructionsBrightLight = a
        };
        b.prototype.setFaceInstructionsNoGlasses = function (a) {
            this.faceInstructionsNoGlasses = a
        };
        b.prototype.setFaceInstructionsNoHat =
            function (a) {
                this.faceInstructionsNoHat = a
            };
        b.prototype.setFaceInstructionsProceed = function (a) {
            this.faceInstructionsProceed = a
        };
        b.prototype.setFaceRetakeScreenTitle = function (a) {
            this.faceRetakeScreenTitle = a
        };
        b.prototype.setFaceRetakeScreenDescription = function (a) {
            this.faceRetakeScreenDescription = a
        };
        b.prototype.setFaceRetakeScreenButtonText = function (a) {
            this.faceRetakeScreenButtonText = a
        }
    }
    loadCSS();
    loadDependencies();
    f.prototype.init = function (b) {
        var a = this;
        Object.keys(b).forEach(function (h) {
            a.globals[h] =
                b[h]
        });
        if (this.globals.sentry && !isHypervergeTesting()) {
            var e = document.createElement("script");
            e.type = "text/javascript";
            e.src = "https://browser.sentry-cdn.com/6.17.6/bundle.tracing.min.js";
            e.setAttribute("crossorigin", "anonymous");
            document.head.appendChild(e);
            e.addEventListener("readystatechange", function () {
                a.sentryInit()
            }, !1);
            e.addEventListener("load", function () {
                a.sentryInit()
            }, !1)
        }
        30 < Math.floor(100 * Math.random()) && (this.globals.rudderanalytics = !1);
        this.globals.rudderanalytics && !isHypervergeTesting() &&
            this.initiateRudderStack()
    };
    f.prototype.handleOrientation = function (b) {
        var a = {};
        Object.assign(this.WebSDKObject.globals.orientationObj, (a[+new Date] = [b.alpha, b.beta, b.gamma], a))
    };
    f.prototype.handleMotion = function (b) {
        var a = this.WebSDKObject.globals,
            e = a.accelerometerGObj,
            h = a.accelerometerObj;
        a = a.gyroscopeObj;
        var k = +new Date;
        this.WebSDKObject.globals.sensorCaptureStarted = !0;
        var l = {};
        Object.assign(e, (l[k] = [b.accelerationIncludingGravity.x, b.accelerationIncludingGravity.y, b.accelerationIncludingGravity.z],
            l));
        e = {};
        Object.assign(h, (e[k] = [b.acceleration.x, b.acceleration.y, b.acceleration.z], e));
        h = {};
        Object.assign(a, (h[k] = [b.rotationRate.alpha, b.rotationRate.beta, b.rotationRate.gamma], h))
    };
    f.prototype.stopSensorDataCapture = function () {
        d.removeEventListener("devicemotion", this.handleMotion);
        d.removeEventListener("deviceorientation", this.handleOrientation)
    };
    f.prototype.startSensorDataCapture = function () {
        this.globals.sensorDataFileName = "hvsdk_websdk_" + SDK_CONFIGURATIONS().SDK_VERSION + "_" + this.globals.appId +
            "_" + +new Date + "_face.zip";
        d.addEventListener("devicemotion", this.handleMotion);
        d.addEventListener("deviceorientation", this.handleOrientation)
    };
    f.prototype.initiateRudderStack = function () {
        ! function () {
            var b = d.rudderanalytics = d.rudderanalytics || [];
            b.methods = "load page track identify alias group ready reset getAnonymousId setAnonymousId".split(" ");
            b.factory = function (h) {
                return function () {
                    var k = Array.prototype.slice.call(arguments);
                    return k.unshift(h), b.push(k), b
                }
            };
            for (var a = 0; a < b.methods.length; a++) {
                var e =
                    b.methods[a];
                b[e] = b.factory(e)
            }
            b.loadJS = function (h, k) {
                var l = document.createElement("script");
                l.type = "text/javascript";
                l.async = !0;
                l.src = "https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";
                var n = document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(l, n)
            };
            b.loadJS();
            b.load("289FSFvqUKL9owsfKVuTHs8ycmq", "https://hypervergekrba.dataplane.rudderstack.com");
            b.page()
        }()
    };
    f.prototype.sentryInit = function () {
        var b = "WebSDK@" + SDK_CONFIGURATIONS().SDK_VERSION;
        Sentry.init({
            dsn: "https://4e8d2aa5db804f8c96b010f04c098705@o435277.ingest.sentry.io/6183625",
            release: b,
            integrations: [new Sentry.Integrations.BrowserTracing],
            tracesSampleRate: 0
        });
        this.globals.sentryLoaded = !0
    };
    f.prototype.startCameraScreen = function (b, a, e) {
        "selfie" === e.mode && trackSensorDataEvents("SelfieFlowStarted", Date.now());
        var h = e.docTextConfig,
            k = e.faceTextConfig,
            l = e.docUIConfig,
            n = e.faceUIConfig,
            m = {},
            p = {};
        h ? m = h : k && (m = k);
        l ? p = l : n && (p = n);
        new hyperSnapSDKInit({
            params: {
                onSave: b,
                mode: e.mode,
                mirrorMode: e.mirrorMode,
                ratio: e.ratio || 1,
                width: e.width || 640,
                documentType: e.documentType,
                onError: a,
                docCaptureTitle: m.docCaptureTitle,
                docCaptureDescription: m.docCaptureDescription,
                docReviewDescription: m.docReviewDescription,
                faceCaptureReviewTopTitle: m.faceCaptureReviewTitle || m.docCaptureReviewTopTitle,
                faceCaptureReviewTitle: m.faceCaptureReviewDescription || "",
                faceCaptureDescription: m.faceCaptureDescription,
                docCaptureBottomDescription: m.docCaptureBottomDescription || "",
                faceCaptureBottomDescription: m.faceCaptureBottomDescription || "",
                faceCaptureTitle: m.faceCaptureTitle,
                docCaptureReviewBottomDescription: m.docCaptureReviewBottomDescription ||
                    "",
                docCaptureReviewRetakeBtnText: m.docCaptureReviewRetakeBtnText || "",
                faceCaptureReviewBottomDescription: m.faceCaptureReviewBottomDescription || "",
                faceNotDetectedDescription: m.faceNotDetectedDescription || "",
                faceTooBigDescription: m.faceTooBigDescription || "",
                faceTooSmallDescription: m.faceTooSmallDescription || "",
                faceDetectedDescription: m.faceDetectedDescription || "",
                imageSubmitBtnText: p.imageSubmitBtnText || "Continue",
                shouldShowDocReviewScreen: e.shouldShowDocReviewScreen || !1,
                captureScreenId: e.uiCustomizationId.captureScreen,
                reviewScreenId: e.uiCustomizationId.captureReviewScreen || "",
                useBranding: e.useBranding,
                actualDocumentSide: e.actualDocumentSide || "",
                rudderStackType: e.rudderStackType,
                trackRudderAnalyticsEvent: trackRudderAnalyticsEvent,
                trackSensorDataEvents: trackSensorDataEvents,
                getAttemptsKey: getAttemptsKey,
                uiCallback: e.uiCallback,
                endPoint: e.endpoint
            }
        })
    };
    f.prototype.runOCR = function (b, a) {
        var e = this,
            h, k;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
            if (1 == l.nextAddress) return l.yield(detectWebcam(), 2);
            (h = l.yieldResult) ? b.shouldShowInstructionPage ? e.makeInstructionScreenPopup(b, a) : e.startCameraScreen(e.onSave(b, a), e.onError(a), b) : (k = new HVError, k.errorCode = "015", k.errorMsg = "Failed to detect camera on this device", a(k, null));
            l.jumpToEnd()
        })
    };
    f.prototype.showUserChoiceScreen = function (b, a) {
        var e = this,
            h = this.makepopup(b, a, b.uiCustomizationId.userChoiceScreen),
            k = document.createElement("center"),
            l = document.createElement("div"),
            n = document.createElement("div"),
            m = document.createElement("label"),
            p = document.createElement("input"),
            q = document.createElement("div"),
            r = document.createElement("button"),
            u = document.createElement("div"),
            t = document.createElement("span");
        k.setAttribute("class", "hv-center-element");
        l.innerHTML = b.docTextConfig.docChoiceScreenTitle;
        l.setAttribute("class", "hv-user-choice-screen-title");
        p.setAttribute("type", "file");
        p.setAttribute("id", "uploadedFile");
        p.setAttribute("accept", ".png, .jpg, .jpeg, .pdf");
        p.style.display = "none";
        m.setAttribute("for", "uploadedFile");
        m.setAttribute("class", "hv-upload-btn");
        m.innerHTML =
            "<img src=" + b.docUIConfig.docChoiceScreenUploadButtonIcon + ' class="hv-doc-choice-screen-icons"></img>' + b.docTextConfig.docChoiceScreenUploadButtonText;
        n.appendChild(m);
        n.appendChild(p);
        r.setAttribute("class", "btn");
        r.setAttribute("class", "hv-capture-btn");
        r.innerHTML = "<img src=" + b.docUIConfig.docChoiceScreenCaptureButtonIcon + ' class="hv-doc-choice-screen-icons"></img>' + b.docTextConfig.docChoiceScreenCaptureButtonText;
        q.appendChild(r);
        u.setAttribute("class", "hv-modal-footer");
        t.setAttribute("class",
            "footertext");

        b.useBranding || (t.innerHTML = "");
        u.appendChild(t);
        k.appendChild(l);
        k.appendChild(n);
        k.appendChild(q);
        k.appendChild(u);
        h.appendChild(k);
        p.addEventListener("change", function () {
            var w, y, x, v;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (z) {
                if (1 == z.nextAddress) return w = document.getElementById("uploadedFile").files[0], document.getElementById(b.popupId).outerHTML = "", b.shouldShowDocReviewScreen ? (e.showUploadReviewScreen(b, a, w), z.jumpTo(0)) : z.yield(fileToBase64(w),
                    3);
                y = z.yieldResult;
                y instanceof Error ? (x = new HVError, x.errorCode = "014", x.errorMsg = "Invalid Document", a(x, null)) : (v = e.onSave(b, a), v(y, w));
                z.jumpToEnd()
            })
        });
        r.addEventListener("click", function () {
            document.getElementById(b.popupId).outerHTML = "";
            WebSDKObject.runOCR(b, a)
        })
    };
    f.prototype.showUploadReviewScreen = function (b, a, e) {
        var h = this,
            k = this.makepopup(b, a, b.uiCustomizationId.uploadReviewScreen),
            l = document.createElement("center"),
            n = document.createElement("div"),
            m = document.createElement("div"),
            p = document.createElement("div"),
            q = document.createElement("div"),
            r = document.createElement("button"),
            u = document.createElement("button"),
            t = document.createElement("div");
        l.setAttribute("class", "hv-center-element");
        n.innerHTML = b.docTextConfig.docUploadReviewTitle;
        m.innerHTML = b.docTextConfig.docUploadReviewDescription;
        p.innerHTML = b.docTextConfig.docUploadReviewBottomDescription;
        n.setAttribute("class", "hv-title");
        m.setAttribute("class", "hv-instructions");
        p.setAttribute("class", "hv-bottom-instructions");
        if (12 >= e.size / 1E6)
            if ("application/pdf" ===
                e.type) {
                q = document.createElement("object");
                var w = document.createElement("p");
                w.innerHTML = "";
                q.setAttribute("class", "hv-preview-iframe");
                q.setAttribute("type", "application/pdf");
                q.setAttribute("data", URL.createObjectURL(e));
                q.addEventListener("error", function () {
                    l.removeChild(q);
                    p.innerHTML = "" === b.docTextConfig.docUploadReviewBottomDescriptionPreviewUnsupported ? "You successfully uploaded " + e.name : b.docTextConfig.docUploadReviewBottomDescriptionPreviewUnsupported
                });
                q.appendChild(w)
            } else e.type.startsWith("image") ?
                (q = document.createElement("img"), q.setAttribute("class", "hv-preview-img"), q.setAttribute("src", URL.createObjectURL(e))) : (p.innerHTML = b.docTextConfig.docUploadReviewBottomDescriptionDocumentUnsupported, u.style.display = "none");
        else p.innerHTML = b.docTextConfig.docUploadReviewBottomDescriptionDocumentSizeExceeded, u.style.display = "none";
        r.setAttribute("class", "hypervergebtn hv-reupload-btn");
        u.setAttribute("class", "hypervergebtn hv-use-this-photo-btn");
        r.innerHTML = b.docTextConfig.docUploadReviewReuploadButtonText;
        u.innerHTML = b.docTextConfig.docUploadReviewSubmitButtonText;
        t.setAttribute("class", "hv-divforcover");
        t.appendChild(r);
        t.appendChild(u);
        l.appendChild(n);
        l.appendChild(m);
        l.appendChild(q);
        l.appendChild(p);
        l.appendChild(t);
        k.appendChild(l);
        r.addEventListener("click", function () {
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (y) {
                document.getElementById(b.popupId).outerHTML = "";
                h.showUserChoiceScreen(b, a);
                y.jumpToEnd()
            })
        });
        u.addEventListener("click", function () {
            var y, x, v;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (z) {
                if (1 ==
                    z.nextAddress) return z.yield(fileToBase64(e), 2);
                y = z.yieldResult;
                y instanceof Error ? (document.getElementById(b.popupId).outerHTML = "", x = new HVError, x.errorCode = "014", x.errorMsg = "Invalid Document", a(x, null)) : (v = h.onSave(b, a), document.getElementById(b.popupId).outerHTML = "", v(y, e));
                z.jumpToEnd()
            })
        })
    };
    f.prototype.showRetakeScreen = function (b, a, e, h) {
        var k = b.docTextConfig,
            l = b.faceTextConfig,
            n = b.docUIConfig,
            m = b.faceUIConfig,
            p = {},
            q = {};
        k ? (p = k, p.title = k.docRetakeScreenTitle, p.description = k.docRetakeScreenDescription,
            p.buttonText = k.docRetakeScreenButtonText) : l && (p = l, p.title = l.faceRetakeScreenTitle, p.description = l.faceRetakeScreenDescription, p.buttonText = l.faceRetakeScreenButtonText);
        n ? q = n : m && (q = m);
        k = this.makepopup(b, a, b.uiCustomizationId.retakeScreen);
        var r = document.createElement("center");
        l = document.createElement("div");
        n = document.createElement("div");
        var u = document.createElement("div"),
            t = document.createElement("div");
        m = document.createElement("button");
        var w = document.createElement("div");
        r.setAttribute("class",
            "hv-center-element");
        l.innerHTML = p.title;
        n.innerHTML = p.description;
        u.innerHTML = "<img src=" + q.exclamation + ' class="hv-retake-screen-exclamation"></img>' + b.retakeMsg;
        l.setAttribute("class", "hv-title");
        n.setAttribute("class", "hv-instructions");
        u.setAttribute("class", "hv-bottom-instructions");
        u.setAttribute("id", "hv-retake-bottom-instructions");
        "application/pdf" === e.type ? (t = document.createElement("object"), q = document.createElement("p"), q.innerHTML = "", t.setAttribute("class", "hv-preview-iframe"), t.setAttribute("type",
            "application/pdf"), t.setAttribute("data", URL.createObjectURL(e)), t.addEventListener("error", function () {
                r.removeChild(t);
                u.innerHTML = "" === p.docUploadReviewBottomDescriptionPreviewUnsupported ? "You successfully uploaded " + e.name : p.docUploadReviewBottomDescriptionPreviewUnsupported
            }), t.appendChild(q)) : e.type.startsWith("image") ? (t = document.createElement("img"), t.setAttribute("class", "hv-preview-img"), t.setAttribute("src", URL.createObjectURL(e))) : u.innerHTML = p.docUploadReviewBottomDescriptionDocumentUnsupported;
        m.setAttribute("class", "hypervergebtn hv-retake-screen-btn");
        m.innerHTML = p.buttonText;
        w.setAttribute("class", "hv-divforcover");
        w.appendChild(m);
        r.appendChild(l);
        r.appendChild(n);
        r.appendChild(t);
        r.appendChild(u);
        r.appendChild(w);
        k.appendChild(r);
        m.addEventListener("click", function () {
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (y) {
                document.getElementById(b.popupId).outerHTML = "";
                "OCR" === b.configType ? (trackRudderAnalyticsEvent("" + b.rudderStackType + b.actualDocumentSide + "Retry", {
                    attempts: h
                }),
                    HVDocsModule.start(b, a)) : "FACE" === b.configType && (trackRudderAnalyticsEvent("SelfieRetry", {
                        attempts: h
                    }), trackSensorDataEvents("SelfieRetakeClicked", Date.now()), HVFaceModule.start(b, a));
                y.jumpToEnd()
            })
        })
    };
    f.prototype.showQR = function (b) {
        new QRious({
            element: document.getElementById("qr-code"),
            size: 300,
            value: b
        })
    };
    f.prototype.runFace = function (b, a) {
        var e = this,
            h, k;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
            if (1 == l.nextAddress) return l.yield(detectWebcam(), 2);
            (h = l.yieldResult) ? (e.startSensorDataCapture(),
                b.shouldShowInstructionPage ? e.makeInstructionScreenPopup(b, a) : e.startCameraScreen(e.onSave(b, a), e.onError(a), b)) : (k = new HVError, k.errorCode = "015", k.errorMsg = "Failed to detect camera on this device", a(k, null));
            l.jumpToEnd()
        })
    };
    f.prototype.uploadSensorDataToS3 = function () {
        var b = this,
            a, e, h, k;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
            if (1 == l.nextAddress) return a = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/sensorData", l.setCatchFinallyBlocks(2), e = {
                appId: b.globals.appId,
                token: b.globals.jwtToken,
                transactionID: b.globals.transactionID,
                authorization: b.globals.jwtToken,
                "Content-Type": "application/json"
            }, h = getBrowser(), h.name && (e.browser = h.name), h.version && (e.browserVersion = h.version), e.device = getDevice(), e.userAgent = d.navigator.userAgent, e.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME, e.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION, l.yield(fetch(a, {
                method: "POST",
                headers: e,
                body: JSON.stringify({
                    accelerometer: b.globals.accelerometerObj,
                    accelerometerG: b.globals.accelerometerGObj,
                    gyroscope: b.globals.gyroscopeObj,
                    orientation: b.globals.orientationObj,
                    sensorDataEvents: b.globals.sensorDataEvents,
                    fileName: b.globals.sensorDataFileName
                })
            }), 4);
            if (2 != l.nextAddress) return b.globals.accelerometerObj = {}, b.globals.accelerometerGObj = {}, b.globals.gyroscopeObj = {}, b.globals.orientationObj = {}, b.globals.sensorDataEvents = {}, l.leaveTryBlock(0);
            k = l.enterCatchBlock();
            console.log(k);
            l.jumpToEnd()
        })
    };
    f.prototype.onSave = function (b, a) {
        var e = this,
            h = b.proxyEndpoint,
            k = b.endpoint,
            l = b.params || {},
            n = b.headers || {},
            m = b.configType;
        b.actualDocumentSide &&
            (l.expectedDocumentSide = b.actualDocumentSide.toLowerCase());
        n.authorization = this.globals.jwtToken;
        n.transactionID = this.globals.transactionID;
        var p = getBrowser();
        p.name && (n.browser = p.name);
        p.version && (n.browserVersion = p.version);
        n.device = getDevice();
        n.userAgent = d.navigator.userAgent;
        n.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME;
        n.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION;
        "FACE" === m && (n.sensorDataZipFileName = e.globals.sensorDataFileName);
        return function (q, r, u, t, w, y, x) {
            t = void 0 === t ? "" : t;
            w = void 0 === w ?
                "" : w;
            var v, z, A, D, E, B, G, H, J, F;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (C) {
                switch (C.nextAddress) {
                    case 1:
                        e.globals.totalAttempts += 1;
                        v = getAttemptsKey(k, b);
                        e.globals.attempts[v] = e.globals.attempts[v] ? e.globals.attempts[v] + 1 : 1;
                        localStorage.setItem("attempts", JSON.stringify(e.globals.attempts));
                        localStorage.setItem("totalAttempts", e.globals.totalAttempts);
                        l.totalAttempts = e.globals.totalAttempts;
                        l.attempts = e.globals.attempts[v];
                        n.mediaDeviceType = t;
                        n.cameraLabel = w;
                        n.frameRate = x;
                        l.captureData =
                            JSON.stringify({
                                frameDiffs: u,
                                channelDiffs: [],
                                blocksDiff: -1
                            });
                        startLoader();
                        C.setCatchFinallyBlocks(2);
                        z = null;
                        A = new FormData;
                        A.append("headers", JSON.stringify(n));
                        A.append("params", JSON.stringify(l));
                        A.append("actualEndpoint", k);
                        r && "application/pdf" === r.type ? A.append("pdf", r) : (A.append("image", q), D = e.globals.regionName, y && "Vietnam" === D && "FACE" === m && A.append("video", y));
                        if (!b.apiCall) {
                            C.jumpTo(4);
                            break
                        }
                        return C.yield(fetch(h, {
                            method: "POST",
                            body: A,
                            headers: {
                                appid: WebSDKObject.globals.appId
                            }
                        }), 5);
                    case 5:
                        z =
                            C.yieldResult;
                    case 4:
                        return C.yield(responseHandler(q, z, b, e.globals.attempts[v]), 6);
                    case 6:
                        E = C.yieldResult;
                        B = E.errorObj;
                        G = E.responseObj;
                        C.leaveTryBlock(3);
                        break;
                    case 2:
                        return C.enterCatchBlock(), C.yield(responseHandler(null, null), 7);
                    case 7:
                        H = C.yieldResult, B = H.errorObj, G = H.responseObj;
                    case 3:
                        removeHVLoader();
                        if (null == (J = e) ? 0 : null == (F = J.globals) ? 0 : F.sensorCaptureStarted) e.stopSensorDataCapture(), e.globals.sensorCaptureStarted = !1, e.uploadSensorDataToS3();
                        if (b.handleRetries && isRetake(G)) b.retakeMsg = G.response.result.summary.retakeMessage,
                            e.showRetakeScreen(b, a, r, l.attempts);
                        else return C["return"](a(B, G));
                        C.jumpToEnd()
                }
            })
        }
    };
    f.prototype.onError = function (b) {
        return function (a) {
            var e = this,
                h, k, l;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (n) {
                if (null == (h = e) ? 0 : null == (k = h.globals) ? 0 : k.sensorCaptureStarted) e.stopSensorDataCapture(), e.globals.sensorCaptureStarted = !1, e.uploadSensorDataToS3();
                l = new HVError;
                err = a.split(":")[1].trim();
                l.errorCode = err.slice(0, 3);
                l.errorMsg = err.slice(3).trim();
                b(l, null);
                n.jumpToEnd()
            })
        }
    };
    f.prototype.makepopup =
        function (b, a, e) {
            var h = document.createElement("div"),
                k = document.createElement("span");
            this.popup = document.createElement("div");
            k.innerHTML = "&times;";
            this.popup.setAttribute("class", "hv-modal hv-show-modal");
            this.popup.setAttribute("id", b.popupId);
            h.setAttribute("class", "hv-modal-content");
            h.setAttribute("id", e);
            k.setAttribute("class", "hv-close-button");
            h.appendChild(k);
            this.popup.appendChild(h);
            document.body.appendChild(this.popup);
            k.addEventListener("click", function (l) {
                document.getElementById(b.popupId).outerHTML =
                    "";
                a && (trackRudderAnalyticsEvent("SDKErrorReturned", {
                    source: JSON.stringify(l.path, ["id", "className", "tagName"]),
                    errorCode: "013",
                    errorMessage: "Operation Cancelled By User"
                }), l = new HVError, l.errorCode = "013", l.errorMsg = "Operation Cancelled By User", a(l, null))
            });
            return h
        };
    f.prototype.makeInstructionScreenPopup = function (b, a) {
        var e = this.makepopup(b, a, b.uiCustomizationId.instructionScreen),
            h = document.createElement("div");
        e.appendChild(h);
        "OCR" == b.configType ? this.attachOCRInstructions(h, b, a) : this.attachFaceInstructions(h,
            b, a)
    };
    f.prototype.attachOCRInstructions = function (b, a, e) {
        var h = this,
            k = document.createElement("center"),
            l = document.createElement("div"),
            n = document.createElement("div"),
            m = document.createElement("button"),
            p = document.createElement("div"),
            q = document.createElement("div"),
            r = document.createElement("div"),
            u = document.createElement("div"),
            t = document.createElement("div"),
            w = document.createElement("img"),
            y = document.createElement("img"),
            x = document.createElement("img"),
            v = document.createElement("div"),
            z = document.createElement("div"),
            A = document.createElement("div"),
            D = document.createElement("img"),
            E = document.createElement("img");
        crossImg2 = document.createElement("img");
        span = document.createElement("span");
        k.setAttribute("class", "hv-center-element");
        l.setAttribute("class", "hv-divforcover");
        n.innerHTML = a.docTextConfig.docInstructionsTitle;
        n.setAttribute("class", "hv-title");
        var B = a.docUIConfig;
        q.setAttribute("class", "hv-instruction-div");
        r.setAttribute("class", "hv-instruction-small-div-left");
        u.setAttribute("class", "hv-instruction-small-div-right");
        t.setAttribute("class", "hv-instruction-small-div-left");
        w.src = B.image;
        w.setAttribute("class", "hv-instruction-img-left");
        y.src = B.image1;
        y.setAttribute("class", "hv-instruction-img-left");
        x.src = B.image2;
        x.setAttribute("class", "hv-instruction-img-left");
        D.src = B.tick;
        D.setAttribute("class", "hv-instruction-tick");
        E.src = B.cross;
        E.setAttribute("class", "hv-instruction-tick");
        crossImg2.src = B.cross;
        crossImg2.setAttribute("class", "hv-instruction-tick");
        v.setAttribute("class", "hv-instruction-doc-text");
        v.innerText =
            a.docTextConfig.docInstructions1;
        z.setAttribute("class", "hv-instruction-doc-text");
        z.innerText = a.docTextConfig.docInstructions2;
        A.setAttribute("class", "hv-instruction-doc-text");
        A.innerText = a.docTextConfig.docInstructions3;
        r.appendChild(w);
        r.appendChild(D);
        r.appendChild(v);
        u.appendChild(z);
        u.appendChild(E);
        u.appendChild(y);
        t.appendChild(x);
        t.appendChild(crossImg2);
        t.appendChild(A);
        q.appendChild(r);
        q.appendChild(u);
        q.appendChild(t);
        m.setAttribute("class", "btn");
        m.setAttribute("class", "hv-proceed-btn");
        m.innerText = a.docTextConfig.docInstructionsProceed;
        p.setAttribute("class", "hv-modal-footer");
        span.setAttribute("class", "footertext");

        a.useBranding || (span.innerHTML = "");
        l.appendChild(m);
        p.appendChild(span);
        k.appendChild(n);
        k.appendChild(q);
        k.appendChild(l);
        k.appendChild(p);
        b.appendChild(k);
        m.addEventListener("click", function () {
            h.closeIntructionScreen(a, e)
        }, !1)
    };
    f.prototype.attachFaceInstructions = function (b, a, e) {
        var h = this,
            k = a.faceUIConfig,
            l = document.createElement("center"),
            n = document.createElement("div"),
            m = document.createElement("div"),
            p = document.createElement("button"),
            q = document.createElement("div"),
            r = document.createElement("div"),
            u = document.createElement("div"),
            t = document.createElement("div"),
            w = document.createElement("div"),
            y = document.createElement("div"),
            x = document.createElement("div"),
            v = document.createElement("div"),
            z = document.createElement("div"),
            A = document.createElement("div"),
            D = document.createElement("div"),
            E = document.createElement("img"),
            B = document.createElement("img"),
            G = document.createElement("img"),
            H = document.createElement("img"),
            J = document.createElement("img"),
            F = document.createElement("img"),
            C = document.createElement("p"),
            I = document.createElement("p"),
            M = document.createElement("p"),
            L = document.createElement("span");
        l.setAttribute("class", "hv-center-element");
        n.setAttribute("class", "hv-divforcover");
        m.innerHTML = a.faceTextConfig.faceInstructionsTitle;
        m.setAttribute("class", "hv-title");
        r.setAttribute("class", "hv-instruction-div");
        u.setAttribute("class", "hv-instruction-small-div-face-text");
        t.setAttribute("class", "hv-instruction-small-div-face-text");
        w.setAttribute("class", "hv-instruction-selfie");
        y.setAttribute("class", "hv-instruction-props");
        E.src = k.tick;
        E.setAttribute("class", "hv-instruction-tick");
        B.src = k.tick;
        B.setAttribute("class", "hv-instruction-tick");
        G.src = k.selfie;
        G.setAttribute("class", "hv-selfie-img");
        H.src = k.bulb;
        H.setAttribute("class", "hv-instruction-props-img");
        J.src = k.glasses;
        J.setAttribute("class", "hv-instruction-props-img");
        F.src = k.hat;
        F.setAttribute("class", "hv-instruction-props-img");
        C.innerText = a.faceTextConfig.faceInstructionsBrightLight;
        C.setAttribute("class", "hv-instruction-props-text");
        I.innerText = a.faceTextConfig.faceInstructionsNoGlasses;
        I.setAttribute("class", "hv-instruction-props-text");
        M.innerText = a.faceTextConfig.faceInstructionsNoHat;
        M.setAttribute("class", "hv-instruction-props-text");
        A.innerText = a.faceTextConfig.faceInstructionsTop1;
        D.innerText = a.faceTextConfig.faceInstructionsTop2;
        u.appendChild(E);
        u.appendChild(A);
        t.appendChild(B);
        t.appendChild(D);
        w.appendChild(G);
        x.appendChild(H);
        x.appendChild(C);
        v.appendChild(J);
        v.appendChild(I);
        z.appendChild(F);
        z.appendChild(M);
        y.appendChild(x);
        y.appendChild(v);
        y.appendChild(z);
        r.appendChild(u);
        r.appendChild(t);
        r.appendChild(w);
        r.appendChild(y);
        p.setAttribute("class", "btn");
        p.setAttribute("class", "hv-proceed-btn");
        p.innerText = a.faceTextConfig.faceInstructionsProceed;
        q.setAttribute("class", "hv-modal-footer");
        L.setAttribute("class", "footertext");

        a.useBranding || (L.innerHTML = "");
        n.appendChild(p);
        q.appendChild(L);
        l.appendChild(m);
        l.appendChild(r);
        l.appendChild(n);
        l.appendChild(q);
        b.appendChild(l);
        p.addEventListener("click", function () {
            h.closeIntructionScreen(a, e)
        }, !1)
    };
    f.prototype.closeIntructionScreen = function (b, a) {
        document.getElementById(b.popupId).outerHTML = "";
        this.startCameraScreen(this.onSave(b, a), this.onError(a), b)
    };
    f.prototype.makeQrPopup = function (b, a) {
        var e = this.makepopup(b, a, b.uiCustomizationId.qrScreen),
            h = document.createElement("center"),
            k = document.createElement("div"),
            l = document.createElement("div"),
            n = document.createElement("div"),
            m = document.createElement("canvas"),
            p = document.createElement("div"),
            q = document.createElement("span");
        h.setAttribute("class", "hv-center-element");
        isInternetExplorer() ? k.innerHTML = b.browserNotSupportedTitle : k.innerHTML = b.qrScreenTitle;
        k.setAttribute("class", "hv-title");
        n.innerHTML = b.qrScreenDescription;
        n.setAttribute("class", "hv-qr-top-text");
        m.setAttribute("id", "qr-code");
        p.innerHTML = b.qrScreenBottomDescription;
        p.setAttribute("class", "hv-qr-bottom-text");
        l.setAttribute("class",
            "hv-modal-footer");
        q.setAttribute("class", "footertext");

        b.useBranding || (q.innerHTML = "");
        l.appendChild(q);
        h.appendChild(k);
        h.appendChild(n);
        h.appendChild(m);
        h.appendChild(p);
        h.appendChild(l);
        e.appendChild(h)
    };
    f.prototype.generateTransactionId = function (b) {
        for (var a = "", e = 0; e < b; e++) a += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
        return a
    };
    c.prototype.setOCRDetails = function (b, a, e, h) {
        this.apiCall = this.handleRetries = !0;
        this.endpoint = b;
        this.actualDocumentSide = a;
        e && (this.params = e);
        h && (this.headers = h)
    };
    c.prototype.setShouldShowInstructionPage = function (b) {
        this.shouldShowInstructionPage = b
    };
    c.prototype.setShouldShowDocReviewScreen = function (b) {
        this.shouldShowDocReviewScreen = b
    };
    c.prototype.setChooseDocumentCaptureOption = function (b) {
        this.chooseDocumentCaptureOption = b
    };
    c.prototype.setDocumentType = function (b) {
        this.documentType = b
    };
    c.prototype.setShouldHandleRetries = function (b) {
        this.handleRetries = b
    };
    g.prototype.setShouldShowInstructionPage =
        function (b) {
            this.shouldShowInstructionPage = b
        };
    g.prototype.setLivenessAPIParameters = function (b) {
        var a = this;
        Object.keys(b).forEach(function (e) {
            a.params[e] = b[e]
        })
    };
    g.prototype.setLivenessAPIHeaders = function (b) {
        this.headers = b
    };
    g.prototype.setLivenessMode = function (b) {
        this.apiCall = b
    };
    g.prototype.setLivenessEndpoint = function (b) {
        this.endpoint = b
    };
    g.prototype.setLivenessThreshold = function (b) {
        this.livenessThreshold = b
    };
    g.prototype.setShouldHandleRetries = function (b) {
        this.handleRetries = b
    };
    "function" === typeof define &&
        define.amd ? (define("WebSDK", function () {
            return f
        }), define("HVDocConfig", function () {
            return c
        }), define("HVFaceConfig", function () {
            return g
        })) : "object" === typeof module && module.exports ? module.exports = {
            WebSDK: f,
            HVDocConfig: c,
            HVFaceConfig: g
        } : (d.WebSDK = f, d.HVDocConfig = c, d.HVFaceConfig = g)
})(window);
var HVFirebaseObject = {
    hvFirebaseApp: {
        options: {
            projectId: "",
            appId: ""
        }
    },
    initializeHVApp: function () { },
    getHVFirebaseAuth: function () { },
    signInWithHVCustomToken: Promise,
    getHVDatabase: function () { },
    referencePathInHVDatabase: function () { },
    setDataToHVDatabase: function () { },
    removeDataFromHVDatabase: function () { },
    onValueChange: function () { }
},
    WebSDKObject = "";

function isInitialized(d) {
    var f = new HVError;
    f.errorCode = 400;
    return "" === WebSDKObject ? (f.errorMsg = "SDK not initialized. Please call the 'HyperSnapSDK.init(jwtToken, Region)' method", d(f, null), !1) : "" === WebSDKObject.globals.transactionID ? (f.errorMsg = "User Session not created. Please call the 'HyperSnapSDK.startUserSession()' method", d(f, null), !1) : !0
}
var firebaseConfig = {
    apiKey: "AIzaSyC1SWP-8rT1fc2sfnvAAsNr2gVbldca_bE",
    authDomain: "websdk-c9a29.firebaseapp.com",
    databaseURL: "https://websdk-c9a29-default-rtdb.firebaseio.com",
    projectId: "websdk-c9a29",
    storageBucket: "websdk-c9a29.appspot.com",
    messagingSenderId: "951410820299",
    appId: "1:951410820299:web:161aaefaa71efcb9d3474e",
    measurementId: "G-CR2ZMKP4KL"
};

function responseHandler(d, f, c, g) {
    c = void 0 === c ? null : c;
    g = void 0 === g ? 1 : g;
    var b, a, e, h;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (k) {
        if (1 == k.nextAddress) return b = null, a = new HVResponse, null == d && null == f ? (b = new HVError, b.errorCode = 500, b.errorMsg = "Something went Wrong", trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: b.errorCode,
            errorMessage: b.errorMsg
        }), k["return"]({
            errorObj: b,
            responseObj: null
        })) : f ? k.yield(f.json(), 3) : k.jumpTo(2);
        2 != k.nextAddress && (e = k.yieldResult, f.ok ?
            (c && null != c.livenessThreshold && e.result && e.result["liveness-score"] && (e.result["liveness-score"] < c.livenessThreshold ? e.result.live = "no" : e.result["liveness-score"] > c.livenessThreshold && (e.result.live = "yes"), e.result["to-be-reviewed"] = e.result["liveness-score"] >= c.lowerLivenessReviewThreshold && e.result["liveness-score"] <= c.upperLivenessReviewThreshold ? "yes" : "no"), a.response = e.data, a.headers = e.headers) : e && e.result && (e.result.summary || e.result.error) ? (a.response = e, a.headers = e.headers, a.response.headers &&
                delete a.response.headers) : (b = new HVError, b.errorCode = f.status || 500, b.errorMsg = e.error || (null == (h = e.result) ? void 0 : h.error) || "Internal Server Error", trackRudderAnalyticsEvent("SDKErrorReturned", {
                    source: "api",
                    errorCode: b.errorCode,
                    errorMessage: b.errorMsg
                })));
        null != d && (a.imgBase64 = d);
        a.attemptsCount = g;
        return k["return"]({
            errorObj: b,
            responseObj: a
        })
    })
}

function isRetake(d) {
    return false;
    // return d && d.response.result && d.response.result.summary && (d.action = d.response.result.summary.action, "retake" === d.response.result.summary.action) ? !0 : !1
}

function getAttemptsKey(d, f) {
    var c = d.split("/");
    c = c[c.length - 1];
    f && f.actualDocumentSide && (c += "_" + f.actualDocumentSide);
    return c
}

function computeRandomString(d) {
    for (var f = "", c = 0; c < d; c++) f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
    return f
}

function detectDesktopOrPhoneMirrorMode() {
    var d = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        f = -1 < navigator.userAgent.toLowerCase().indexOf("android");
    return !(d || f)
}

function encryptData(d, f) {
    var c = JSON.stringify(d);
    return CryptoJS.AES.encrypt(c, f).toString()
}

function decryptCipher(d, f) {
    return CryptoJS.AES.decrypt(d, f).toString(CryptoJS.enc.Utf8)
}

function getBrowser() {
    var d = navigator.userAgent,
        f = d.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(f[1])) {
        var c = /\brv[ :]+(\d+)/g.exec(d) || [];
        return {
            name: "IE",
            version: c[1] || ""
        }
    }
    if ("Chrome" === f[1] && (c = d.match(/\bOPR|Edge\/(\d+)/), null != c)) return {
        name: "Opera",
        version: c[1]
    };
    f = f[2] ? [f[1], f[2]] : [navigator.appName, navigator.appVersion, "-?"];
    null != (c = d.match(/version\/(\d+)/i)) && f.splice(1, 1, c[1]);
    return {
        name: f[0],
        version: f[1]
    }
}
var getDevice = function () {
    var d = "Unknown",
        f = {
            "Generic Linux": /Linux/i,
            Android: /Android/i,
            BlackBerry: /BlackBerry/i,
            Bluebird: /EF500/i,
            "Chrome OS": /CrOS/i,
            Datalogic: /DL-AXIS/i,
            Honeywell: /CT50/i,
            iPad: /iPad/i,
            iPhone: /iPhone/i,
            iPod: /iPod/i,
            macOS: /Macintosh/i,
            Windows: /IEMobile|Windows/i,
            Zebra: /TC70|TC55/i
        };
    Object.keys(f).map(function (c) {
        return navigator.userAgent.match(f[c]) && (d = c)
    });
    return d
},
    scriptsLoaded = 0;

function areScriptsLoaded() {
    return 5 === scriptsLoaded
}

function loadExternalScript(d) {
    var f = document.createElement("script");
    f.src = d;
    document.head.appendChild(f);
    return f
}

function loadCSS() {
    var d = document.createElement("style");
    d.innerHTML = "\n  * {\n    box-sizing: border-box;\n  }\n  .hv-modal {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.5);\n    opacity: 0;\n    visibility: hidden;\n    transform: scale(1.1);\n    z-index:99999999999 !important;\n    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;\n  }\n  .hv-proceed-btn \n  {\n    font-weight: 500;\n    color: white;\n    padding: 5px;\n    width: 15em;\n    max-width: 220px;\n    height: 3.3em;\n    margin-right: 10px;\n    margin-top: 10px;\n    background-color: rgb(31,162,187);\n    border-color: #6c757d;\n    display: inline-block;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    -webkit-user-select: none;\n    user-select: none;\n    border: 1px solid transparent;\n    padding: .375rem .75rem;\n    line-height: 1.5rem;\n    border-radius: .25rem;\n    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;\n    margin-bottom: 1%;\n  }\n  .hv-capture-btn {\n    height: auto;\n    width: 90vw;\n    max-width: 400px;\n    font-size: 2.3vh;\n    padding: 2vh;\n    margin-top: 10px;\n    border: 1px solid #ccc;\n    border-radius: 10px;\n    background-color: rgb(31,162,187);\n    color: white;\n    font-weight: 500;\n  }\n  .hv-upload-btn { \n    border: 1px solid #ccc;\n    display: inline-block;\n    padding: 6px 12px;\n    cursor: pointer;\n    margin-top: 25vh;\n    color: black;\n    background-color: #EFEFEF;\n    padding: 2vh;\n    border-radius: 10px;\n    height: auto;\n    width: 90vw;\n    max-width: 400px;\n    font-size: 2.3vh;\n    background-color: rgb(31,162,187);\n    margin-bottom: 0.5rem;\n    color: white;\n    font-weight: 500;\n  }\n  .hv-preview-iframe {\n    height : 42vh;\n  }\n  .hv-preview-img {\n    object-fit: cover;\n    height: 35vh;\n    width: 100%;\n    max-width: 450px;\n    max-height: 400px;\n  }\n  .hv-bottom-instructions {\n    font-size: 1.2em;\n    margin-top: 0.5em;\n    color: black;\n    margin-top: 2.3em;\n  }\n  #hv-retake-bottom-instructions {\n    color: #E2574C;\n  }\n  .hv-modal-content {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    background-color: white;\n    padding: 1rem 1.5rem;\n    width:700px;\n    height: calc(100% - 3em);\n    overflow: hidden;\n  }\n  .hv-instruction-div {\n    height: 75vh;\n    width: 100%;\n    max-width: 450px;\n  }\n  .hv-instruction-small-div-left {\n    height: 30%;\n    width: 100%;\n    max-width: 450px;\n    display: grid;\n    grid-template-columns: 60% 10% 30%;\n  }\n  .hv-instruction-small-div-right {\n    height: 30%;\n    width: 100%;\n    max-width: 450px;\n    display: grid;\n    grid-template-columns: 30% 10% 60%;\n  }\n  .hv-instruction-small-div-face-text {\n    margin-top: 4%;\n    width: 100%;\n    max-width: 270px;\n    display: grid;\n    grid-template-columns: 10% 90%;\n  }\n  .hv-instruction-selfie {\n    height : 30vh;\n    margin-top: 5%;\n  }\n  .hv-instruction-props {\n    display: grid;\n    grid-template-columns: 30% 30% 30%;\n    margin-top: 5%;\n    grid-column-gap: 3%;\n  }\n  .hv-instruction-props-img {\n    width : 100%;\n    max-height: 130px;\n  }\n  .hv-instruction-props-text {\n    font-size: 2vh;\n  }\n  .hv-instruction-tick {\n    height: 3vh;\n    align-self: center;\n  }\n  .hv-instruction-img-left {\n    width: 100%;\n    max-width: 230px;\n    align-self: center;\n  } \n  .hv-instruction-doc-text {\n    align-self: center;\n  } \n  .hv-selfie-img {\n    max-width: 100%;\n    max-height: 100%;\n  }\n  .hv-close-button {\n    float: left;\n    width: 1.5rem;\n    line-height: 1.5rem;\n    text-align: center;\n    cursor: pointer;\n    border-radius: 0.25rem;\n    background-color: white;\n    font-size: 30px;\n    margin-top: 0.3em;\n    font-weight: 600;\n  }\n  .hv-center-img {\n    height: 75vh;\n    width:100%;\n    max-width: 450px;\n  }\n  @media only screen and (min-device-width: 320px) and (max-device-width: 480px){\n     .hv-instructions {\n      margin-bottom: 1em !important;\n    }\n  }\n  @media (min-width:320px) and (max-width:1025px)\n  {\n    .hv-modal-content {\n      width: 100%;\n      height: 100%; \n    } \n    .hv-instruction-props {\n      margin-top : 10%;\n    }\n  }\n  @media (min-width:1025px)\n  {\n    .hv-modal-content {\n      width: 50%;\n      height: calc(100% - 3em); \n      border-radius: 10px;\n    }\n  }\n  .hv-close-button:hover {\n    background-color: darkgray;\n  }\n  .hv-show-modal {\n    opacity: 1;\n    visibility: visible;\n    transform: scale(1);\n    transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;\n  }\n  .hv-title {\n    font-weight: 600;\n    font-size: 1.4em;\n    margin-bottom: 0.1em;\n    color: black;\n    margin-right: 1.5em;\n  }\n  .hv-instructions {\n    font-size: 1em;\n    margin-bottom: 0.5em;\n    min-height: 2em;\n    color: black;\n  }\n  .hv-steps {\n    opacity: 0.8;\n    font-size: 0.8em;\n    margin-bottom: 0.2em;\n    color: black;\n  }\n  .hv-modal-footer {\n    position: absolute;\n    bottom: 0;\n    width: 100%;\n    height: 1em;\n    margin: 0.25rem 0 0.75rem -1.5rem;\n  }\n  .footertext {\n    font-size: 0.7em;\n    line-height: 1em;\n    color: black;\n  }\n  .footerimage {\n    height: 1.5em;\n    margin-bottom: -0.4em;\n  }\n  .hv-btnposition{\n    height: 4.8em;\n  }\n  .hypervergebtn \n  {\n    font-size: 2.3vh;\n    overflow: hidden;\n    height: 9vh;\n    width: 45%;\n    max-width: 25vh;\n    margin-right: 0.4em;\n    line-height: 0;\n    color: #fff;\n    background-color: rgb(31,162,187);\n    border-color: #6c757d;\n    display: inline-block;\n    font-weight: 400;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    border: 1px solid transparent;\n    line-height: 1.5rem;\n    border-radius: .25rem;\n    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;\n  }\n  .hv-reupload-btn{background-color: white;color: rgb(31, 162, 187);border: 1px solid rgb(31, 162, 187);}\n  .hv-retake-screen-btn {\n    background-color: white;\n    color: rgb(31, 162, 187);\n    border: 1px solid rgb(31, 162, 187);\n    width: 90%;\n    max-width: 40vh;\n  } \n  .hv-retake-btn{ background-color: white;color: rgb(31, 162, 187);border: 1px solid rgb(31, 162, 187);}\n  .hv-use-this-photo-btn{ line-height:0;}\n  .hv-user-choice-screen-title {\n    padding-top:5%; \n    color:black; \n    font-size: 1.2em; \n    max-width: 400px;\n  }\n  .hv-divforcover {\n    bottom: 2em;\n    position: absolute;\n    width: 100%;\n    margin-left: -1.5rem;\n  }\n  .hv-qr-top-text {\n    padding-top:5%; \n    color:black;\n  }\n  .hv-qr-bottom-text {\n    padding-top:5%; \n    color:black;\n  }\n  #hv-cameraLoadingText {\n    text-align: center;\n  }\n  .hv-retake-screen-exclamation {\n    height: 2em;\n    margin-right: 0.5em; \n    margin-bottom: 0.2em;\n  }\n  .hv-center-element {\n    font-family: 'Muli', sans-serif;\n  }\n  .hv-doc-choice-screen-icons { \n    height: 2.5vh; \n    margin-right: 5px;\n  }\n  #hv-camera-capture-button {\n    cursor: pointer;\n  }\n  .hv-preview-video {\n    object-fit: cover; \n    object-position: 50% 50%; \n    border-radius: 0.4em;\n  }\n  .hv-review-buttons {\n    width: 100%;\n  }\n  .hv-icon-img {\n    width: auto;\n  }\n  .hv-liveness-face-not-found {\n    border-width: 0.5em; \n    border-style: solid; \n    border-color: red; \n  }\n  .hv-liveness-face-found {\n    border-width: 0.5em; \n    border-style: solid; \n    border-color: green; \n  }\n  ";
    document.getElementsByTagName("head")[0].appendChild(d)
}

function loadDependencies() {
    if (isInternetExplorer()) {
        var d = document.createElement("script");
        d.src = "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0/polyfill.min.js";
        document.head.appendChild(d);
        var f = document.createElement("script");
        f.src = "https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js";
        document.head.appendChild(f);
        d.onload = function () {
            loadQRDependencies()
        }
    } else loadQRDependencies()
}

function loadQRDependencies() {
    var d, f, c, g, b, a, e, h, k, l, n, m, p, q;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (r) {
        switch (r.nextAddress) {
            case 1:
                return d = loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"), d.onload = function () {
                    scriptsLoaded += 1
                }, r.setCatchFinallyBlocks(2), r.yield(import("https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js"), 4);
            case 4:
                return f = r.yieldResult, c = f.initializeApp, scriptsLoaded += 1, HVFirebaseObject.initializeHVApp = c, r.yield(import("https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js"),
                    5);
            case 5:
                return g = r.yieldResult, b = g.getAuth, a = g.signInWithCustomToken, scriptsLoaded += 1, HVFirebaseObject.getHVFirebaseAuth = b, HVFirebaseObject.signInWithHVCustomToken = a, r.yield(import("https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js"), 6);
            case 6:
                e = r.yieldResult;
                h = e.getDatabase;
                k = e.ref;
                l = e.set;
                n = e.remove;
                m = e.onValue;
                scriptsLoaded += 1;
                HVFirebaseObject.getHVDatabase = h;
                HVFirebaseObject.referencePathInHVDatabase = k;
                HVFirebaseObject.setDataToHVDatabase = l;
                HVFirebaseObject.removeDataFromHVDatabase =
                    n;
                HVFirebaseObject.onValueChange = m;
                r.leaveTryBlock(3);
                break;
            case 2:
                p = r.enterCatchBlock(), console.log(p);
            case 3:
                q = loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"), q.onload = function () {
                    scriptsLoaded += 1
                }, r.jumpToEnd()
        }
    })
}

function isHypervergeTesting() {
    return "http://localhost:9876/context.html" === window.location.href || "http://localhost:9878/context.html" === window.location.href
}

function isFirebaseAlreadyAvailable() {
    var d;
    return firebaseConfig.appId === (null == (d = HVFirebaseObject.hvFirebaseApp) ? void 0 : d.options.appId) ? !0 : !1
}

function setupSocketServer(d, f, c) {
    var g, b, a, e, h, k, l, n, m, p, q, r, u, t, w, y, x, v, z, A, D, E, B, G, H, J;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (F) {
        switch (F.nextAddress) {
            case 1:
                return g = HVFirebaseObject, b = g.initializeHVApp, a = g.signInWithHVCustomToken, e = g.getHVFirebaseAuth, h = g.getHVDatabase, k = g.setDataToHVDatabase, l = g.onValueChange, n = g.referencePathInHVDatabase, m = g.removeDataFromHVDatabase, isFirebaseAlreadyAvailable() || (HVFirebaseObject.hvFirebaseApp = b(firebaseConfig, {
                    name: "HVFirebaseApp"
                })),
                    F.setCatchFinallyBlocks(2), F.yield(getFirebaseToken(), 4);
            case 4:
                p = F.yieldResult;
                if (!p) {
                    q = new HVError;
                    q.errorCode = "401";
                    q.errorMsg = "Missing/Invalid Credentials";
                    d(q, null);
                    F.jumpTo(5);
                    break
                }
                r = HVFirebaseObject;
                u = r.hvFirebaseApp;
                return F.yield(a(e(u), p), 6);
            case 6:
                t = F.yieldResult, w = h(u), y = t.user.uid, x = WebSDKObject.globals, v = x.jwtToken, z = x.transactionID, A = x.regionName, D = x.startTime, E = {
                    jwtToken: v,
                    regionName: A,
                    configs: f,
                    transactionID: z,
                    startTime: D
                }, B = computeRandomString(40), G = encryptData(E, B), H = n(w, y), k(H, {
                    data: G,
                    isStarted: !0
                }), l(H, function (C) {
                    var I, M, L, N, O, P, Q;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function (K) {
                        switch (K.nextAddress) {
                            case 1:
                                I = C.val();
                                if (!I) {
                                    K.jumpTo(0);
                                    break
                                }
                                if (!I.s3Url) {
                                    K.jumpTo(3);
                                    break
                                }
                                M = I.s3Url;
                                return K.yield(fetch(M, {
                                    method: "GET"
                                }), 4);
                            case 4:
                                return L = K.yieldResult, K.yield(L.json(), 5);
                            case 5:
                                N = K.yieldResult, I = {
                                    results: JSON.parse(decryptCipher(N.data, B))
                                };
                            case 3:
                                O = I;
                                P = O.isStarted;
                                if (!P) {
                                    if (Q = document.getElementById("HV_QR_POPUP")) Q.outerHTML = "";
                                    d(I);
                                    m(H)
                                }
                                K.jumpToEnd()
                        }
                    })
                }),
                    c(p, B);
            case 5:
                F.leaveTryBlock(0);
                break;
            case 2:
                J = F.enterCatchBlock(), console.log(J), q = new HVError, q.errorCode = "500", q.errorMsg = "Internal Server Error", d(q, null), F.jumpToEnd()
        }
    })
}

function getDataFromFirebase(d, f, c) {
    var g, b, a, e, h, k, l, n, m, p, q, r, u;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (t) {
        if (1 == t.nextAddress) return t.setCatchFinallyBlocks(2), g = HVFirebaseObject, b = g.getHVDatabase, a = g.onValueChange, e = g.referencePathInHVDatabase, h = g.signInWithHVCustomToken, k = g.getHVFirebaseAuth, l = g.initializeHVApp, isFirebaseAlreadyAvailable() || (HVFirebaseObject.hvFirebaseApp = l(firebaseConfig, {
            name: "HVFirebaseApp"
        })), n = HVFirebaseObject, m = n.hvFirebaseApp, t.yield(h(k(m), d), 4);
        if (2 !=
            t.nextAddress) return p = t.yieldResult, q = b(m), r = p.user.uid, u = e(q, r), a(u, function (w) {
                if (w.val() && w.val().data) try {
                    var y = decryptCipher(w.val().data, f);
                    c(y, r)
                } catch (x) {
                    removeHVLoader(), showPopupMsg("Looks like this link is no longer valid")
                }
            }), t.leaveTryBlock(0);
        t.enterCatchBlock();
        removeHVLoader();
        showPopupMsg("Looks like this link is no longer valid");
        t.jumpToEnd()
    })
}

function SDK_CONFIGURATIONS(d) {
    d = "https://hypersnapweb.hyperverge.co";
    "snap.hyperverge.co" === window.location.host && (d = "https://snap.hyperverge.co");
    return {
        SERVER_URL: d,
        PRODUCT_NAME: "WebSDK",
        SDK_VERSION: "4.1.7",
        S3_CONFIG_URL: "https://hv-central-config.s3.ap-south-1.amazonaws.com/sdk-client-config/hypersnapsdk/v1/"
    }
}

function showPopupMsg(d) {
    d = void 0 === d ? "Đang xử lý" : d;
    var f = document.createElement("div"),
        c = document.createElement("style"),
        g = document.createElement("div"),
        b = document.createElement("div");
    c.innerHTML = "\n  .hv-small-popup-modal-content {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: auto;\n    height: auto;\n    border-radius: 0.3rem;\n    overflow: hidden;\n    text-align: center;\n    background-color: #FFF;\n    box-shadow: 0px 1px 4px 1px #77777730;\n    padding : 25px;\n  }\n  .hv-small-popup-msg {\n    color: black;\n  }\n  .hv-loader-box{\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  };   \n  ";
    document.getElementsByTagName("head")[0].appendChild(c);
    b.setAttribute("class", "hv-small-popup-msg");
    b.innerHTML = d;
    g.setAttribute("class", "hv-loader-box");
    f.setAttribute("id", "HV_loader_popup");
    f.setAttribute("class", "hv-small-popup-modal-content");
    f.innerText = d;
    g.appendChild(b);
    document.body.appendChild(f)
}

function startLoader(d) {
    d = void 0 === d ? "Đang xử lý" : d;
    var f = document.createElement("div"),
        c = document.createElement("style"),
        g = document.createElement("div"),
        b = document.createElement("div"),
        a = document.createElement("div");
    c.innerHTML = ".loader {\n    border: 3px solid #f3f3f3;\n    border-top: 3px solid #555;\n    border-radius: 50%;\n    width: 20px;\n    height: 20px;\n    animation: spin 1s linear infinite;\n    float:left;\n  }\n  @keyframes spin {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n  }\n  .hv-loading-modal-content {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: 15em;\n    height: 3em;\n    border-radius: 0.3rem;\n    overflow: hidden;\n    text-align: center;\n    background-color: #FFF;\n    box-shadow: 0px 1px 4px 1px #77777730;\n  }\n  .hv-loader-msg {\n    float:right;\n    padding-left: 10px;\n    color: black;\n  }\n  .hv-loader-box{\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  };   \n  ";
    document.getElementsByTagName("head")[0].appendChild(c);
    b.setAttribute("class", "loader");
    a.setAttribute("class", "hv-loader-msg");
    a.innerHTML = d;
    g.setAttribute("class", "hv-loader-box");
    f.setAttribute("id", "HV_loader_popup");
    g.appendChild(b);
    g.appendChild(a);
    f.setAttribute("class", "hv-modal-content");
    popup = document.createElement("div");
    popup.setAttribute("class", "hv-modal hv-show-modal");
    popup.setAttribute("id", "HV_new_loader_popup");
    d = document.createElement("center");
    d.setAttribute("class", "hv-center-element");
    f.appendChild(d);
    f.appendChild(g);
    popup.appendChild(f);
    document.body.appendChild(popup)
}

function removeHVLoader() {
    document.getElementById("HV_loader_popup") && (document.getElementById("HV_loader_popup").outerHTML = "");
    document.getElementById("HV_new_loader_popup") && (document.getElementById("HV_new_loader_popup").outerHTML = "")
}

function addCommonProperties(d) {
    var f, c, g, b, a, e, h;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (k) {
        WebSDKObject && WebSDKObject.globals && (f = WebSDKObject.globals, c = f.transactionID, g = f.regionName, b = f.appId, a = f.startTime, d.transactionID = c, d.region = g, d.appId = b, a && (d.timeFromStart = Date.now() - a));
        d.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION;
        if (e = getBrowser()) d.browser = e.name, d.browserVersion = e.version;
        d.device = getDevice();
        d.userAgent = window.navigator.userAgent;
        if (h = navigator.connection || navigator.mozConnection ||
            navigator.webkitConnection) d.connectionSpeed = h.downlink, d.connectionType = h.effectiveType;
        k.jumpToEnd()
    })
}

function trackSensorDataEvents(d, f) {
    WebSDKObject.globals.sensorDataEvents[f] = [d]
}

function trackRudderAnalyticsEvent(d, f) {
    try {
        addCommonProperties(f), f.hv_event = d, !isHypervergeTesting() && WebSDKObject && WebSDKObject.globals && WebSDKObject.globals.rudderanalytics && rudderanalytics.track("Websdk", f)
    } catch (c) {
        console.log(c)
    }
}

function trackRudderAnalyticsPage(d, f) {
    try {
        addCommonProperties(f), f.hv_event = d, !isHypervergeTesting() && WebSDKObject && WebSDKObject.globals && WebSDKObject.globals.rudderanalytics && rudderanalytics.page("Websdk", d, f)
    } catch (c) {
        console.log(c)
    }
}

function isInternetExplorer() {
    return /MSIE|Trident/.test(window.navigator.userAgent)
}

function isVivoOrMiBrowser() {
    var d = window.navigator.userAgent;
    return d.match(/MiuiBrowser/i) || !!d.match(/VivoBrowser/i)
}

function getFirebaseToken() {
    var d, f, c, g, b;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (a) {
        switch (a.nextAddress) {
            case 1:
                d = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/firebaseToken";
                f = {
                    authorization: WebSDKObject.globals.jwtToken,
                    transactionID: WebSDKObject.globals.transactionID
                };
                c = getBrowser();
                c.name && (f.browser = c.name);
                c.version && (f.browserVersion = c.version);
                f.device = getDevice();
                f.userAgent = window.navigator.userAgent;
                f.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME;
                f.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION;
                if (!isInternetExplorer()) {
                    a.jumpTo(2);
                    break
                }
                return a.yield(fetch(d, {
                    method: "POST"
                }), 3);
            case 3:
            case 2:
                return a.yield(fetch(d, {
                    method: "POST",
                    headers: f
                }), 4);
            case 4:
                return g = a.yieldResult, a.yield(g.json(), 5);
            case 5:
                return b = a.yieldResult, a["return"](b.customToken)
        }
    })
}

function getS3SignedUrl(d) {
    var f, c, g, b, a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
        if (1 == e.nextAddress) return f = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/s3SignedUrl", c = {
            authorization: WebSDKObject.globals.jwtToken,
            transactionID: WebSDKObject.globals.transactionID,
            "Content-Type": "application/json"
        }, g = getBrowser(), g.name && (c.browser = g.name), g.version && (c.browserVersion = g.version), c.device = getDevice(), c.userAgent = window.navigator.userAgent, c.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME,
            c.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION, e.yield(fetch(f, {
                method: "POST",
                headers: c,
                body: JSON.stringify({
                    data: d
                })
            }), 2);
        if (3 != e.nextAddress) return b = e.yieldResult, e.yield(b.json(), 3);
        a = e.yieldResult;
        return e["return"](a.url)
    })
}

function getGeoFromIP(d) {
    var f, c, g, b, a;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
        switch (e.nextAddress) {
            case 1:
                return e.setCatchFinallyBlocks(2), f = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/geoIP", c = {
                    authorization: WebSDKObject.globals.jwtToken,
                    transactionID: WebSDKObject.globals.transactionID,
                    "Content-Type": "application/json"
                }, g = getBrowser(), g.name && (c.browser = g.name), g.version && (c.browserVersion = g.version), c.device = getDevice(), c.userAgent = window.navigator.userAgent, c.madeFrom =
                    SDK_CONFIGURATIONS().PRODUCT_NAME, c.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION, e.yield(fetch(f, {
                        method: "POST",
                        headers: c,
                        body: JSON.stringify({
                            ip: d
                        })
                    }), 4);
            case 4:
                return b = e.yieldResult, e.yield(b.json(), 5);
            case 5:
                return a = e.yieldResult, e["return"](a);
            case 2:
                return e.enterCatchBlock(), trackRudderAnalyticsEvent("SDKErrorReturned", {
                    source: "sdk",
                    errorCode: 500,
                    errorMessage: "geoFromIp Went Wrong"
                }), e["return"]({
                    status: "failure",
                    statusCode: "500",
                    error: "Something Went Wrong"
                })
        }
    })
}

function parseJwt(d) {
    try {
        return JSON.parse(atob(d.split(".")[1]))
    } catch (f) {
        return {}
    }
}

function getConfigurations() {
    var d, f, c;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
        switch (g.nextAddress) {
            case 1:
                return g.setCatchFinallyBlocks(2), d = SDK_CONFIGURATIONS().S3_CONFIG_URL + WebSDKObject.globals.appId + ".json", g.yield(fetch(d, {
                    method: "GET"
                }), 4);
            case 4:
                return f = g.yieldResult, g.yield(f.json(), 5);
            case 5:
                return c = g.yieldResult, g["return"](c);
            case 2:
                return g.enterCatchBlock(), g["return"]({})
        }
    })
}

function HVError(d) {
    d = void 0 === d ? {
        errorCode: 500,
        errorMsg: "Unknown error has occured"
    } : d;
    this.errorCode = d.errorCode;
    this.errorMsg = d.errorMsg;
    var f;
    this.transactionID = null == (f = WebSDKObject.globals) ? void 0 : f.transactionID
}
HVError.prototype.getErrorCode = function () {
    return this.errorCode
};
HVError.prototype.getErrorMessage = function () {
    return this.errorMsg
};
HVError.prototype.getTransactionID = function () {
    return this.transactionID
};

function HVResponse(d) {
    d = void 0 === d ? {
        response: "",
        headers: "",
        imgBase64: "",
        attemptsCount: 1
    } : d;
    var f;
    this.transactionID = null == (f = WebSDKObject.globals) ? void 0 : f.transactionID;
    this.response = d.response;
    this.headers = d.headers;
    this.imgBase64 = d.imgBase64;
    this.action = "";
    this.attemptsCount = d.attemptsCount
}
HVResponse.prototype.getApiResult = function () {
    return this.response
};
HVResponse.prototype.getApiHeaders = function () {
    return this.headers
};
HVResponse.prototype.getImageBase64 = function () {
    return this.imgBase64
};
HVResponse.prototype.getAction = function () {
    return this.action
};
HVResponse.prototype.getAttemptsCount = function () {
    return this.attemptsCount
};
HVResponse.prototype.getTransactionID = function () {
    return this.transactionID
};

function HVKycLink() {
    this.link = ""
}
HVKycLink.prototype.getKycLink = function () {
    return this.link
};

function HVExifData() {
    this.countryCode = this.country = this.city = this.ipAddress = this.userAgent = this.device = this.browserVersion = this.browser = this.longitude = this.latitude = this.datetime = ""
}
HVExifData.prototype.getDatetime = function () {
    return this.datetime
};
HVExifData.prototype.getLatitude = function () {
    return this.latitude
};
HVExifData.prototype.getLongitude = function () {
    return this.longitude
};
HVExifData.prototype.getBrowser = function () {
    return this.browser
};
HVExifData.prototype.getBrowserVersion = function () {
    return this.browserVersion
};
HVExifData.prototype.getDevice = function () {
    return this.device
};
HVExifData.prototype.getUserAgent = function () {
    return this.userAgent
};
HVExifData.prototype.getIpAddress = function () {
    return this.ipAddress
};
HVExifData.prototype.getCity = function () {
    return this.city
};
HVExifData.prototype.getCountry = function () {
    return this.country
};
HVExifData.prototype.getCountryCode = function () {
    return this.countryCode
};

function geolocationNotSupported(d) {
    d({
        coords: {
            latitude: "Geolocation is not supported by this browser",
            longitude: "Geolocation is not supported by this browser"
        }
    })
}

function getLocation(d) {
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(d, d, {
        timeout: 1E4
    }) : geolocationNotSupported(d)
}

function fetchWithTimeout(d, f) {
    var c, g, b, a, e;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (h) {
        if (1 == h.nextAddress) return c = f, g = void 0 === c.timeout ? 8E3 : c.timeout, b = new AbortController, a = setTimeout(function () {
            return b.abort()
        }, g), h.yield(fetch(d, Object.assign({}, f, {
            signal: b.signal
        })), 2);
        e = h.yieldResult;
        clearTimeout(a);
        return h["return"](e)
    })
}

function getIpJsonip() {
    var d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        switch (c.nextAddress) {
            case 1:
                return c.setCatchFinallyBlocks(2), c.yield(fetchWithTimeout("https://jsonip.com/", {
                    method: "GET",
                    timeout: 1E4
                }), 4);
            case 4:
                return d = c.yieldResult, c.yield(d.json(), 5);
            case 5:
                return f = c.yieldResult, c["return"](f.ip);
            case 2:
                return c.enterCatchBlock(), c["return"]("Problem in fetching Ip")
        }
    })
}

function getIpCloudflare() {
    var d, f, c, g;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
        switch (b.nextAddress) {
            case 1:
                return b.setCatchFinallyBlocks(2), b.yield(fetchWithTimeout("https://www.cloudflare.com/cdn-cgi/trace", {
                    method: "GET",
                    timeout: 1E4
                }), 4);
            case 4:
                return d = b.yieldResult, b.yield(d.text(), 5);
            case 5:
                return f = b.yieldResult, c = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, g = f.match(c)[0], b["return"](g);
            case 2:
                return b.enterCatchBlock(), b["return"]("Problem in fetching Ip")
        }
    })
}

function getIpIpify() {
    var d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        switch (c.nextAddress) {
            case 1:
                return c.setCatchFinallyBlocks(2), c.yield(fetchWithTimeout("https://api.ipify.org/?format=json", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 1E4
                }), 4);
            case 4:
                return d = c.yieldResult, c.yield(d.json(), 5);
            case 5:
                return f = c.yieldResult, c["return"](f.ip);
            case 2:
                return c.enterCatchBlock(), c["return"]("Problem in fetching Ip")
        }
    })
}

function processConfig(d, f) {
    "OCR" === d.configType ? HVDocsModule.start(d, f) : "FACE" === d.configType && HVFaceModule.start(d, f)
}
var toBase64 = function (d) {
    return new Promise(function (f, c) {
        var g = new FileReader;
        g.readAsDataURL(d);
        g.onload = function () {
            return f(g.result)
        };
        g.onerror = function (b) {
            return c(b)
        }
    })
};

function fileToBase64(d) {
    var f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        if (1 == c.nextAddress) return c.yield(toBase64(d)["catch"](function (g) {
            return Error(g)
        }), 2);
        f = c.yieldResult;
        return c["return"](f)
    })
}

function sendResultsBack(d, f, c, g, b) {
    var a, e, h, k, l, n, m, p, q, r;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (u) {
        if (1 == u.nextAddress) return a = HVFirebaseObject, e = a.hvFirebaseApp, h = a.getHVDatabase, k = a.referencePathInHVDatabase, l = a.setDataToHVDatabase, n = h(e), m = encryptData(f, c), u.yield(getS3SignedUrl(m), 2);
        p = u.yieldResult;
        q = k(n, d);
        l(q, {
            s3Url: p
        });
        r = !1;
        f.forEach(function (t) {
            t.hvError && t.hvError.errorCode ? r = !0 : t.hvResponse && t.hvResponse.response && t.hvResponse.response.status && "failure" === t.hvResponse.response.status &&
                (r = !0)
        });
        r ? location.replace(g) : location.replace(b);
        u.jumpToEnd()
    })
}

function detectWebcam() {
    var d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        if (1 == c.nextAddress) {
            d = navigator.mediaDevices;
            if (!d || !d.enumerateDevices) return c["return"](!1);
            f = !0;
            return c.yield(d.enumerateDevices().then(function (g) {
                f = g.some(function (b) {
                    return "videoinput" === b.kind
                })
            }), 2)
        }
        return c["return"](f)
    })
}
var dataReceived = !1;

function isDataReceived() {
    dataReceived || (removeHVLoader(), showPopupMsg("Looks like this link is no longer valid"))
}

function startKycProcess(d) {
    var f, c, g;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
        f = new URL(window.location.href);
        c = f.searchParams.get("token");
        g = f.searchParams.get("key");
        d.token = c;
        d.key = g;
        setTimeout(isDataReceived, 15E3);
        getDataFromFirebase(c, g, function (a, e) {
            d.tokenId = e;
            dataReceived = !0;
            var h = JSON.parse(a),
                k = h.transactionID,
                l = h.configs,
                n = h.startTime;
            HyperSnapSDK.init(h.jwtToken, h.regionName);
            HyperSnapSDK.startUserSession(k, n);
            d.totalConfigs = l.length;
            d.configs = l;
            removeHVLoader();
            processConfig(d.configs[d.configNumber], d.callback)
        });
        b.jumpToEnd()
    })
}

function getKycUrl(d, f, c) {
    isInternetExplorer() ? f = d + "?token=" + f + "&key=" + c : (d = new URL(d), d.searchParams.append("token", f), d.searchParams.append("key", c), f = d.href);
    return f
}
var HyperSnapParams = {
    Region: {
        India: "India",
        AsiaPacific: "Vietnam",
        UnitedStates: "UnitedStates",
        Africa: "Africa",
        Global: "Global"
    }
},
    HVCamModule = {
        results: [],
        totalConfigs: 0,
        data: "",
        token: "",
        tokenId: "",
        configNumber: 0,
        configs: "",
        baseUrl: SDK_CONFIGURATIONS().SERVER_URL + "/v2/qr",
        redirectPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/thankYou",
        redirectErrorPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/error",
        key: "",
        detectWebcam: function () {
            var d, f;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
                if (1 == c.nextAddress) {
                    d =
                        navigator.mediaDevices;
                    if (!d || !d.enumerateDevices) return c["return"](!1);
                    f = !0;
                    return c.yield(d.enumerateDevices().then(function (g) {
                        f = g.some(function (b) {
                            return "videoinput" === b.kind
                        })
                    }), 2)
                }
                return c["return"](f)
            })
        },
        start: function (d, f) {
            isInitialized(d) && (areScriptsLoaded() ? setupSocketServer(d, f, function (c, g) {
                var b = getKycUrl(HVCamModule.baseUrl, c, g),
                    a = new HVKycLink;
                a.link = b;
                d(null, a)
            }) : setTimeout(HVCamModule.start, 40, d, f))
        },
        process: function () {
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
                startLoader("Loading");
                areScriptsLoaded() ? startKycProcess(HVCamModule) : setTimeout(HVCamModule.process, 40);
                d.jumpToEnd()
            })
        },
        callback: function (d, f) {
            HVCamModule.results.push({
                hvError: d,
                hvResponse: f
            });
            HVCamModule.configNumber += 1;
            if (HVCamModule.totalConfigs === HVCamModule.configNumber) {
                var c = HVCamModule;
                sendResultsBack(c.tokenId, c.results, c.key, c.redirectErrorPageUrl, c.redirectPageUrl);
                startLoader()
            } else processConfig(HVCamModule.configs[HVCamModule.configNumber], HVCamModule.callback)
        },
        setRedirectPageUrl: function (d) {
            HVCamModule.redirectPageUrl =
                d
        },
        setErrorRedirectPageUrl: function (d) {
            HVCamModule.redirectErrorPageUrl = d
        },
        setBaseUrl: function (d) {
            HVCamModule.baseUrl = d
        }
    },
    HVBrowserModule = {
        isInternetExplorer: function () {
            return isInternetExplorer()
        }
    },
    HyperSnapSDK = {
        init: function (d, f, c, g) {
            c = void 0 === c ? !0 : c;
            g = void 0 === g ? !0 : g;
            "" === WebSDKObject ? WebSDKObject = new WebSDK({
                jwtToken: d,
                regionName: f,
                rudderanalytics: c,
                sentry: g
            }) : (WebSDKObject.globals.jwtToken = d, WebSDKObject.globals.regionName = f);
            WebSDKObject.globals.appId = parseJwt(d).appId;
            trackRudderAnalyticsPage("HyperSnapSDK initialised", {})
        },
        startUserSession: function (d, f) {
            d || (d = WebSDKObject.generateTransactionId(20));
            WebSDKObject.globals.transactionID = d;
            WebSDKObject.globals.startTime = f || Date.now();
            WebSDKObject.globals.rudderanalytics && (rudderanalytics.identify(d), trackRudderAnalyticsEvent("UserSessionStarted", {}))
        },
        endUserSession: function () {
            localStorage.removeItem("attempts");
            localStorage.removeItem("totalAttempts");
            trackRudderAnalyticsEvent("UserSessionEnded", {})
        },
        extractExifData: function (d) {
            var f = new HVExifData,
                c = getBrowser();
            c.name && (f.browser = c.name);
            c.version && (f.browserVersion = c.version);
            f.device = getDevice();
            f.userAgent = window.navigator.userAgent;
            f.datetime = (new Date).toLocaleString();
            sendData = function () {
                "" != f.latitude && "" != f.longitude && "" != f.ipAddress && d(f)
            };
            ipFunctions = [getIpIpify, getIpCloudflare, getIpJsonip];
            getClientIp = function () {
                var g, b, a, e, h, k;
                return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
                    switch (l.nextAddress) {
                        case 1:
                            g = "Problem in fetching ip", b = !1, a = 0;
                        case 2:
                            if (!(a < ipFunctions.length)) {
                                l.jumpTo(4);
                                break
                            }
                            return l.yield(ipFunctions[a](), 5);
                        case 5:
                            (g = l.yieldResult) && g.match(/^\d/) && (b = !0);
                            if (b) {
                                l.jumpTo(4);
                                break
                            }
                            a++;
                            l.jumpTo(2);
                            break;
                        case 4:
                            f.ipAddress = g;
                            if (!b) {
                                f.city = "Problem in fetching ip";
                                f.country = "Problem in fetching ip";
                                f.countryCode = "Problem in fetching ip";
                                l.jumpTo(6);
                                break
                            }
                            return l.yield(getGeoFromIP(g), 7);
                        case 7:
                            e = l.yieldResult, e.error ? (f.city = e.error, f.country = e.error, f.countryCode = e.error) : (h = e, k = h.geoDetails, f.city = k.city, f.country = k.country, f.countryCode = k.countryCode);
                        case 6:
                            sendData(),
                                l.jumpToEnd()
                    }
                })
            };
            getPosition = function (g) {
                g.coords ? (f.latitude = g.coords.latitude, f.longitude = g.coords.longitude) : (f.latitude = "User denied Geolocation", f.longitude = "User denied Geolocation");
                sendData()
            };
            getClientIp();
            getLocation(getPosition)
        }
    },
    HVFaceModule = {
        start: function (d, f, c) {
            var g;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
                if (1 == b.nextAddress) return isInitialized(f) ? b.yield(getConfigurations(), 3) : b.jumpTo(0);
                g = b.yieldResult;
                d.uiCallback = c ? c : function () { };
                "use_branding" in g &&
                    (d.useBranding = g.use_branding);
                "" === d.endpoint && (d.endpoint = d[WebSDKObject.globals.regionName].url);
                WebSDKObject.runFace(d, f);
                b.jumpToEnd()
            })
        }
    },
    HVDocsModule = {
        start: function (d, f, c) {
            var g;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (b) {
                if (1 == b.nextAddress) return isInitialized(f) ? b.yield(getConfigurations(), 3) : b.jumpTo(0);
                g = b.yieldResult;
                d.uiCallback = c ? c : function () { };
                "use_branding" in g && (d.useBranding = g.use_branding);
                d.chooseDocumentCaptureOption ? WebSDKObject.showUserChoiceScreen(d, f) :
                    WebSDKObject.runOCR(d, f);
                b.jumpToEnd()
            })
        }
    },
    HVQRModule = {
        self: this,
        results: [],
        totalConfigs: 0,
        data: "",
        token: "",
        tokenId: "",
        configNumber: 0,
        configs: "",
        baseUrl: SDK_CONFIGURATIONS().SERVER_URL + "/v2/qr",
        redirectPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/thankYou",
        redirectErrorPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/error",
        key: "",
        popupId: "HV_QR_POPUP",
        uiCustomizationId: {
            qrScreen: "hv-qr-popup"
        },
        browserNotSupportedTitle: "Browser not supported",
        qrScreenTitle: "Whoops ! Looks like there is no camera on this device",
        qrScreenDescription: " Please Scan this QR code and complete your KYC on another device with camera",
        qrScreenBottomDescription: "You will be continuing the process here once you complete the KYC on your other device. Please don't close this window",
        browserNotSupportedText: "This Web Browser is not supported. Please open this link in Chrome/Firefox for Windows or Safari for MacOS",
        start: function (d, f, c) {
            c = void 0 === c ? !1 : c;
            isInitialized(d) && (areScriptsLoaded() ? setupSocketServer(d, f, function (g, b) {
                var a, e,
                    h, k;
                return $jscomp.asyncExecutePromiseGeneratorProgram(function (l) {
                    if (1 == l.nextAddress) return a = getKycUrl(HVQRModule.baseUrl, g, b), c && (e = new HVKycLink, e.link = a, d(null, e)), h = {
                        popupId: HVQRModule.popupId,
                        configType: "QR",
                        qrScreenTitle: HVQRModule.qrScreenTitle,
                        qrScreenDescription: HVQRModule.qrScreenDescription,
                        qrScreenBottomDescription: HVQRModule.qrScreenBottomDescription,
                        browserNotSupportedTitle: HVQRModule.browserNotSupportedTitle,
                        uiCustomizationId: HVQRModule.uiCustomizationId,
                        useBranding: !0
                    }, l.yield(getConfigurations(),
                        2);
                    k = l.yieldResult;
                    "use_branding" in k && (h.useBranding = k.use_branding);
                    WebSDKObject.makeQrPopup(h, d);
                    WebSDKObject.showQR(a);
                    l.jumpToEnd()
                })
            }) : setTimeout(HVQRModule.start, 40, d, f, c))
        },
        process: function () {
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
                isInternetExplorer() || isVivoOrMiBrowser() ? showPopupMsg(HVQRModule.browserNotSupportedText) : (startLoader("Loading"), areScriptsLoaded() ? startKycProcess(HVQRModule) : setTimeout(HVQRModule.process, 40));
                d.jumpToEnd()
            })
        },
        callback: function (d, f) {
            HVQRModule.results.push({
                hvError: d,
                hvResponse: f
            });
            HVQRModule.configNumber += 1;
            if (HVQRModule.totalConfigs === HVQRModule.configNumber) {
                var c = HVQRModule;
                sendResultsBack(c.tokenId, c.results, c.key, c.redirectErrorPageUrl, c.redirectPageUrl);
                startLoader()
            } else processConfig(HVQRModule.configs[HVQRModule.configNumber], HVQRModule.callback)
        },
        setRedirectPageUrl: function (d) {
            HVQRModule.redirectPageUrl = d
        },
        setErrorRedirectPageUrl: function (d) {
            HVQRModule.redirectErrorPageUrl = d
        },
        setQRUrl: function (d) {
            HVQRModule.baseUrl = d
        },
        setQRScreenTitle: function (d) {
            HVQRModule.qrScreenTitle =
                d
        },
        setQRScreenDescription: function (d) {
            HVQRModule.qrScreenDescription = d
        },
        setQRScreenBottomDescription: function (d) {
            HVQRModule.qrScreenBottomDescription = d
        },
        setBrowserNotSupportedTitle: function (d) {
            HVQRModule.browserNotSupportedTitle = d
        }
    },
    HVNetworkHelper = {
        enableLoader: !1,
        Vietnam: {
            url: "https://apac-faceid.hyperverge.co/v1/photo/verifyPair"
        },
        India: {
            url: "https://ind-faceid.hyperverge.co/v1/photo/verifyPair"
        },
        UnitedStates: {
            url: "https://usa-faceid.hyperverge.co/v1/photo/verifyPair"
        },
        Africa: {
            url: "https://zaf-face.hyperverge.co/v1/photo/verifyPair"
        },
        Global: {
            url: "https://ind.idv.hyperverge.co/v1/matchFace"
        },
        makeFaceMatchCall: function (d, f, c, g, b) {
            var a = this,
                e, h, k, l, n, m, p, q;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function (r) {
                switch (r.nextAddress) {
                    case 1:
                        if (!isInitialized(b)) return r["return"]();
                        e = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/faceMatch";
                        h = a[WebSDKObject.globals.regionName].url;
                        g.authorization = WebSDKObject.globals.jwtToken;
                        g.transactionID = WebSDKObject.globals.transactionID;
                        k = getBrowser();
                        k.name && (g.browser = k.name);
                        k.version &&
                            (g.browserVersion = k.version);
                        g.device = getDevice();
                        g.userAgent = window.navigator.userAgent;
                        g.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME;
                        g.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION;
                        a.enableLoader && startLoader("Verifying if faces match...");
                        r.setCatchFinallyBlocks(2);
                        return r.yield(fetch(e, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                appid: WebSDKObject.globals.appId
                            },
                            body: JSON.stringify({
                                selfie: d,
                                actualEndpoint: h,
                                id: f,
                                params: c,
                                headers: g
                            })
                        }), 4);
                    case 4:
                        return l = r.yieldResult, r.yield(responseHandler(null,
                            l), 5);
                    case 5:
                        return n = r.yieldResult, m = n.errorObj, p = n.responseObj, removeHVLoader(), r["return"](b(m, p));
                    case 2:
                        return r.enterCatchBlock(), r.yield(responseHandler(null, null), 6);
                    case 6:
                        return q = r.yieldResult, m = q.errorObj, p = q.responseObj, removeHVLoader(), r["return"](b(m, p))
                }
            })
        },
        setEnableLoader: function (d) {
            this.enableLoader = d
        },
        setGlobalFaceMatchEndpoint: function (d) {
            this.Global.url = d
        }
    };
(function (d) {
    function f(c) {
        this.globals = {
            iOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !d.MSStream,
            isFirefox: "undefined" !== typeof InstallTrigger,
            isAndroid: -1 < navigator.userAgent.toLowerCase().indexOf("android"),
            protocol: location.protocol.match(/https/i) ? "https" : "http",
            detectionThreshold: 15,
            swfURL: "",
            loaded: !1,
            live: !1,
            userMedia: !0,
            recordedBlobs: [],
            flip_horiz: "selfie" === c.mode,
            oldCameraLogoImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC0FBMVEUAAAArp78mpb0forsforsforsforslpL0go7wkpL0jpL0forsgo7wforsforsforsforuPy9sforsho7wforsforsforsdobsforsio7wforsppr4forseorsdobsforsio7wforsforsforsforsforseorsmpb4fortcu86l0+J2xtYforsfortDsMYcobseorsforub0N8eorsforsforu+3Okforsforsforsfort0wtQforsforvL4e0forsforsforsfort7xNZovdAfortauMxWt8s9rcS62+ie0eB6xNZovdBIssjq7PYforsforvE3uu02eYforvf6PPS5O/Q4+6w1+Wt1uSp1eMbobqJydofort5x9cdors8rcTq7PYYn7nl6/Tg6fPb5/HH3+y/3eq22eeWzt5cu85tv9Jcus5StcoYn7nh6fPb5/IYn7nI4OwforsXn7mGyNmAxtdgus5eus5RtMqDy9rs7vbl6/TV5fAWn7kWnrlcu86o1OORzNx0xdVcu85euc5cu852xtZrwtPn6/UWn7kVnrkYn7l2xtaDxtgYn7kfort/ytl2xtYVnrlcu85cu85aus2n2uSGzdqn2uTt7fYforvu7vf////w7/fT0+f68vrV1ejS0ubs7Pbn5/Ph4fDX1+nj4/Aaobr08PkWn7nf3+4Yn7nc3Oz38fkdorvy7/jz7/jd3e0Tnrj28Pn48frZ2erq6vX88/tHsseVz95BsMY9rsTp6fR6xdZYuc1OtMktqMBzwdQ5rMQ0qsIopr4kpb3e6PLa5/HN4u1ku88QnLfr7Pbl5fLX5fHS5O/B3uq42+ir1uSCyNn5/f7z+vzm6/TP4+7D4uyf2OKg0uGN0N2IzNtcu872/P3v+Pr28fnj6vTX7vPg6/PU5fDK4eyp2+Wn1OOb0N+Iydrp9vjh8/bm7fXQ7PHH6O5ovtGv1+WER/aUAAAAmXRSTlMAAxT1Yew1BggbF/sL/vnGjIs7Aei6hU4pDvES0sp+MB/WrZd3c0cQ2bqknWdZLiSrn5hWUc7CwKabeWhe5dK2sZGPcldLSEQnvp1tWzX44d7Lti3r2tayrquIg21kRCP18u3t4svGuZKJYUtA++/o4dDCpn52UU48Dvrx39Cv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",
            logoImg: "data:image/png;base64,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",
            disabledCaptureImg: "data:image/png;base64,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",
            blankImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUUxOEI4NEY4MjYwMTFFQThCNzFDMEExRjQxNzY2MTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUUxOEI4NTA4MjYwMTFFQThCNzFDMEExRjQxNzY2MTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBRTE4Qjg0RDgyNjAxMUVBOEI3MUMwQTFGNDE3NjYxMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBRTE4Qjg0RTgyNjAxMUVBOEI3MUMwQTFGNDE3NjYxMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph+tdMcAAByiSURBVHja7F0JfFTV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",
            recordImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0M0M0JDRkU4MjYwMTFFQUE4OUZCRDYyMUY3QjhGRTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0M0M0JDRkY4MjYwMTFFQUE4OUZCRDYyMUY3QjhGRTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDQzQzQkNGQzgyNjAxMUVBQTg5RkJENjIxRjdCOEZFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQzQzQkNGRDgyNjAxMUVBQTg5RkJENjIxRjdCOEZFNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtZFQL8AACWkSURBVHja7F0HfFRV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",
            isSetdocCaptureReviewBottomDescription: !1,
            frameDiffs: [],
            lastFrame: [],
            livenessVideoRecording: [{
                video: null,
                generated: !1,
                startTime: null,
                stopTime: null,
                recorder: null,
                recorderLoop: null
            }, {
                video: null,
                generated: !1,
                startTime: null,
                stopTime: null,
                recorder: null,
                recorderLoop: null
            }],
            faceDetectionDelay: 0,
            finalLivenessVideo: "",
            cameraLabel: "ok",
            mediaDeviceType: "real",
            frameRate: 0
        };
        this.obj_merge(this, this.globals);
        this.documents = {
            CARD: {
                ratio: .625,
                width: 640
            },
            PASSPORT: {
                ratio: .67,
                width: 640
            },
            A4: {
                ratio: 1.4,
                width: 640
            },
            OTHER: {
                ratio: 1,
                width: 640
            }
        };
        this.params = {
            mode: "document",
            capture: "image",
            documentType: "CARD",
            width: 640,
            ratio: 1,
            imageName: "image.jpeg",
            imageFormat: "jpeg",
            jpegQuality: 100,
            mirrorMode: !1,
            docCaptureDescription: "Make sure your document is without any glare and is fully inside",
            docCaptureBottomDescription: "Make sure your document is without any glare and is fully inside",
            docReviewDescription: "Is your document fully visible, glare free and not blurred?",
            docCaptureReviewBottomDescription: "Please Review if the document is visible",
            docCaptureTitle: "Capture ID Card",
            faceCaptureReviewTopTitle: "Review Your Photo",
            docCaptureReviewRetakeBtnText: "Retake Photo",
            imageSubmitBtnText: "Use this Photo",
            iosPlaceholderText: "",
            faceCaptureDescription: "Make sure your face is inside the circle and is fully visible",
            faceCaptureBottomDescription: "Make sure your face is inside the circle and is fully visible",
            faceCaptureReviewTitle: "Is your face fully visible, and not blurred?",
            faceCaptureReviewBottomDescription: "Please Review if your face is fully visible",
            faceCaptureTitle: "Capture Selfie",
            faceNotDetectedDescription: "Please place your face inside the circle",
            faceTooBigDescription: "Please Move away from the camera",
            faceTooSmallDescription: "Please move closer to the camera",
            faceDetectedDescription: "Capture Now",
            videoLength: 5E3,
            audio: !0,
            videoName: "video.mp4",
            onSave: function () { },
            uiCallback: function () { },
            onError: "",
            debug: !1,
            actualDocumentSide: "",
            shouldShowDocReviewScreen: !1,
            captureScreenId: "",
            reviewScreenId: "",
            useBranding: !0,
            trackRudderAnalyticsEvent: function () { },
            getAttemptsKey: function () { },
            trackSensorDataEvents: function () { },
            rudderStackType: "",
            endPoint: ""
        };
        this.unsupported = {
            firefox_android: 1
        };
        this.obj_merge(this.params, c);
        this.hooks = {
            load: null,
            live: null,
            uploadcomplete: null,
            uploadprogress: null,
            error: function (g) {
                throw Error(g);
            }
        };
        this.init()
    }
    f.prototype.init = function () {
        "function" == typeof this.params.onError && (this.hooks.error = this.params.onError);
        if ("https:" != document.location.protocol && "localhost" !== location.hostname && "127.0.0.1" !== location.hostname) return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "001",
            errorMessage: "Https required for accessing camera"
        }), this.dispatch("error", "HypervergeSDK.js Error: 001 Https required for accessing camera");
        if (document.querySelector("meta[name='viewport']")) this.custommeta = !1;
        else {
            var c = document.createElement("meta");
            c.name = "viewport";
            c.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
            document.head.appendChild(c);
            this.custommeta = !0
        }
        this.globals.recordedBlobs = [];
        if ("document" == this.params.mode)
            if (this.documents[this.params.documentType]) this.params.ratio =
                this.documents[this.params.documentType].ratio, this.params.width = this.documents[this.params.documentType].width, this.params.width * this.params.ratio > d.screen.availHeight && (this.params.width = d.screen.availHeight / this.params.ratio);
            else return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
                source: "sdk",
                errorCode: "002",
                errorMessage: "Wrong document type added"
            }), this.dispatch("error", "HypervergeSDK.js Error: 002 Wrong document type added");
        else this.params.docCaptureTitle = this.params.faceCaptureTitle,
            this.params.docCaptureDescription = this.params.faceCaptureDescription, this.params.docCaptureBottomDescription = this.params.faceCaptureBottomDescription, this.params.docReviewDescription = this.params.faceCaptureReviewTitle, this.params.docCaptureReviewBottomDescription = this.params.faceCaptureReviewBottomDescription, this.consecutiveDetections = 0;
        this.mediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices : navigator.mozGetUserMedia || navigator.webkitGetUserMedia ? {
            getUserMedia: function (b) {
                return new Promise(function (a,
                    e) {
                    (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, b, a, e)
                })
            }
        } : null;
        d.URL = d.URL || d.webkitURL || d.mozURL || d.msURL;
        this.userMedia = this.userMedia && !!this.mediaDevices && !!d.URL;
        navigator.userAgent.match(/Firefox\D+(\d+)/) && 21 > parseInt(RegExp.$1, 10) && (this.userMedia = null);
        var g = this;
        this.userMedia && d.addEventListener("beforeunload", function (b) {
            g.reset()
        });
        this.starting = 0
    };
    f.prototype.attach = function (c, g) {
        var b = this;
        "string" == typeof c && (c = document.getElementById(c) || document.querySelector(c));
        if (!c) return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "003",
            errorMessage: "Could not locate DOM element to attach to."
        }), this.dispatch("error", "HypervergeSDK.js Error: 003 Could not locate DOM element to attach to.");
        c.innerHTML = "";
        var a = document.createElement("center"),
            e = document.createElement("div"),
            h = document.createElement("div"),
            k = document.createElement("button"),
            l = document.createElement("button"),
            n = document.createElement("a"),
            m = document.createElement("a"),
            p = document.createElement("a"),
            q = document.createElement("img"),
            r = document.createElement("img"),
            u = document.createElement("div"),
            t = document.createElement("span");
        this.peg = document.createElement("div");
        this.cameraholder = document.createElement("div");
        this.cameraLoadingText = document.createElement("div");
        this.divcapturetitle = document.createElement("div");
        this.divcapturelabel = document.createElement("div");
        this.divcapturelabelbottom = document.createElement("div");
        this.capturebtn = n;
        this.captureDisabledbtn = m;
        this.reviewbtn = h;
        this.videorecordbtn = p;
        this.videotimer = document.createElement("span");
        this.videorecimg = document.createElement("img");
        a.setAttribute("class", "hv-center-element");
        this.divcapturetitle.setAttribute("class", "hv-title");
        this.divcapturelabel.setAttribute("class", "hv-instructions");
        this.divcapturelabelbottom.setAttribute("class", "hv-bottom-instructions");
        this.cameraholder.setAttribute("id", "hv-cameraholder");
        h.style.display = "none";
        h.setAttribute("class", "hv-btnposition hv-review-buttons");
        k.setAttribute("class", "hypervergebtn hv-retake-btn");
        l.setAttribute("class", "hypervergebtn hv-use-this-photo-btn");
        e.setAttribute("class", "hv-divforcover");
        this.cameraLoadingText.setAttribute("id", "hv-cameraLoadingText");
        q.src = this.globals.logoImg;
        r.src = this.globals.disabledCaptureImg;
        q.setAttribute("class", "hv-btnposition hv-icon-img");
        r.setAttribute("class", "hv-btnposition hv-icon-img");
        this.videorecimg.src = this.globals.recordImg;
        this.videorecimg.style.width = "auto";
        this.videotimer.style.cssText =
            "position: fixed;left: 50%;transform: translate(-50%);font-size: 3em;color:#34a9c0";
        this.videorecimg.setAttribute("class", "hv-btnposition");
        u.setAttribute("class", "hv-modal-footer");
        t.setAttribute("class", "footertext");
        this.cameraLoadingText.innerHTML = "Loading Camera....Please wait";
        this.divcapturetitle.innerHTML = this.params.docCaptureTitle;
        this.divcapturelabel.innerHTML = this.params.docCaptureDescription;
        this.divcapturelabelbottom.innerHTML = this.params.docCaptureBottomDescription;
        k.innerHTML = this.params.docCaptureReviewRetakeBtnText;
        l.innerHTML = this.params.imageSubmitBtnText;

        this.params.useBranding || (t.innerHTML = "");
        this.capturebtn.setAttribute("id", "hv-camera-capture-button");
        var w = (JSON.parse(localStorage.getItem("attempts")) || 0)[this.params.getAttemptsKey(this.params.endPoint, this.params)] || 0;
        k.addEventListener("click", function () {
            b.params.trackRudderAnalyticsEvent("" + b.params.rudderStackType + b.params.actualDocumentSide + "Retake", {
                attempts: w
            });
            b.unfreeze();
            a.appendChild(u);
            g.setAttribute("id",
                b.params.captureScreenId)
        }, !1);
        l.addEventListener("click", function () {
            b.params.trackRudderAnalyticsEvent("" + b.params.rudderStackType + b.params.actualDocumentSide + "ReviewSuccess", {
                attempts: w
            });
            b.takePhoto()
        }, !1);
        n.addEventListener("click", function () {
            "selfie" == b.params.mode ? (b.params.trackSensorDataEvents("selfieCaptureClicked", Date.now()), b.params.trackRudderAnalyticsEvent("SelfieCaptured", {}), b.takePhoto()) : b.params.shouldShowDocReviewScreen ? (b.freeze(), a.removeChild(u), g.setAttribute("id", b.params.reviewScreenId)) :
                (b.params.trackRudderAnalyticsEvent("" + b.params.rudderStackType + b.params.actualDocumentSide + "Captured", {}), b.takePhoto())
        }, !1);
        this.stopRecordingFunc = function () {
            b.startRecording()
        };
        p.addEventListener("click", this.stopRecordingFunc, !1);
        c.appendChild(a);
        a.appendChild(this.divcapturetitle);
        a.appendChild(this.divcapturelabel);
        a.appendChild(this.cameraholder);
        a.appendChild(this.divcapturelabelbottom);
        h.appendChild(k);
        h.appendChild(l);
        e.appendChild(h);
        "video" == this.params.capture ? (p.appendChild(this.videorecimg),
            p.appendChild(this.videotimer), e.appendChild(p)) : (n.appendChild(q), e.appendChild(n));
        a.appendChild(e);
        u.appendChild(t);
        a.appendChild(u);
        this.cameraholder.appendChild(this.peg);
        this.cameraholder.appendChild(this.cameraLoadingText);
        if (this.userMedia) h = document.createElement("video"), h.setAttribute("class", "hv-preview-video"), this.iOS ? (h.setAttribute("autoplay", ""), h.setAttribute("muted", ""), h.setAttribute("playsinline", "")) : h.setAttribute("autoplay", "autoplay"), h.muted = !0, h.style.width = "" + this.params.width +
            "px", h.style.height = "" + this.params.width * this.params.ratio + "px", this.cameraholder.style.overflow = "hidden", this.video = h, this.capturebtn.style.display = "none", m.appendChild(r), e.appendChild(m), "selfie" == this.params.mode ? (this.videomask = document.createElement("div"), this.videomask.style.cssText = ";border-radius: " + Math.round(this.params.width / 2) + "px; overflow: hidden; -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%); ", this.videomask.setAttribute("class", "hv-liveness-face-not-found"),
                this.videomask.appendChild(h), this.cameraholder.appendChild(this.videomask), this.captureDisabledbtn.style.display = "") : this.cameraholder.appendChild(h), this.getStream(), this.container = this.cameraholder;
        else return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "004",
            errorMessage: "No interface found"
        }), this.dispatch("error", "HypervergeSDK.js Error: 004 No interface found")
    };
    f.prototype.isVivoOrMiBrowser = function () {
        var c = d.navigator.userAgent;
        return c.match(/MiuiBrowser/i) ||
            !!c.match(/VivoBrowser/i)
    };
    f.prototype.isRedmiNote8 = function () {
        return d.navigator.userAgent.match(/Redmi Note 8/i) ? !0 : !1
    };
    f.prototype.triggerNativeCameraConditions = function () {
        return this.isVivoOrMiBrowser() && !this.isRedmiNote8() ? !0 : !1
    };
    f.prototype.toBase64 = function (c, g) {
        var b = new FileReader;
        b.readAsDataURL(c);
        b.onload = function () {
            g(b.result)
        };
        b.onerror = function (a) {
            return g(a)
        }
    };
    f.prototype.triggerNativeCamera = function () {
        var c = document.createElement("input"),
            g = this;
        c.setAttribute("type", "file");
        c.setAttribute("accept",
            "image/*");
        "selfie" === this.params.mode ? c.setAttribute("capture", "user") : c.setAttribute("capture", "environment");
        c.onchange = function () {
            g.toBase64(c.files[0], g.params.onSave)
        };
        c.click()
    };
    f.prototype.makepopup = function () {
        var c = this;
        if (!this.mediaDevices || this.triggerNativeCameraConditions()) return this.triggerNativeCamera();
        var g = document.createElement("div"),
            b = document.createElement("style"),
            a = document.createElement("span"),
            e = document.createElement("div");
        this.popup = document.createElement("div");
        this.popup.setAttribute("class",
            "hv-modal hv-show-modal");
        g.setAttribute("class", "hv-modal-content");
        g.setAttribute("id", this.params.captureScreenId);
        a.setAttribute("class", "hv-close-button");
        a.innerHTML = "&times;";
        a.addEventListener("click", function (h) {
            c.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
                source: JSON.stringify(h.path, ["id", "className", "tagName"]),
                errorCode: "013",
                errorMessage: "Operation Cancelled By User"
            });
            document.body.removeChild(c.popup);
            c.reset();
            c.resetLivenessVideoRecording();
            c.dispatch("error", "HypervergeSDK.js Error: 013 Operation Cancelled By User")
        });
        document.getElementsByTagName("head")[0].appendChild(b);
        this.params.uiCallback(g, a, this);
        g.appendChild(a);
        g.appendChild(e);
        this.attach(e, g);
        this.popup.appendChild(g);
        document.body.appendChild(this.popup);
        g = document.getElementsByClassName("hv-modal-content")[0].offsetHeight - document.getElementsByClassName("hv-title")[0].offsetHeight - document.getElementsByClassName("hv-instructions")[0].offsetHeight - document.getElementsByClassName("hv-bottom-instructions")[0].offsetHeight - 10;
        b = document.getElementsByClassName("hv-modal-content")[0].offsetWidth;
        b < this.params.width && (this.params.width = .85 * b, this.video.style.height = "" + this.params.width * this.params.ratio + "px", this.video.style.width = "" + this.params.width + "px", b = document.getElementsByClassName("hv-divforcover")[0].offsetHeight, a = document.getElementsByClassName("hv-modal-footer")[0].offsetHeight, "document" == this.params.mode && (b = g - b - a - this.params.width * this.params.ratio, 0 < b && (this.cameraholder.style.marginTop = "" + b / 3 + "px")), "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width /
            2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width));
        this.params.width * this.params.ratio * 1.6 > g && (this.params.width = g / (1.6 * this.params.ratio), this.video.style.height = "" + this.params.width * this.params.ratio + "px", this.video.style.width = "" + this.params.width + "px", "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width / 2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width),
            document.body.appendChild(this.popup))
    };
    f.prototype.reset = function () {
        clearInterval(this.detectinterval);
        clearTimeout(this.globals.faceDetectionDelay);
        if (this.userMedia) {
            try {
                this.stream.getTracks().forEach(function (c) {
                    c.stop()
                })
            } catch (c) { }
            delete this.stream;
            delete this.video
        }
        this.stopLivenessVideoRecording();
        this.container && (this.container.innerHTML = "", delete this.container);
        this.live = this.loaded = !1;
        this.custommeta && document.querySelector("meta[name='viewport']").remove()
    };
    f.prototype.set = function () {
        if (1 ==
            arguments.length)
            for (var c in arguments[0]) this.params[c] = arguments[0][c];
        else this.params[arguments[0]] = arguments[1]
    };
    f.prototype.on = function (c, g) {
        c = c.replace(/^on/i, "").toLowerCase();
        if ("undefined" == typeof this.hooks[c]) throw "Event type not supported: " + c;
        this.hooks[c] = g
    };
    f.prototype.dispatch = function () {
        var c = arguments[0].replace(/^on/i, "").toLowerCase(),
            g = Array.prototype.slice.call(arguments, 1);
        return this.hooks[c] ? ("function" == typeof this.hooks[c] ? this.hooks[c].apply(this, g) : "array" == typeof this.hooks[c] ?
            this.hooks[c][0][this.hooks[c][1]].apply(this.hooks[c][0], g) : d[this.hooks[c]] && d[this.hooks[c]].apply(d, g), !0) : !1
    };
    f.prototype.freeze = function () {
        var c = this,
            g = this.params;
        this.preview_active && this.unfreeze();
        g.mirrorMode || this.unflip();
        var b = this.video.videoWidth,
            a = this.video.videoHeight,
            e = document.createElement("canvas");
        e.width = b;
        e.height = a;
        b = e.getContext("2d");
        this.preview_canvas = e;
        this.preview_context = b;
        this.capturebtn.style.display = "none";
        this.captureDisabledbtn.style.display = "none";
        this.reviewbtn.style.display =
            "block";
        this.videorecordbtn.style.display = "none";
        this.divcapturetitle.innerHTML = this.params.faceCaptureReviewTopTitle;
        this.divcapturelabel.innerHTML = this.params.docReviewDescription;
        this.globals.isSetdocCaptureReviewBottomDescription = !0;
        this.divcapturelabelbottom.innerHTML = this.params.docCaptureReviewBottomDescription;
        "video" == this.params.capture ? (g.mirrorMode || this.flip(), this.superBuffer = new Blob(this.recordedBlobs, {
            type: "video/mp4"
        }), this.previewvideo = document.createElement("video"), this.previewvideo.width =
            this.params.width, this.previewvideo.height = this.params.width * this.params.ratio, this.previewvideo.setAttribute("class", "hv-preview-video"), this.previewvideo.src = d.URL.createObjectURL(this.superBuffer), this.container.insertBefore(this.previewvideo, c.peg), this.previewvideo.play(), this.previewvideo.loop = !0, this.container.style.overflow = "hidden", this.video.style.display = "none", "selfie" == this.params.mode && (this.videomask.style.display = "none", this.videomask.style.height = this.video.style.height, this.videomask.style.width =
                this.video.style.width), this.preview_active = !0) : (this.tempimg = document.createElement("img"), this.tempimg.width = c.params.width, this.tempimg.height = c.params.width * c.params.ratio, this.tempimg.setAttribute("class", "hv-preview-video"), this.snap(function () {
                    c.globals.previewImgURL = e.toDataURL("image/" + g.imageFormat, g.jpegQuality / 100);
                    e.style.position = "relative";
                    e.style.left = "" + c.container.scrollLeft + "px";
                    e.style.top = "" + c.container.scrollTop + "px";
                    c.tempimg.src = c.globals.previewImgURL;
                    c.container.insertBefore(c.tempimg,
                        c.peg);
                    c.container.style.overflow = "hidden";
                    c.video.style.display = "none";
                    "selfie" == c.params.mode && (c.videomask.style.display = "none");
                    c.preview_active = !0;
                    if (c.userMedia) try {
                        this.stream.getTracks().forEach(function (h) {
                            h.stop()
                        })
                    } catch (h) { }
                }, e))
    };
    f.prototype.unfreeze = function () {
        this.preview_active && (this.video.style.display = "block", "selfie" == this.params.mode && (this.videomask.style.display = ""), "video" == this.params.capture ? (this.container.removeChild(this.previewvideo), this.videorecordbtn.style.display =
            "") : (this.container.removeChild(this.tempimg), delete this.preview_context, delete this.preview_canvas, this.capturebtn.style.display = "", this.captureDisabledbtn.style.display = "none"), this.divcapturetitle.innerHTML = this.params.docCaptureTitle, this.divcapturelabel.innerHTML = this.params.docCaptureDescription, this.divcapturelabelbottom.innerHTML = this.params.docCaptureBottomDescription, this.preview_active = this.globals.isSetdocCaptureReviewBottomDescription = !1, this.reviewbtn.style.display = "none", "document" ==
            this.params.mode && this.globals.iOS || this.flip())
    };
    f.prototype.flip = function () {
        if (!this.globals.iOS && !this.globals.isAndroid || this.globals.flip_horiz) {
            var c = this.container.style;
            c.webkitTransform = "scaleX(-1)";
            c.mozTransform = "scaleX(-1)";
            c.msTransform = "scaleX(-1)";
            c.oTransform = "scaleX(-1)";
            c.transform = "scaleX(-1)";
            c.filter = "FlipH";
            c.msFilter = "FlipH"
        }
    };
    f.prototype.unflip = function () {
        var c = this.container.style;
        c.webkitTransform = "scaleX(1)";
        c.mozTransform = "scaleX(1)";
        c.msTransform = "scaleX(1)";
        c.oTransform =
            "scaleX(1)";
        c.transform = "scaleX(1)";
        c.filter = "";
        c.msFilter = ""
    };
    f.prototype.savePreview = function (c, g) {
        var b = this.params,
            a = this.preview_canvas,
            e = this.preview_context,
            h = this;
        g && g.getContext("2d").drawImage(a, 0, 0);
        var k = this.globals.previewImgURL;
        if (b.mirrorMode && "document" != this.params.mode) {
            var l = new Image;
            l.src = k;
            l.onload = function () {
                var n = document.createElement("canvas");
                n.height = h.video.videoHeight;
                n.width = h.video.videoWidth;
                var m = n.getContext("2d");
                m.translate(h.video.videoWidth, 0);
                m.scale(-1, 1);
                m.drawImage(l, 0, 0);
                m.setTransform(1, 0, 0, 1, 0, 0);
                k = n.toDataURL("image/" + b.imageFormat, b.jpegQuality / 100);
                c(g ? null : k, a, e)
            }
        } else c(g ? null : k, a, e)
    };
    f.prototype.snap = function (c, g) {
        var b = this.params;
        if (!this.loaded) return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "007",
            errorMessage: "Webcam is not loaded yet"
        }), this.dispatch("error", " HypervergeSDK.js Error: 007 Webcam is not loaded yet");
        if (!c) return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "008",
            errorMessage: "Please provide a callback function or canvas to snap()"
        }), this.dispatch("error", "HypervergeSDK.js Error: 008 Please provide a callback function or canvas to snap()");
        if (this.preview_active) return this.savePreview(c, g), null;
        var a = document.createElement("canvas");
        a.width = this.video.videoWidth;
        a.height = this.video.videoHeight;
        var e = a.getContext("2d");
        !this.globals.flip_horiz || "document" == this.params.mode && this.globals.iOS || (e.translate(this.video.videoWidth, 0), e.scale(-1,
            1));
        this.params.mirrorMode && "document" == this.params.mode && (e.translate(this.video.videoWidth, 0), e.scale(-1, 1));
        var h = function () {
            this.src && this.width && this.height && e.drawImage(this, 0, 0, this.video.videoWidth, this.video.videoHeight);
            g && g.getContext("2d").drawImage(a, 0, 0);
            c(g ? null : a.toDataURL("image/" + b.imageFormat, b.jpegQuality / 100), a, e)
        };
        if (this.userMedia) {
            e.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
            var k = document.createElement("canvas");
            k.width = this.video.videoWidth;
            k.height =
                this.video.videoHeight;
            var l = k.getContext("2d");
            l.drawImage(a, 0, 0, this.video.videoWidth, this.video.videoHeight);
            e = l;
            a = k;
            h()
        } else return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "009",
            errorMessage: "Usermedia not found"
        }), this.dispatch("error", "HypervergeSDK.js Error: 009 Usermedia not found");
        return null
    };
    f.prototype.guid = function () {
        function c() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return [c() + c(), c(), c(), c(), c() + c() + c()].join("_")
    };
    f.prototype.obj_merge = function (c, g) {
        for (var b in g) c[b] = g[b]
    };
    f.prototype.b64ToUint6 = function (c) {
        return 64 < c && 91 > c ? c - 65 : 96 < c && 123 > c ? c - 71 : 47 < c && 58 > c ? c + 4 : 43 === c ? 62 : 47 === c ? 63 : 0
    };
    f.prototype.base64DecToArr = function (c, g) {
        for (var b = c.replace(/[^A-Za-z0-9\+\/]/g, ""), a = b.length, e = g ? Math.ceil((3 * a + 1 >> 2) / g) * g : 3 * a + 1 >> 2, h = new Uint8Array(e), k, l = 0, n = 0, m = 0; m < a; m++)
            if (k = m & 3, l |= this.b64ToUint6(b.charCodeAt(m)) << 18 - 6 * k, 3 === k || 1 === a - m) {
                for (k = 0; 3 > k && n < e; k++, n++) h[n] = l >>> (16 >>> k & 24) & 255;
                l = 0
            } return h
    };
    f.prototype.upload =
        function (c, g, b) {
            if (b) this.on("uploadComplete", b);
            if ("video" == this.params.capture) {
                b = "videoSrc";
                var a = this.params.videoName
            } else {
                b = "imageSrc";
                a = this.params.imageName;
                var e = "";
                if (c.match(/^data:image\/(\w+)/)) e = RegExp.$1;
                else throw "Cannot locate image format in Data URI";
                c = c.replace(/^data:image\/\w+;base64,/, "");
                c = new Blob([this.base64DecToArr(c)], {
                    type: "image/" + e
                })
            }
            var h = new XMLHttpRequest;
            h.open("POST", g, !0);
            var k = this;
            h.upload && h.upload.addEventListener && h.upload.addEventListener("progress", function (n) {
                n.lengthComputable &&
                    k.dispatch("uploadProgress", n.loaded / n.total, n)
            }, !1);
            var l = this;
            h.onload = function () {
                l.dispatch("uploadComplete", h.status, h.responseText, h.statusText)
            };
            g = new FormData;
            g.append(b, c, a);
            h.send(g)
        };
    f.prototype.initializeMediaRecorder = function () {
        var c = this.stream;
        if (c) {
            if (MediaRecorder.isTypeSupported("video/webm")) var g = {
                mimeType: "video/webm",
                videoBitsPerSecond: 1E6
            };
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) g = {
                mimeType: "video/webm; codecs=vp9",
                videoBitsPerSecond: 1E6
            };
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) g = {
                mimeType: "video/webm; codecs=vp8",
                videoBitsPerSecond: 1E6
            };
            else if (MediaRecorder.isTypeSupported("video/webm; codecs=h264")) g = {
                mimeType: "video/webm; codecs=h264",
                videoBitsPerSecond: 1E6
            };
            else if (MediaRecorder.isTypeSupported("video/mp4")) g = {
                mimeType: "video/mp4",
                videoBitsPerSecond: 1E6
            };
            else return;
            return new MediaRecorder(c, g)
        }
    };
    f.prototype.livenessVideoRecorderActions = function (c) {
        var g = [
            [],
            []
        ],
            b = this.globals.livenessVideoRecording[c];
        b.recorder = this.initializeMediaRecorder();
        b.recorder && (b.recorder.addEventListener("dataavailable",
            function (a) {
                a.data && 0 < a.data.size && g[c].push(a.data)
            }), b.recorder.addEventListener("stop", function () {
                b.stopTime = Date.now();
                var a = new Blob(g[c], {
                    type: "video/mp4"
                });
                b.video = a;
                b.generated = !0;
                g[c] = []
            }))
    };
    f.prototype.startLivenessVideoRecording = function (c) {
        var g = this.globals.livenessVideoRecording;
        this.livenessVideoRecorderActions(c);
        var b = g[c];
        b.recorder && (b.recorder.start(1), b.startTime = Date.now(), b.recorderLoop = setInterval(function () {
            b.recorder.stop();
            b.recorder.start(1);
            b.startTime = Date.now()
        }, 6E3))
    };
    f.prototype.stopLivenessVideoRecording = function () {
        var c = $jscomp.makeIterator(this.globals.livenessVideoRecording),
            g = c.next().value;
        c = c.next().value;
        if (g.recorder || c.recorder) g.generated = !1, c.generated = !1, clearInterval(g.recorderLoop), clearInterval(c.recorderLoop), "inactive" != g.recorder.state && g.recorder.stop(), c.recorder ? "inactive" != c.recorder.state && c.recorder.stop() : c.generated = !0
    };
    f.prototype.resetLivenessVideoRecording = function () {
        this.globals.livenessVideoRecording = [{
            video: null,
            generated: !1,
            startTime: null,
            stopTime: null,
            recorder: null,
            recorderLoop: null
        }, {
            video: null,
            generated: !1,
            startTime: null,
            stopTime: null,
            recorder: null,
            recorderLoop: null
        }]
    };
    f.prototype.sendVideoAndImageOnSave = function (c, g) {
        var b = this;
        this.stopLivenessVideoRecording();
        var a = this.globals,
            e = a.frameDiffs,
            h = a.mediaDeviceType,
            k = a.cameraLabel,
            l = a.frameRate;
        a = $jscomp.makeIterator(a.livenessVideoRecording);
        var n = a.next().value,
            m = a.next().value,
            p = setInterval(function () {
                if (n.generated && m.generated) {
                    clearInterval(p);
                    if (n.stopTime - n.startTime > m.stopTime -
                        m.startTime) b.params.onSave(c, g, e, h, k, n.video, l);
                    else b.params.onSave(c, g, e, h, k, m.video, l);
                    b.resetLivenessVideoRecording()
                }
            }, 10)
    };
    f.prototype.takePhoto = function () {
        var c = this;
        if ("video" == this.params.capture) {
            if ("function" === typeof this.params.onSave) this.params.onSave(d.URL.createObjectURL(this.superBuffer), this.superBuffer);
            this.params.uploadURL ? this.upload(this.superBuffer, this.params.uploadURL, function (g, b) { }) : localStorage.setItem(this.params.videoName, this.superBuffer);
            this.reset();
            document.body.removeChild(this.popup)
        } else this.snap(function (g) {
            if ("function" ===
                typeof c.params.onSave) {
                var b = "";
                if (g.match(/^data:image\/(\w+)/)) b = RegExp.$1;
                else throw "Cannot locate image format in Data URI";
                var a = g.replace(/^data:image\/\w+;base64,/, "");
                b = new Blob([c.base64DecToArr(a)], {
                    type: "image/" + b
                });
                var e = c.globals;
                a = e.frameDiffs;
                var h = e.livenessVideoRecording,
                    k = e.mediaDeviceType,
                    l = e.cameraLabel;
                e = e.frameRate;
                "virtual" === k && "selfie" === c.params.mode && (c.globals.frameDiffs = [0, 0, 0]);
                if (h[0].recorder || h[1].recorder) c.sendVideoAndImageOnSave(g, b);
                else c.params.onSave(g, b, a,
                    k, l, null, e)
            }
            c.params.uploadURL && c.upload(g, c.params.uploadURL, function (n, m) { });
            c.reset();
            document.body.removeChild(c.popup)
        })
    };
    f.prototype.startLivenessDataCollection = function () {
        var c = this;
        this.startLivenessVideoRecording(0);
        setTimeout(function () {
            c.startLivenessVideoRecording(1)
        }, 3E3)
    };
    f.prototype.getStream = function (c) {
        var g = this,
            // b = "selfie" == this.params.mode ? "user" : "environment",
            b = "environment",
            a = this;
        this.starting = 1;
        this.mediaDevices && this.mediaDevices.enumerateDevices().then(function (e) {
            return e.filter(function (h) {
                return "videoinput" ==
                    h.kind
            })
        }).then(function (e) {
            if (g.params.debug) return g.dispatch("error", JSON.stringify(e));
            g.allIds = e;
            // c ? g.deviceId = c : (g.deviceId = e[0].deviceId, 1 < e.length && "environment" == b && (g.globals.flip_horiz = !1, g.deviceId = e[0].deviceId));
            g.deviceId = c
            e = !1;
            "video" == g.params.capture && (e = g.params.audio);
            var h = "selfie" == g.params.mode ? {
                min_width: g.params.width,
                min_height: g.params.width * g.params.ratio,
                facingMode: b,
                frameRate: {
                    min: 15,
                    ideal: 30,
                    max: 30
                }
            } : {
                width: {
                    ideal: 2048
                },
                height: {
                    ideal: 1536
                },
                facingMode: b
            };
            "" == g.deviceId ||
                g.globals.isFirefox || (h.deviceId = {
                    exact: g.deviceId
                });
            g.mediaDevices.getUserMedia({
                audio: e,
                video: h
            }).then(function (k) {
                a.starting = 0;
                "srcObject" in a.video ? a.video.srcObject = k : a.video.src = d.URL.createObjectURL(k);
                a.setMediaDeviceType();
                a.stream = k;
                a.loaded = !0;
                a.live = !0;
                a.dispatch("load");
                a.dispatch("live");
                a.globals.frameRate = k.getVideoTracks()[0].getSettings().frameRate;
                setTimeout(function () {
                    a.video && 640 < a.video.videoWidth && (a.params.jpegQuality = 95);
                    "document" == a.params.mode && (a.captureDisabledbtn.style.display =
                        "none", a.capturebtn.style.display = "")
                }, 1E3);
                a.flip();
                "selfie" == a.params.mode ? (a.startLivenessDataCollection(), a.globals.faceDetectionDelay = setTimeout(function () {
                    a.detectFace()
                }, 800)) : "document" == a.params.mode && a.globals.iOS && (k = a.container.style, k.webkitTransform = "scaleX(1)", k.mozTransform = "scaleX(1)", k.msTransform = "scaleX(1)", k.oTransform = "scaleX(1)", k.transform = "scaleX(1)", k.filter = "", k.msFilter = "");
                document.getElementById("hv-cameraLoadingText").outerHTML = ""
            })["catch"](function (k) {
                this.starting =
                    0;
                a.params.enable_flash && a.detectFlash() ? setTimeout(function () {
                    a.params.force_flash = 1;
                    a.attach(cameraholder)
                }, 1) : (a.params.trackRudderAnalyticsEvent("CameraPermissionsRejected", {}), document.body.removeChild(document.getElementsByClassName("hv-modal")[0]), a.dispatch("error", "HypervergeSDK.js Error: 010 Please allow camera permissions to continue"))
            })
        })
    };
    f.prototype.resizePopup = function () {
        if (document.getElementsByClassName("hv-modal-content")[0] && document.getElementsByClassName("hv-title")[0] && document.getElementsByClassName("hv-instructions")[0] &&
            document.getElementsByClassName("hv-modal-content")[0]) {
            var c = document.getElementsByClassName("hv-modal-content")[0].offsetHeight - document.getElementsByClassName("hv-title")[0].offsetHeight - document.getElementsByClassName("hv-instructions")[0].offsetHeight,
                g = document.getElementsByClassName("hv-modal-content")[0].offsetWidth;
            g < this.params.width && (this.params.width = .85 * g, this.video.style.height = this.params.width * this.params.ratio, this.video.style.width = this.params.width, "selfie" == this.params.mode &&
                (this.videomask.style.borderRadius = Math.floor(this.params.width / 2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width));
            this.params.width * this.params.ratio * 1.6 > c && (this.params.width = c / (1.4 * this.params.ratio), this.video.style.height = this.params.width * this.params.ratio, this.video.style.width = this.params.width, "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width / 2) + "px", this.videomask.style.height = this.video.style.height,
                this.videomask.style.width = this.video.style.width), document.body.appendChild(this.popup))
        }
    };
    f.prototype.switchCamera = function () {
        var c = this;
        if (this.allIds)
            if ("" != this.allIds[0].label) {
                var g = this.allIds.length;
                if (this.userMedia) try {
                    this.stream.getTracks().forEach(function (a) {
                        a.stop()
                    }), this.video.pause(), this.video.src = "", this.video.srcObject = ""
                } catch (a) { }
                var b = 0;
                this.allIds.forEach(function (a, e) {
                    c.deviceId == a.deviceId && (b = e + 1 >= g ? 0 : e + 1, "" != c.allIds[b].label && -1 === c.allIds[b].label.toLowerCase().indexOf("back") ?
                        (c.globals.flip_horiz = !0, c.cameraholder.style.transform = "scaleX(-1)") : (c.globals.flip_horiz = !1, c.cameraholder.style.transform = ""), 0 == c.starting && c.getStream(c.allIds[b].deviceId))
                })
            } else navigator.mediaDevices.enumerateDevices().then(function (a) {
                return a.filter(function (e) {
                    return "videoinput" == e.kind
                })
            }).then(function (a) {
                c.allIds = a;
                c.switchCamera()
            });
        else return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
            source: "sdk",
            errorCode: "011",
            errorMessage: "Failed to get DeviceIDS"
        }), this.dispatch("error",
            "HypervergeSDK.js Error: 011 Failed to get DeviceIDS")
    };
    f.prototype.startRecording = function () {
        var c = this,
            g = {
                mimeType: "video/webm"
            },
            b = this.stream;
        this.recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(b, g)
        } catch (a) {
            try {
                g = {
                    mimeType: "video/webm,codecs=vp9"
                }, mediaRecorder = new MediaRecorder(b, g)
            } catch (e) {
                try {
                    mediaRecorder = new MediaRecorder(b, "video/vp8")
                } catch (h) {
                    try {
                        mediaRecorder = new MediaRecorder(b, "video/webm,codecs=h264")
                    } catch (k) {
                        return this.params.trackRudderAnalyticsEvent("SDKErrorReturned", {
                            source: "sdk",
                            errorCode: "012",
                            errorMessage: "Exception while creating MediaRecorder:"
                        }), this.dispatch("error", "HypervergeSDK.js Error: 012 Exception while creating MediaRecorder:")
                    }
                }
            }
        }
        mediaRecorder.onstop = function (a) {
            c.freeze();
            clearInterval(c.timerFunc);
            c.videotimer.innerHTML = "";
            c.videorecimg.src = c.globals.recordImg;
            c.videorecordbtn.addEventListener("click", c.stopRecordingFunc, !1)
        };
        mediaRecorder.ondataavailable = function (a) {
            a.data && 0 < a.data.size && c.recordedBlobs.push(a.data)
        };
        mediaRecorder.start(100);
        this.mediaRecorder = mediaRecorder;
        setTimeout(function () {
            c.stopRecording()
        }, this.params.videoLength);
        this.timeleft = this.params.videoLength;
        this.videotimer.innerHTML = this.timeleft / 1E3;
        this.videorecimg.src = this.globals.blankImg;
        this.videorecordbtn.removeEventListener("click", this.stopRecordingFunc, !1);
        this.timerFunc = setInterval(function () {
            c.timeleft -= 1E3;
            c.videotimer.innerHTML = c.timeleft / 1E3
        }, 1E3)
    };
    f.prototype.stopRecording = function () {
        this.mediaRecorder.stop()
    };
    f.prototype.getObjectFitSize = function (c,
        g, b, a, e) {
        var h = a / e,
            k = g / b;
        (c ? h > k : h < k) ? (c = g, k = c / h, a = e / k) : (k = b, c = k * h, a /= c);
        return {
            width: c,
            height: k,
            x: (c - g) * a / 2,
            y: (k - b) * a / 2,
            ratio: a
        }
    };
    f.prototype.unpack_cascade = function (c) {
        var g = new DataView(new ArrayBuffer(4)),
            b = 8;
        g.setUint8(0, c[b + 0]);
        g.setUint8(1, c[b + 1]);
        g.setUint8(2, c[b + 2]);
        g.setUint8(3, c[b + 3]);
        var a = g.getInt32(0, !0);
        b += 4;
        g.setUint8(0, c[b + 0]);
        g.setUint8(1, c[b + 1]);
        g.setUint8(2, c[b + 2]);
        g.setUint8(3, c[b + 3]);
        var e = g.getInt32(0, !0);
        b += 4;
        for (var h = [], k = [], l = [], n = 0; n < e; ++n) {
            Array.prototype.push.apply(h,
                [0, 0, 0, 0]);
            Array.prototype.push.apply(h, c.slice(b, b + 4 * Math.pow(2, a) - 4));
            b = b + 4 * Math.pow(2, a) - 4;
            for (var m = 0; m < Math.pow(2, a); ++m) g.setUint8(0, c[b + 0]), g.setUint8(1, c[b + 1]), g.setUint8(2, c[b + 2]), g.setUint8(3, c[b + 3]), k.push(g.getFloat32(0, !0)), b += 4;
            g.setUint8(0, c[b + 0]);
            g.setUint8(1, c[b + 1]);
            g.setUint8(2, c[b + 2]);
            g.setUint8(3, c[b + 3]);
            l.push(g.getFloat32(0, !0));
            b += 4
        }
        var p = new Int8Array(h),
            q = new Float32Array(k),
            r = new Float32Array(l);
        return function (u, t, w, y, x) {
            u *= 256;
            t *= 256;
            for (var v = 0, z = 0, A = Math.pow(2, a) >> 0,
                D = 0; D < e; ++D) {
                idx = 1;
                for (var E = 0; E < a; ++E) idx = 2 * idx + (y[(u + p[v + 4 * idx + 0] * w >> 8) * x + (t + p[v + 4 * idx + 1] * w >> 8)] <= y[(u + p[v + 4 * idx + 2] * w >> 8) * x + (t + p[v + 4 * idx + 3] * w >> 8)]);
                z += q[A * D + idx - A];
                if (z <= r[D]) return -1;
                v += 4 * A
            }
            return z - r[e - 1]
        }
    };
    f.prototype.run_cascade = function (c, g, b) {
        var a = c.pixels,
            e = c.nrows,
            h = c.ncols;
        c = c.ldim;
        var k = b.shiftfactor,
            l = b.maxsize,
            n = b.scalefactor;
        b = b.minsize;
        for (var m = []; b <= l;) {
            for (var p = Math.max(k * b, 1) >> 0, q = b / 2 + 1 >> 0, r = q; r <= e - q; r += p)
                for (var u = q; u <= h - q; u += p) {
                    var t = g(r, u, b, a, c);
                    0 < t && m.push([r, u, b, t])
                }
            b *=
                n
        }
        return m
    };
    f.prototype.cluster_detections = function (c, g) {
        function b(r, u) {
            var t = r[0],
                w = r[1],
                y = r[2],
                x = u[0],
                v = u[1],
                z = u[2];
            t = Math.max(0, Math.min(t + y / 2, x + z / 2) - Math.max(t - y / 2, x - z / 2));
            w = Math.max(0, Math.min(w + y / 2, v + z / 2) - Math.max(w - y / 2, v - z / 2));
            return t * w / (y * y + z * z - t * w)
        }
        c = c.sort(function (r, u) {
            return u[3] - r[3]
        });
        for (var a = Array(c.length).fill(0), e = [], h = 0; h < c.length; ++h)
            if (0 == a[h]) {
                for (var k = 0, l = 0, n = 0, m = 0, p = 0, q = h; q < c.length; ++q) b(c[h], c[q]) > g && (a[q] = 1, k += c[q][0], l += c[q][1], n += c[q][2], m += c[q][3], p += 1);
                e.push([k /
                    p, l / p, n / p, m
                ])
            } return e
    };
    f.prototype.instantiate_detection_memory = function (c) {
        for (var g = 0, b = [], a = 0; a < c; ++a) b.push([]);
        return function (e) {
            b[g] = e;
            g = (g + 1) % b.length;
            e = [];
            for (i = 0; i < b.length; ++i) e = e.concat(b[i]);
            return e
        }
    };
    f.prototype.detectFace = function () {
        self = this;
        var c = this.instantiate_detection_memory(15),
            g = function (b, a, e, h, k) {
                return -1
            };
        fetch("https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/facefinder").then(function (b) {
            b.arrayBuffer().then(function (a) {
                a = new Int8Array(a);
                g = self.unpack_cascade(a);
                var e = self.video;
                a = document.createElement("canvas");
                a.width = parseInt(e.style.width);
                a.height = parseInt(e.style.height);
                var h = a.getContext("2d");
                self.detectinterval = setInterval(function () {
                    if (self.video) {
                        e = self.video;
                        var k = parseInt(e.style.width),
                            l = parseInt(e.style.height),
                            n = self.getObjectFitSize(!1, k, l, parseInt(e.videoWidth), parseInt(e.videoHeight));
                        h.drawImage(e, n.x, n.y, k * n.ratio, l * n.ratio, 0, 0, k, l);
                        n = h.getImageData(0, 0, k, l).data;
                        for (var m = new Uint8Array(l * k), p = 0; p < l; ++p)
                            for (var q = 0; q < k; ++q) m[p * k + q] =
                                (2 * n[4 * p * k + 4 * q] + 7 * n[4 * p * k + 4 * q + 1] + 1 * n[4 * p * k + 4 * q + 2]) / 10;
                        image = {
                            pixels: m,
                            nrows: l,
                            ncols: k,
                            ldim: k
                        };
                        params = {
                            shiftfactor: .1,
                            minsize: Math.round(.35 * k),
                            maxsize: Math.round(.6 * k),
                            scalefactor: 1.1
                        };
                        self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceNotDetectedDescription);
                        dets = self.run_cascade(image, g, params);
                        dets = c(dets);
                        dets = self.cluster_detections(dets, .2);
                        0 === self.globals.frameDiffs.length && dets[0] ? (self.globals.frameDiffs.push(0), self.globals.lastFrame =
                            dets[0]) : dets[0] && (xDistSqr = Math.pow(dets[0][0] - self.globals.lastFrame[0], 2), yDistSqr = Math.pow(dets[0][1] - self.globals.lastFrame[1], 2), zDistSqr = Math.pow(dets[0][2] - self.globals.lastFrame[2], 2), distance = Math.sqrt(xDistSqr + yDistSqr + zDistSqr), self.globals.frameDiffs.push(Math.floor(distance)), self.globals.lastFrame = dets[0]);
                        l = [];
                        for (i = 0; i < dets.length; ++i)
                            if (!(5 > dets[i][3]))
                                if (dets[i][2] < Math.round(.45 * k)) self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceTooSmallDescription);
                                else if (dets[i][2] > Math.round(.5 * k)) self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceTooBigDescription);
                                else if (0 === l.length) l.push(dets[i][1]);
                                else if (n = dets[i][1], !(.2 >= parseFloat(Math.abs(1 - l[l.length - 1] / n).toFixed(2)))) {
                                    l.push(n);
                                    break
                                }
                        1 == l.length ? self.consecutiveDetections >= self.globals.detectionThreshold ? (self.videomask.setAttribute("class", "hv-liveness-face-found"), "video" === self.params.capture ? self.videorecordbtn.style.display = "" : (self.capturebtn.style.display =
                            "", self.captureDisabledbtn.style.display = "none"), self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceDetectedDescription)) : self.consecutiveDetections++ : 0 == self.consecutiveDetections ? (self.videomask.setAttribute("class", "hv-liveness-face-not-found"), "video" === self.params.capture ? self.videorecordbtn.style.display = "none" : (self.capturebtn.style.display = "none", self.captureDisabledbtn.style.display = "")) : self.consecutiveDetections--;
                        self.preview_active &&
                            ("video" === self.params.capture ? self.videorecordbtn.style.display = "none" : (self.capturebtn.style.display = "none", self.captureDisabledbtn.style.display = "none"))
                    }
                }, 16)
            })
        })
    };
    f.prototype.setMediaDeviceType = function () {
        var c = this,
            g, b, a;
        return $jscomp.asyncExecutePromiseGeneratorProgram(function (e) {
            if (1 == e.nextAddress) return g = "ok", b = "real", a = "virtual obs manycam neuralcam webcamoid webcammax webcamstudio debut vcam youcam passfab movavi goplay".split(" "), e.yield(navigator.mediaDevices.enumerateDevices().then(function (h) {
                h.forEach(function (k) {
                    "videoinput" ===
                        k.kind && a.some(function (l) {
                            return k.label.toLowerCase().includes(l) && "videoinput" === k.kind
                        }) && (b = "virtual", g = k.label)
                })
            }), 2);
            c.globals.mediaDeviceType = b;
            c.globals.cameraLabel = g;
            e.jumpToEnd()
        })
    };
    "function" === typeof define && define.amd ? define(function () {
        return f
    }) : "object" === typeof module && module.exports ? module.exports = f : d.Hyperverge = f
})(window);
var hyperSnapSDKInit = function (d) {
    var f = this;
    this.hyperverge = new Hyperverge(d.params);
    this.hyperverge.makepopup();
    window.onresize = function () {
        f.hyperverge.resizePopup()
    };
    return this.hyperverge
};