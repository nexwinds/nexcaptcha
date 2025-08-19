(function() {
"use strict";
"use strict";
var NexCaptcha = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/react/cjs/react.production.js
  var require_react_production = __commonJS({
    "node_modules/react/cjs/react.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      var ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function() {
        },
        enqueueReplaceState: function() {
        },
        enqueueSetState: function() {
        }
      };
      var assign = Object.assign;
      var emptyObject = {};
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      function ComponentDummy() {
      }
      ComponentDummy.prototype = Component.prototype;
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent;
      assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;
      var isArrayImpl = Array.isArray;
      var ReactSharedInternals = { H: null, A: null, T: null, S: null, V: null };
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function ReactElement(type, key, self, source, owner, props) {
        self = props.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== self ? self : null,
          props
        };
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        return ReactElement(
          oldElement.type,
          newKey,
          void 0,
          void 0,
          void 0,
          oldElement.props
        );
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      var userProvidedKeyEscapeRegex = /\/+/g;
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
      }
      function noop$1() {
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback)
          return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + invokeCallback
          )), array.push(callback)), 1;
        invokeCallback = 0;
        var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ctor = payload._result;
          ctor = ctor();
          ctor.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 1, payload._result = moduleObject;
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 2, payload._result = error;
            }
          );
          -1 === payload._status && (payload._status = 0, payload._result = ctor);
        }
        if (1 === payload._status) return payload._result.default;
        throw payload._result;
      }
      var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      };
      function noop() {
      }
      exports.Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(size) {
          return ReactSharedInternals.H.useMemoCache(size);
        }
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = void 0;
        if (null != config)
          for (propName in void 0 !== config.ref && (owner = void 0), void 0 !== config.key && (key = "" + config.key), config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          for (var childArray = Array(propName), i = 0; i < propName; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        return ReactElement(element.type, key, void 0, void 0, owner, props);
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        var propName, props = {}, key = null;
        if (null != config)
          for (propName in void 0 !== config.key && (key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) props.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
            childArray[i] = arguments[i + 2];
          props.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === props[propName] && (props[propName] = childrenLength[propName]);
        return ReactElement(type, key, void 0, void 0, null, props);
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(render) {
        return { $$typeof: REACT_FORWARD_REF_TYPE, render };
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      };
      exports.memo = function(type, compare) {
        return {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return ReactSharedInternals.H.useCacheRefresh();
      };
      exports.use = function(usable) {
        return ReactSharedInternals.H.use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return ReactSharedInternals.H.useActionState(action, initialState, permalink);
      };
      exports.useCallback = function(callback, deps) {
        return ReactSharedInternals.H.useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        return ReactSharedInternals.H.useContext(Context);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(value, initialValue) {
        return ReactSharedInternals.H.useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, createDeps, update) {
        var dispatcher = ReactSharedInternals.H;
        if ("function" === typeof update)
          throw Error(
            "useEffect CRUD overload is not enabled in this build of React."
          );
        return dispatcher.useEffect(create, createDeps);
      };
      exports.useId = function() {
        return ReactSharedInternals.H.useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        return ReactSharedInternals.H.useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        return ReactSharedInternals.H.useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return ReactSharedInternals.H.useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return ReactSharedInternals.H.useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return ReactSharedInternals.H.useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return ReactSharedInternals.H.useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return ReactSharedInternals.H.useTransition();
      };
      exports.version = "19.1.1";
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.production.js
  var require_react_jsx_runtime_production = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
      "use strict";
      var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      function jsxProd(type, config, maybeKey) {
        var key = null;
        void 0 !== maybeKey && (key = "" + maybeKey);
        void 0 !== config.key && (key = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        config = maybeKey.ref;
        return {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: void 0 !== config ? config : null,
          props: maybeKey
        };
      }
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = jsxProd;
      exports.jsxs = jsxProd;
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_jsx_runtime_production();
      } else {
        module.exports = null;
      }
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Captcha: () => Captcha,
    SimpleCaptcha: () => SimpleCaptcha,
    generateProofOfWork: () => generateProofOfWork,
    useCaptcha: () => useCaptcha,
    validateCaptcha: () => validateCaptcha,
    validateProofOfWork: () => validateProofOfWork
  });

  // src/components/Captcha.tsx
  var import_react2 = __toESM(require_react(), 1);

  // src/hooks/useCaptcha.ts
  var import_react = __toESM(require_react(), 1);

  // src/utils/invisibleFilters.ts
  var InvisibleFiltersTracker = class {
    startTime;
    mouseMovements = [];
    keystrokes = 0;
    keystrokeStartTime = 0;
    honeypotValue = "";
    constructor() {
      this.startTime = Date.now();
      this.keystrokeStartTime = Date.now();
    }
    /**
     * Track mouse movement
     */
    trackMouseMovement(x, y, type = "move") {
      this.mouseMovements.push({
        x,
        y,
        timestamp: Date.now(),
        type
      });
      if (this.mouseMovements.length > 100) {
        this.mouseMovements = this.mouseMovements.slice(-100);
      }
    }
    /**
     * Track keystroke for typing speed calculation
     */
    trackKeystroke() {
      this.keystrokes++;
    }
    /**
     * Set honeypot field value (should remain empty for humans)
     */
    setHoneypotValue(value) {
      this.honeypotValue = value;
    }
    /**
     * Get current typing speed in characters per minute
     */
    getTypingSpeed() {
      const timeElapsed = (Date.now() - this.keystrokeStartTime) / 1e3 / 60;
      return timeElapsed > 0 ? this.keystrokes / timeElapsed : 0;
    }
    /**
     * Get time elapsed since tracker initialization
     */
    getTimeElapsed() {
      return Date.now() - this.startTime;
    }
    /**
     * Validate invisible filters
     */
    validate() {
      const reasons = [];
      let isValid = true;
      if (this.honeypotValue.trim() !== "") {
        isValid = false;
        reasons.push("Honeypot field filled");
      }
      const timeElapsed = this.getTimeElapsed();
      if (timeElapsed < 3150) {
        isValid = false;
        reasons.push("Submission too fast");
      }
      if (this.mouseMovements.length < 3) {
        isValid = false;
        reasons.push("Insufficient mouse activity");
      }
      if (this.mouseMovements.length > 0) {
        const movements = this.mouseMovements.filter((m) => m.type === "move");
        if (movements.length > 5) {
          const linearMovements = this.detectLinearMovements(movements);
          if (linearMovements > movements.length * 0.8) {
            isValid = false;
            reasons.push("Suspicious movement patterns");
          }
        }
      }
      const typingSpeed = this.getTypingSpeed();
      if (typingSpeed > 300) {
        isValid = false;
        reasons.push("Typing speed too high");
      }
      return { isValid, reasons };
    }
    /**
     * Detect linear mouse movements (bot-like behavior)
     */
    detectLinearMovements(movements) {
      let linearCount = 0;
      for (let i = 2; i < movements.length; i++) {
        const prev2 = movements[i - 2];
        const prev1 = movements[i - 1];
        const current = movements[i];
        if (!prev2 || !prev1 || !current) continue;
        const dx1 = prev1.x - prev2.x;
        const dy1 = prev1.y - prev2.y;
        const dx2 = current.x - prev1.x;
        const dy2 = current.y - prev1.y;
        if (dx1 !== 0 && dx2 !== 0) {
          const slope1 = dy1 / dx1;
          const slope2 = dy2 / dx2;
          if (Math.abs(slope1 - slope2) < 0.1) {
            linearCount++;
          }
        } else if (dx1 === 0 && dx2 === 0) {
          linearCount++;
        } else if (dy1 === 0 && dy2 === 0) {
          linearCount++;
        }
      }
      return linearCount;
    }
    /**
     * Get current filter data
     */
    getFilterData() {
      return {
        honeypot: this.honeypotValue,
        mouseMovements: [...this.mouseMovements],
        typingSpeed: this.getTypingSpeed(),
        submissionTime: Date.now(),
        startTime: this.startTime
      };
    }
    /**
     * Reset all tracking data
     */
    reset() {
      this.startTime = Date.now();
      this.keystrokeStartTime = Date.now();
      this.mouseMovements = [];
      this.keystrokes = 0;
      this.honeypotValue = "";
    }
  };
  function createInvisibleFiltersTracker() {
    return new InvisibleFiltersTracker();
  }

  // src/utils/proofOfWork.ts
  function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
  function generateProofOfWork(difficulty = 4) {
    const timestamp = Date.now();
    const randomData = Math.random().toString(36).substring(2);
    const target = "0".repeat(difficulty);
    return {
      difficulty,
      target,
      // Include timestamp and random data to prevent pre-computation
      nonce: `${timestamp}-${randomData}`
    };
  }
  function solveProofOfWork(challenge) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let counter = 0;
      const solve = () => {
        const batchSize = 1e3;
        for (let i = 0; i < batchSize; i++) {
          const nonce = `${challenge.nonce}-${counter}`;
          const hash = simpleHash(nonce);
          if (hash.startsWith(challenge.target)) {
            resolve(nonce);
            return;
          }
          counter++;
          if (Date.now() - startTime > 1e4) {
            resolve(`timeout-${counter}`);
            return;
          }
        }
        setTimeout(solve, 0);
      };
      solve();
    });
  }
  function validateProofOfWork(challenge, nonce) {
    if (!nonce || nonce.startsWith("timeout-")) {
      return false;
    }
    const hash = simpleHash(nonce);
    return hash.startsWith(challenge.target);
  }
  function getDifficulty(level) {
    switch (level) {
      case "easy":
        return 3;
      case "medium":
        return 4;
      case "hard":
        return 5;
      default:
        return 4;
    }
  }

  // src/utils/challenges.ts
  var ANIMALS = ["\u{1F431}", "\u{1F436}", "\u{1F42D}", "\u{1F439}", "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F428}", "\u{1F42F}", "\u{1F981}", "\u{1F42E}", "\u{1F437}", "\u{1F438}", "\u{1F435}"];
  var FOOD = ["\u{1F34E}", "\u{1F34C}", "\u{1F34A}", "\u{1F34B}", "\u{1F349}", "\u{1F347}", "\u{1F353}", "\u{1F95D}", "\u{1F351}", "\u{1F96D}", "\u{1F34D}", "\u{1F965}", "\u{1F955}", "\u{1F33D}", "\u{1F952}"];
  var OBJECTS = ["\u26BD", "\u{1F3C0}", "\u{1F3C8}", "\u26BE", "\u{1F3BE}", "\u{1F3D0}", "\u{1F3D3}", "\u{1F3F8}", "\u{1F945}", "\u{1F3AF}", "\u{1F3B1}", "\u{1F3B3}", "\u{1F3AE}", "\u{1F3B2}", "\u{1F3AD}"];
  var NATURE = ["\u{1F338}", "\u{1F33A}", "\u{1F33B}", "\u{1F337}", "\u{1F339}", "\u{1F33C}", "\u{1F33F}", "\u{1F340}", "\u{1F331}", "\u{1F332}", "\u{1F333}", "\u{1F334}", "\u{1F335}", "\u{1F33E}", "\u{1F30A}"];
  var SOUND_TYPES = [
    { emoji: "\u{1F431}", sound: "cat", description: "meow", file: "assets/audio/farm-animals/cat.mp3" },
    { emoji: "\u{1F436}", sound: "dog", description: "bark", file: "assets/audio/farm-animals/dog.mp3" },
    { emoji: "\u{1F404}", sound: "cow", description: "moo", file: "assets/audio/farm-animals/cow.mp3" },
    { emoji: "\u{1F986}", sound: "duck", description: "quack", file: "assets/audio/farm-animals/duck.mp3" },
    { emoji: "\u{1F99C}", sound: "red-parrot", description: "chirp", file: "assets/audio/birds/red-parrot.mp3" },
    { emoji: "\u{1F981}", sound: "lion", description: "roar", file: "assets/audio/jungle-animals/lion.mp3" },
    { emoji: "\u{1F405}", sound: "tiger", description: "growl", file: "assets/audio/jungle-animals/tiger.mp3" }
  ];
  function generateDragDropChallenge() {
    const challenges = [
      { source: ANIMALS, target: FOOD, instruction: "Move the animal to the food" },
      { source: FOOD, target: ANIMALS, instruction: "Feed the animal" },
      { source: OBJECTS, target: NATURE, instruction: "Place the object in nature" },
      { source: NATURE, target: OBJECTS, instruction: "Combine nature with the object" }
    ];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const sourceEmoji = challenge.source[Math.floor(Math.random() * challenge.source.length)];
    const targetEmoji = challenge.target[Math.floor(Math.random() * challenge.target.length)];
    return {
      sourceEmoji,
      targetEmoji,
      instruction: challenge.instruction
    };
  }
  function generateAudioChallenge() {
    const targetSound = SOUND_TYPES[Math.floor(Math.random() * SOUND_TYPES.length)];
    const otherSounds = SOUND_TYPES.filter((s) => s.sound !== targetSound.sound);
    const shuffledOthers = otherSounds.sort(() => Math.random() - 0.5).slice(0, 2);
    const audioOptions = [targetSound, ...shuffledOthers].sort(() => Math.random() - 0.5).map((s) => s.sound);
    return {
      targetSound: targetSound.sound,
      audioOptions,
      instruction: `Click the ${targetSound.description} sound`
    };
  }
  function generateEmojiChallenge() {
    const allEmojis = [...ANIMALS, ...FOOD, ...OBJECTS, ...NATURE];
    const targetEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    const otherEmojis = allEmojis.filter((e) => e !== targetEmoji);
    const shuffledOthers = otherEmojis.sort(() => Math.random() - 0.5).slice(0, 7);
    const emojiOptions = [targetEmoji, ...shuffledOthers].sort(() => Math.random() - 0.5);
    return {
      targetEmoji,
      emojiOptions,
      instruction: `Click the ${targetEmoji} emoji`
    };
  }
  function generateRandomChallenge() {
    const types = ["drag-drop", "audio", "emoji-selection"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    switch (randomType) {
      case "drag-drop":
        return {
          type: "drag-drop",
          challenge: generateDragDropChallenge()
        };
      case "audio":
        return {
          type: "audio",
          challenge: generateAudioChallenge()
        };
      case "emoji-selection":
        return {
          type: "emoji-selection",
          challenge: generateEmojiChallenge()
        };
      default:
        return {
          type: "emoji-selection",
          challenge: generateEmojiChallenge()
        };
    }
  }
  function generateAudioDataUrl(soundType) {
    const soundTypeData = SOUND_TYPES.find((s) => s.sound === soundType);
    if (!soundTypeData) {
      console.warn(`Sound type '${soundType}' not found, falling back to cat sound`);
      return "assets/audio/farm-animals/cat.mp3";
    }
    return soundTypeData.file;
  }
  function validateChallengeAnswer(type, challenge, answer) {
    switch (type) {
      case "drag-drop": {
        const _dragChallenge = challenge;
        return answer === true;
      }
      case "audio": {
        const audioChallenge = challenge;
        return answer === audioChallenge.targetSound;
      }
      case "emoji-selection": {
        const emojiChallenge = challenge;
        return answer === emojiChallenge.targetEmoji;
      }
      default:
        return false;
    }
  }

  // src/utils/validation.ts
  function validateCaptcha(invisibleFilters, proofOfWorkChallenge, proofOfWorkNonce, challengeResult) {
    const timestamp = Date.now();
    const errors = [];
    const invisibleValidation = invisibleFilters.validate();
    if (!invisibleValidation.isValid) {
      errors.push(...invisibleValidation.reasons);
    }
    const proofOfWorkValid = validateProofOfWork(proofOfWorkChallenge, proofOfWorkNonce);
    if (!proofOfWorkValid) {
      errors.push("Proof of work validation failed");
    }
    if (!challengeResult) {
      errors.push("Interactive challenge failed");
    }
    const success = invisibleValidation.isValid && proofOfWorkValid && challengeResult;
    return {
      success,
      timestamp,
      proofOfWork: proofOfWorkNonce,
      challengeResult,
      invisibleFiltersResult: invisibleValidation.isValid,
      errors: errors.length > 0 ? errors : void 0
    };
  }

  // src/hooks/useCaptcha.ts
  function useCaptcha(options = {}) {
    const { difficulty = "medium", onValidate } = options;
    const [isLoading, setIsLoading] = (0, import_react.useState)(false);
    const [isVerifying, setIsVerifying] = (0, import_react.useState)(false);
    const [isCompleted, setIsCompleted] = (0, import_react.useState)(false);
    const [error, setError] = (0, import_react.useState)(null);
    const [challengeType, setChallengeType] = (0, import_react.useState)(null);
    const [challenge, setChallenge] = (0, import_react.useState)(null);
    const [result, setResult] = (0, import_react.useState)(null);
    const invisibleFiltersRef = (0, import_react.useRef)(createInvisibleFiltersTracker());
    const proofOfWorkChallengeRef = (0, import_react.useRef)(null);
    const proofOfWorkNonceRef = (0, import_react.useRef)(null);
    const startChallenge = (0, import_react.useCallback)(async () => {
      setIsLoading(true);
      setError(null);
      setIsCompleted(false);
      setResult(null);
      try {
        invisibleFiltersRef.current.reset();
        const powDifficulty = getDifficulty(difficulty);
        proofOfWorkChallengeRef.current = generateProofOfWork(powDifficulty);
        void solveProofOfWork(proofOfWorkChallengeRef.current).then((nonce) => {
          proofOfWorkNonceRef.current = nonce;
        });
        const { type, challenge: generatedChallenge } = generateRandomChallenge();
        setChallengeType(type);
        setChallenge(generatedChallenge);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to initialize CAPTCHA");
        setIsLoading(false);
      }
    }, [difficulty]);
    const submitAnswer = (0, import_react.useCallback)(async (answer) => {
      if (!challengeType || !challenge || !proofOfWorkChallengeRef.current) {
        setError("CAPTCHA not properly initialized");
        return;
      }
      setIsVerifying(true);
      setError(null);
      try {
        let attempts = 0;
        while (!proofOfWorkNonceRef.current && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        if (!proofOfWorkNonceRef.current) {
          throw new Error("Proof of work timeout");
        }
        const challengeResult = validateChallengeAnswer(challengeType, challenge, answer);
        const captchaResult = validateCaptcha(
          invisibleFiltersRef.current,
          proofOfWorkChallengeRef.current,
          proofOfWorkNonceRef.current,
          challengeResult
        );
        setResult(captchaResult);
        setIsCompleted(true);
        if (onValidate) {
          onValidate(captchaResult);
        }
        if (!captchaResult.success) {
          setError(captchaResult.errors?.join(", ") ?? "Validation failed");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Validation failed";
        setError(errorMessage);
      } finally {
        setIsVerifying(false);
      }
    }, [challengeType, challenge, onValidate]);
    const reset = (0, import_react.useCallback)(() => {
      setIsLoading(false);
      setIsVerifying(false);
      setIsCompleted(false);
      setError(null);
      setChallengeType(null);
      setChallenge(null);
      setResult(null);
      invisibleFiltersRef.current.reset();
      proofOfWorkChallengeRef.current = null;
      proofOfWorkNonceRef.current = null;
    }, []);
    const trackMouseMovement = (0, import_react.useCallback)((x, y, type = "move") => {
      invisibleFiltersRef.current.trackMouseMovement(x, y, type);
    }, []);
    const trackKeystroke = (0, import_react.useCallback)(() => {
      invisibleFiltersRef.current.trackKeystroke();
    }, []);
    const setHoneypotValue = (0, import_react.useCallback)((value) => {
      invisibleFiltersRef.current.setHoneypotValue(value);
    }, []);
    return {
      // State
      isLoading,
      isVerifying,
      isCompleted,
      error,
      // Challenge data
      challengeType,
      challenge,
      // Actions
      startChallenge,
      submitAnswer,
      reset,
      // Invisible filters
      trackMouseMovement,
      trackKeystroke,
      setHoneypotValue,
      // Result
      result
    };
  }

  // src/translations.ts
  var translations = {
    en: {
      title: "Are you a robot?",
      dragInstruction: "Drag the {source} to the {target}",
      audioInstruction: "Click the {target} sound among the audio tracks",
      emojiInstruction: "Click the {target} emoji",
      loading: "Loading...",
      verifying: "Verifying...",
      success: "Verification successful!",
      failed: "Verification failed. Please try again.",
      retry: "Try Again",
      playSound: "Play Sound",
      submitAnswer: "Submit Answer",
      attribution: "by nexwinds.com",
      clickToVerify: "Click to verify you're human",
      modalWelcomeTitle: "Welcome to nexcaptcha",
      modalWelcomeContent: "This verification system uses advanced security layers to protect against automated attacks while maintaining a smooth user experience.",
      modalInstructionsTitle: "How it works",
      modalInstructionsContent: "You'll complete a series of interactive challenges designed to verify human behavior. These may include drag-and-drop tasks, audio recognition, or visual puzzles.",
      modalAudioTitle: "Audio Integration",
      modalAudioContent: "Some challenges include audio components for accessibility and enhanced security.",
      modalReadyTitle: "Ready to start?",
      modalReadyContent: "Click the button below to begin your verification challenge. The process typically takes 10-30 seconds.",
      audioIntegrationTitle: "Audio Integration Steps:",
      audioStep1: "Audio files are dynamically generated based on challenge content",
      audioStep2: "Use the play button to hear the audio challenge",
      audioStep3: "Select or input your answer based on what you hear",
      audioStep4: "Audio challenges support multiple languages and accessibility features",
      playExample: "Play Example",
      next: "Next",
      startChallenge: "Start Challenge",
      regenerate: "New Challenge",
      close: "Close",
      verified: "Verified"
    },
    pt: {
      title: "Voc\xEA \xE9 um rob\xF4?",
      dragInstruction: "Arraste o {source} para o {target}",
      audioInstruction: "Clique no som {target} entre as faixas de \xE1udio",
      emojiInstruction: "Clique no emoji {target}",
      loading: "Carregando...",
      verifying: "Verificando...",
      success: "Verifica\xE7\xE3o bem-sucedida!",
      failed: "Verifica\xE7\xE3o falhou. Tente novamente.",
      retry: "Tentar Novamente",
      playSound: "Reproduzir Som",
      submitAnswer: "Enviar Resposta",
      attribution: "Por nexwinds.com",
      regenerate: "Novo Desafio",
      close: "Fechar",
      verified: "Verificado"
    },
    es: {
      title: "\xBFEres un robot?",
      dragInstruction: "Arrastra el {source} al {target}",
      audioInstruction: "Haz clic en el sonido {target} entre las pistas de audio",
      emojiInstruction: "Haz clic en el emoji {target}",
      loading: "Cargando...",
      verifying: "Verificando...",
      success: "\xA1Verificaci\xF3n exitosa!",
      failed: "Verificaci\xF3n fallida. Int\xE9ntalo de nuevo.",
      retry: "Intentar de Nuevo",
      playSound: "Reproducir Sonido",
      submitAnswer: "Enviar Respuesta",
      attribution: "Por nexwinds.com",
      regenerate: "Nuevo Desaf\xEDo",
      close: "Cerrar",
      verified: "Verificado"
    },
    fr: {
      title: "\xCAtes-vous un robot?",
      dragInstruction: "Faites glisser le {source} vers le {target}",
      audioInstruction: "Cliquez sur le son {target} parmi les pistes audio",
      emojiInstruction: "Cliquez sur l'emoji {target}",
      loading: "Chargement...",
      verifying: "V\xE9rification...",
      success: "V\xE9rification r\xE9ussie!",
      failed: "V\xE9rification \xE9chou\xE9e. Veuillez r\xE9essayer.",
      retry: "R\xE9essayer",
      playSound: "Jouer le Son",
      submitAnswer: "Soumettre la R\xE9ponse",
      attribution: "Par nexwinds.com",
      regenerate: "Nouveau D\xE9fi",
      close: "Fermer",
      verified: "V\xE9rifi\xE9"
    },
    de: {
      title: "Sind Sie ein Roboter?",
      dragInstruction: "Ziehen Sie das {source} zum {target}",
      audioInstruction: "Klicken Sie auf den {target}-Sound unter den Audiospuren",
      emojiInstruction: "Klicken Sie auf das {target}-Emoji",
      loading: "Laden...",
      verifying: "\xDCberpr\xFCfung...",
      success: "\xDCberpr\xFCfung erfolgreich!",
      failed: "\xDCberpr\xFCfung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      retry: "Erneut Versuchen",
      playSound: "Sound Abspielen",
      submitAnswer: "Antwort Senden",
      attribution: "Von nexwinds.com",
      regenerate: "Neue Herausforderung",
      close: "Schlie\xDFen",
      verified: "Verifiziert"
    }
  };
  var getTranslation = (lang, key) => {
    const langTranslations = translations[lang] ?? translations.en;
    return langTranslations[key] ?? translations.en[key];
  };
  var formatTranslation = (lang, key, params) => {
    let text = getTranslation(lang, key);
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
    return text;
  };

  // src/components/Captcha.tsx
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  var Captcha = ({
    lang = "en",
    onValidate,
    className = "",
    difficulty = "medium"
  }) => {
    const captchaRef = (0, import_react2.useRef)(null);
    const [_draggedItem, setDraggedItem] = (0, import_react2.useState)(null);
    const [selectedAudio, setSelectedAudio] = (0, import_react2.useState)(null);
    const [_selectedEmoji, setSelectedEmoji] = (0, import_react2.useState)(null);
    const [showModal, setShowModal] = (0, import_react2.useState)(false);
    const [modalStep, setModalStep] = (0, import_react2.useState)(0);
    const {
      isLoading,
      isVerifying,
      isCompleted,
      error,
      challengeType,
      challenge,
      startChallenge,
      submitAnswer,
      reset,
      trackMouseMovement,
      trackKeystroke,
      setHoneypotValue: _setHoneypotValue,
      result
    } = useCaptcha({
      difficulty,
      onValidate
    });
    (0, import_react2.useEffect)(() => {
      const handleMouseMove = (e) => {
        if (captchaRef.current) {
          const rect = captchaRef.current.getBoundingClientRect();
          trackMouseMovement(e.clientX - rect.left, e.clientY - rect.top, "move");
        }
      };
      const handleClick = (e) => {
        if (captchaRef.current) {
          const rect = captchaRef.current.getBoundingClientRect();
          trackMouseMovement(e.clientX - rect.left, e.clientY - rect.top, "click");
        }
      };
      const handleKeyDown = () => {
        trackKeystroke();
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [trackMouseMovement, trackKeystroke]);
    const handleDragStart = (e, emoji) => {
      setDraggedItem(emoji);
      e.dataTransfer.setData("text/plain", emoji);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleDrop = (e, targetEmoji) => {
      e.preventDefault();
      const draggedEmoji = e.dataTransfer.getData("text/plain");
      if (challenge && challengeType === "drag-drop") {
        const dragChallenge = challenge;
        const isCorrect = draggedEmoji === dragChallenge.sourceEmoji && targetEmoji === dragChallenge.targetEmoji;
        submitAnswer(isCorrect).catch(console.error);
      }
      setDraggedItem(null);
    };
    const playAudio = (soundType) => {
      const audioUrl = generateAudioDataUrl(soundType);
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    };
    const handleAudioSelect = (soundType) => {
      setSelectedAudio(soundType);
    };
    const handleAudioSubmit = () => {
      if (selectedAudio) {
        submitAnswer(selectedAudio).catch(console.error);
      }
    };
    const handleEmojiSelect = (emoji) => {
      setSelectedEmoji(emoji);
      submitAnswer(emoji).catch(console.error);
    };
    (0, import_react2.useEffect)(() => {
      setDraggedItem(null);
      setSelectedAudio(null);
      setSelectedEmoji(null);
    }, [challengeType, challenge]);
    const getModalStepContent = () => {
      const steps = [
        {
          title: getTranslation(lang, "modalWelcomeTitle"),
          content: getTranslation(lang, "modalWelcomeContent"),
          showNext: true
        },
        {
          title: getTranslation(lang, "modalInstructionsTitle"),
          content: getTranslation(lang, "modalInstructionsContent"),
          showNext: true
        },
        {
          title: getTranslation(lang, "modalAudioTitle"),
          content: getTranslation(lang, "modalAudioContent"),
          showNext: true
        },
        {
          title: getTranslation(lang, "modalReadyTitle"),
          content: getTranslation(lang, "modalReadyContent"),
          showNext: false,
          showStart: true
        }
      ];
      return steps[modalStep] ?? steps[0];
    };
    const handleModalNext = () => {
      if (modalStep < 3) {
        setModalStep(modalStep + 1);
      }
    };
    const handleModalStart = () => {
      setModalStep(0);
      void startChallenge();
    };
    const handleModalClose = () => {
      setShowModal(false);
      setModalStep(0);
    };
    const renderModal = () => {
      if (!showModal) return null;
      if (challenge || isCompleted && result) {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-modal-overlay", onClick: handleModalClose, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal nexcaptcha-challenge-modal", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal-header", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: getTranslation(lang, "title") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                className: "nexcaptcha-modal-close",
                onClick: handleModalClose,
                type: "button",
                children: "\xD7"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal-body", children: [
            isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-loading", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-spinner" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getTranslation(lang, "loading") })
            ] }),
            isVerifying && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-verifying", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-spinner" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getTranslation(lang, "verifying") })
            ] }),
            isCompleted && result && result.success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-success", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-checkmark", children: "\u2713" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getTranslation(lang, "success") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  className: "nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-lg",
                  onClick: () => {
                    setShowModal(false);
                  },
                  type: "button",
                  children: getTranslation(lang, "close")
                }
              )
            ] }),
            isCompleted && result && !result.success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-error", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-error-icon", children: "\u2717" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: error ?? getTranslation(lang, "failed") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-error-details", children: result.errors?.map((err, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-error-item", children: err }, index)) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  className: "nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-lg",
                  onClick: () => {
                    reset();
                    setModalStep(0);
                  },
                  type: "button",
                  children: getTranslation(lang, "retry")
                }
              )
            ] }),
            !isLoading && !isVerifying && !isCompleted && challenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-challenge", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-challenge-content", children: [
                challengeType === "drag-drop" && renderDragDropChallenge(),
                challengeType === "audio" && renderAudioChallenge(),
                challengeType === "emoji-selection" && renderEmojiChallenge()
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-challenge-actions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "button",
                {
                  className: "nexcaptcha-btn nexcaptcha-btn-secondary nexcaptcha-regenerate-btn",
                  onClick: handleRegenerate,
                  type: "button",
                  title: getTranslation(lang, "regenerate"),
                  children: [
                    "\u{1F504} ",
                    getTranslation(lang, "regenerate")
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-modal-footer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-attribution", children: getTranslation(lang, "attribution") }) })
        ] }) });
      }
      const stepContent = getModalStepContent();
      if (!stepContent) return null;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-modal-overlay", onClick: handleModalClose, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: stepContent.title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              className: "nexcaptcha-modal-close",
              onClick: handleModalClose,
              type: "button",
              children: "\xD7"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal-body", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-modal-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: stepContent.content }) }),
          modalStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-audio-instructions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: getTranslation(lang, "audioIntegrationTitle") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: getTranslation(lang, "audioStep1") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: getTranslation(lang, "audioStep2") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: getTranslation(lang, "audioStep3") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: getTranslation(lang, "audioStep4") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-audio-example", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                className: "nexcaptcha-btn nexcaptcha-btn-primary",
                onClick: () => playAudio("cat"),
                type: "button",
                children: [
                  "\u{1F50A} ",
                  getTranslation(lang, "playExample")
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal-footer", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-modal-progress", children: Array.from({ length: 4 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: `nexcaptcha-progress-dot ${i <= modalStep ? "active" : ""}`
            },
            i
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-modal-actions", children: [
            stepContent.showNext && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                className: "nexcaptcha-btn nexcaptcha-btn-primary",
                onClick: handleModalNext,
                type: "button",
                children: getTranslation(lang, "next")
              }
            ),
            stepContent.showStart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                className: "nexcaptcha-btn nexcaptcha-btn-primary",
                onClick: handleModalStart,
                type: "button",
                children: getTranslation(lang, "startChallenge")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-modal-branding", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "a",
          {
            href: "https://nexwinds.com",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "nexcaptcha-branding-link",
            children: "by nexwinds.com"
          }
        ) })
      ] }) });
    };
    const renderDragDropChallenge = () => {
      if (!challenge || challengeType !== "drag-drop") return null;
      const dragChallenge = challenge;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-drag-drop", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-instruction", children: formatTranslation(lang, "dragInstruction", {
          source: dragChallenge.sourceEmoji,
          target: dragChallenge.targetEmoji
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-drag-area", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-source-area", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "nexcaptcha-draggable",
              draggable: true,
              onDragStart: (e) => handleDragStart(e, dragChallenge.sourceEmoji),
              children: dragChallenge.sourceEmoji
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-arrow", children: "\u2192" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "nexcaptcha-drop-zone",
              onDragOver: handleDragOver,
              onDrop: (e) => handleDrop(e, dragChallenge.targetEmoji),
              children: dragChallenge.targetEmoji
            }
          )
        ] })
      ] });
    };
    const renderAudioChallenge = () => {
      if (!challenge || challengeType !== "audio") return null;
      const audioChallenge = challenge;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-audio", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-instruction", children: audioChallenge.instruction }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-audio-options", children: audioChallenge.audioOptions.map((soundType, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-audio-option", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "button",
            {
              className: "nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-sm",
              onClick: () => playAudio(soundType),
              type: "button",
              children: [
                "\u25B6 ",
                getTranslation(lang, "playSound")
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              className: `nexcaptcha-select-button ${selectedAudio === soundType ? "selected" : ""}`,
              onClick: () => handleAudioSelect(soundType),
              type: "button",
              children: selectedAudio === soundType ? "\u2713" : "\u25CB"
            }
          )
        ] }, index)) }),
        selectedAudio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            className: "nexcaptcha-btn nexcaptcha-btn-success nexcaptcha-btn-full",
            onClick: handleAudioSubmit,
            type: "button",
            children: getTranslation(lang, "submitAnswer")
          }
        )
      ] });
    };
    const renderEmojiChallenge = () => {
      if (!challenge || challengeType !== "emoji-selection") return null;
      const emojiChallenge = challenge;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-emoji", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-instruction", children: formatTranslation(lang, "emojiInstruction", {
          target: emojiChallenge.targetEmoji
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-emoji-grid", children: emojiChallenge.emojiOptions.map((emoji, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            className: "nexcaptcha-emoji-option",
            onClick: () => handleEmojiSelect(emoji),
            type: "button",
            children: emoji
          },
          index
        )) })
      ] });
    };
    const handleRegenerate = () => {
      reset();
      startChallenge();
    };
    const _renderContent = () => {
      if (isLoading) {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-loading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-spinner" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getTranslation(lang, "loading") })
        ] });
      }
      if (isVerifying) {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-verifying", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-spinner" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getTranslation(lang, "verifying") })
        ] });
      }
      if (isCompleted && result) {
        if (result.success) {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-success", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-checkmark", children: "\u2713" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getTranslation(lang, "success") })
          ] });
        } else {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-error", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-error-icon", children: "\u2717" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: error ?? getTranslation(lang, "failed") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                className: "nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-lg",
                onClick: () => {
                  reset();
                  startChallenge();
                },
                type: "button",
                children: getTranslation(lang, "retry")
              }
            )
          ] });
        }
      }
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-challenge", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-challenge-content", children: [
          renderDragDropChallenge(),
          renderAudioChallenge(),
          renderEmojiChallenge()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-challenge-actions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            className: "nexcaptcha-btn nexcaptcha-btn-secondary nexcaptcha-regenerate-btn",
            onClick: handleRegenerate,
            type: "button",
            title: getTranslation(lang, "regenerate"),
            children: [
              "\u{1F504} ",
              getTranslation(lang, "regenerate")
            ]
          }
        ) })
      ] });
    };
    if (!challenge && !isLoading && !isCompleted) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `nexcaptcha ${className}`, ref: captchaRef, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "nexcaptcha-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              className: "nexcaptcha-circular-trigger",
              onClick: () => setShowModal(true),
              type: "button",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-checkmark-icon", children: "\u2713" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nexcaptcha-start-text", children: getTranslation(lang, "clickToVerify") })
        ] }),
        renderModal()
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `nexcaptcha ${className}`, ref: captchaRef, children: [
      _renderContent(),
      renderModal()
    ] });
  };

  // src/components/SimpleCaptcha.tsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
  var SimpleCaptcha = ({
    onSuccess,
    onError,
    className
  }) => {
    const handleValidate = (result) => {
      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.errors?.[0] ?? "Verification failed");
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Captcha,
      {
        className,
        onValidate: handleValidate,
        difficulty: "medium",
        lang: "en"
      }
    );
  };
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
window.NexCaptcha = NexCaptcha;
})();
//# sourceMappingURL=index.standalone.js.map