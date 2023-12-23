window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  2: [ function(require, module, exports) {
    (function webpackUniversalModuleDefinition(root, factory) {
      "object" === typeof exports && "object" === typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define("StateMachine", [], factory) : "object" === typeof exports ? exports["StateMachine"] = factory() : root["StateMachine"] = factory();
    })(this, function() {
      return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
          if (installedModules[moduleId]) return installedModules[moduleId].exports;
          var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
          };
          modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
          module.l = true;
          return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.i = function(value) {
          return value;
        };
        __webpack_require__.d = function(exports, name, getter) {
          __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            configurable: false,
            enumerable: true,
            get: getter
          });
        };
        __webpack_require__.n = function(module) {
          var getter = module && module.__esModule ? function getDefault() {
            return module["default"];
          } : function getModuleExports() {
            return module;
          };
          __webpack_require__.d(getter, "a", getter);
          return getter;
        };
        __webpack_require__.o = function(object, property) {
          return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 5);
      }([ function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = function(target, sources) {
          var n, source, key;
          for (n = 1; n < arguments.length; n++) {
            source = arguments[n];
            for (key in source) source.hasOwnProperty(key) && (target[key] = source[key]);
          }
          return target;
        };
      }, function(module, exports, __webpack_require__) {
        "use strict";
        var mixin = __webpack_require__(0);
        module.exports = {
          build: function(target, config) {
            var n, max, plugin, plugins = config.plugins;
            for (n = 0, max = plugins.length; n < max; n++) {
              plugin = plugins[n];
              plugin.methods && mixin(target, plugin.methods);
              plugin.properties && Object.defineProperties(target, plugin.properties);
            }
          },
          hook: function(fsm, name, additional) {
            var n, max, method, plugin, plugins = fsm.config.plugins, args = [ fsm.context ];
            additional && (args = args.concat(additional));
            for (n = 0, max = plugins.length; n < max; n++) {
              plugin = plugins[n];
              method = plugins[n][name];
              method && method.apply(plugin, args);
            }
          }
        };
      }, function(module, exports, __webpack_require__) {
        "use strict";
        function camelize(label) {
          if (0 === label.length) return label;
          var n, result, word, words = label.split(/[_-]/);
          if (1 === words.length && words[0][0].toLowerCase() === words[0][0]) return label;
          result = words[0].toLowerCase();
          for (n = 1; n < words.length; n++) result = result + words[n].charAt(0).toUpperCase() + words[n].substring(1).toLowerCase();
          return result;
        }
        camelize.prepended = function(prepend, label) {
          label = camelize(label);
          return prepend + label[0].toUpperCase() + label.substring(1);
        };
        module.exports = camelize;
      }, function(module, exports, __webpack_require__) {
        "use strict";
        var mixin = __webpack_require__(0), camelize = __webpack_require__(2);
        function Config(options, StateMachine) {
          options = options || {};
          this.options = options;
          this.defaults = StateMachine.defaults;
          this.states = [];
          this.transitions = [];
          this.map = {};
          this.lifecycle = this.configureLifecycle();
          this.init = this.configureInitTransition(options.init);
          this.data = this.configureData(options.data);
          this.methods = this.configureMethods(options.methods);
          this.map[this.defaults.wildcard] = {};
          this.configureTransitions(options.transitions || []);
          this.plugins = this.configurePlugins(options.plugins, StateMachine.plugin);
        }
        mixin(Config.prototype, {
          addState: function(name) {
            if (!this.map[name]) {
              this.states.push(name);
              this.addStateLifecycleNames(name);
              this.map[name] = {};
            }
          },
          addStateLifecycleNames: function(name) {
            this.lifecycle.onEnter[name] = camelize.prepended("onEnter", name);
            this.lifecycle.onLeave[name] = camelize.prepended("onLeave", name);
            this.lifecycle.on[name] = camelize.prepended("on", name);
          },
          addTransition: function(name) {
            if (this.transitions.indexOf(name) < 0) {
              this.transitions.push(name);
              this.addTransitionLifecycleNames(name);
            }
          },
          addTransitionLifecycleNames: function(name) {
            this.lifecycle.onBefore[name] = camelize.prepended("onBefore", name);
            this.lifecycle.onAfter[name] = camelize.prepended("onAfter", name);
            this.lifecycle.on[name] = camelize.prepended("on", name);
          },
          mapTransition: function(transition) {
            var name = transition.name, from = transition.from, to = transition.to;
            this.addState(from);
            "function" !== typeof to && this.addState(to);
            this.addTransition(name);
            this.map[from][name] = transition;
            return transition;
          },
          configureLifecycle: function() {
            return {
              onBefore: {
                transition: "onBeforeTransition"
              },
              onAfter: {
                transition: "onAfterTransition"
              },
              onEnter: {
                state: "onEnterState"
              },
              onLeave: {
                state: "onLeaveState"
              },
              on: {
                transition: "onTransition"
              }
            };
          },
          configureInitTransition: function(init) {
            if ("string" === typeof init) return this.mapTransition(mixin({}, this.defaults.init, {
              to: init,
              active: true
            }));
            if ("object" === typeof init) return this.mapTransition(mixin({}, this.defaults.init, init, {
              active: true
            }));
            this.addState(this.defaults.init.from);
            return this.defaults.init;
          },
          configureData: function(data) {
            return "function" === typeof data ? data : "object" === typeof data ? function() {
              return data;
            } : function() {
              return {};
            };
          },
          configureMethods: function(methods) {
            return methods || {};
          },
          configurePlugins: function(plugins, builtin) {
            plugins = plugins || [];
            var n, max, plugin;
            for (n = 0, max = plugins.length; n < max; n++) {
              plugin = plugins[n];
              "function" === typeof plugin && (plugins[n] = plugin = plugin());
              plugin.configure && plugin.configure(this);
            }
            return plugins;
          },
          configureTransitions: function(transitions) {
            var i, n, transition, from, to, wildcard = this.defaults.wildcard;
            for (n = 0; n < transitions.length; n++) {
              transition = transitions[n];
              from = Array.isArray(transition.from) ? transition.from : [ transition.from || wildcard ];
              to = transition.to || wildcard;
              for (i = 0; i < from.length; i++) this.mapTransition({
                name: transition.name,
                from: from[i],
                to: to
              });
            }
          },
          transitionFor: function(state, transition) {
            var wildcard = this.defaults.wildcard;
            return this.map[state][transition] || this.map[wildcard][transition];
          },
          transitionsFor: function(state) {
            var wildcard = this.defaults.wildcard;
            return Object.keys(this.map[state]).concat(Object.keys(this.map[wildcard]));
          },
          allStates: function() {
            return this.states;
          },
          allTransitions: function() {
            return this.transitions;
          }
        });
        module.exports = Config;
      }, function(module, exports, __webpack_require__) {
        var mixin = __webpack_require__(0), Exception = __webpack_require__(6), plugin = __webpack_require__(1), UNOBSERVED = [ null, [] ];
        function JSM(context, config) {
          this.context = context;
          this.config = config;
          this.state = config.init.from;
          this.observers = [ context ];
        }
        mixin(JSM.prototype, {
          init: function(args) {
            mixin(this.context, this.config.data.apply(this.context, args));
            plugin.hook(this, "init");
            if (this.config.init.active) return this.fire(this.config.init.name, []);
          },
          is: function(state) {
            return Array.isArray(state) ? state.indexOf(this.state) >= 0 : this.state === state;
          },
          isPending: function() {
            return this.pending;
          },
          can: function(transition) {
            return !this.isPending() && !!this.seek(transition);
          },
          cannot: function(transition) {
            return !this.can(transition);
          },
          allStates: function() {
            return this.config.allStates();
          },
          allTransitions: function() {
            return this.config.allTransitions();
          },
          transitions: function() {
            return this.config.transitionsFor(this.state);
          },
          seek: function(transition, args) {
            var wildcard = this.config.defaults.wildcard, entry = this.config.transitionFor(this.state, transition), to = entry && entry.to;
            return "function" === typeof to ? to.apply(this.context, args) : to === wildcard ? this.state : to;
          },
          fire: function(transition, args) {
            return this.transit(transition, this.state, this.seek(transition, args), args);
          },
          transit: function(transition, from, to, args) {
            var lifecycle = this.config.lifecycle, changed = this.config.options.observeUnchangedState || from !== to;
            if (!to) return this.context.onInvalidTransition(transition, from, to);
            if (this.isPending()) return this.context.onPendingTransition(transition, from, to);
            this.config.addState(to);
            this.beginTransit();
            args.unshift({
              transition: transition,
              from: from,
              to: to,
              fsm: this.context
            });
            return this.observeEvents([ this.observersForEvent(lifecycle.onBefore.transition), this.observersForEvent(lifecycle.onBefore[transition]), changed ? this.observersForEvent(lifecycle.onLeave.state) : UNOBSERVED, changed ? this.observersForEvent(lifecycle.onLeave[from]) : UNOBSERVED, this.observersForEvent(lifecycle.on.transition), changed ? [ "doTransit", [ this ] ] : UNOBSERVED, changed ? this.observersForEvent(lifecycle.onEnter.state) : UNOBSERVED, changed ? this.observersForEvent(lifecycle.onEnter[to]) : UNOBSERVED, changed ? this.observersForEvent(lifecycle.on[to]) : UNOBSERVED, this.observersForEvent(lifecycle.onAfter.transition), this.observersForEvent(lifecycle.onAfter[transition]), this.observersForEvent(lifecycle.on[transition]) ], args);
          },
          beginTransit: function() {
            this.pending = true;
          },
          endTransit: function(result) {
            this.pending = false;
            return result;
          },
          failTransit: function(result) {
            this.pending = false;
            throw result;
          },
          doTransit: function(lifecycle) {
            this.state = lifecycle.to;
          },
          observe: function(args) {
            if (2 === args.length) {
              var observer = {};
              observer[args[0]] = args[1];
              this.observers.push(observer);
            } else this.observers.push(args[0]);
          },
          observersForEvent: function(event) {
            var n = 0, max = this.observers.length, observer, result = [];
            for (;n < max; n++) {
              observer = this.observers[n];
              observer[event] && result.push(observer);
            }
            return [ event, result, true ];
          },
          observeEvents: function(events, args, previousEvent, previousResult) {
            if (0 === events.length) return this.endTransit(void 0 === previousResult || previousResult);
            var event = events[0][0], observers = events[0][1], pluggable = events[0][2];
            args[0].event = event;
            event && pluggable && event !== previousEvent && plugin.hook(this, "lifecycle", args);
            if (0 === observers.length) {
              events.shift();
              return this.observeEvents(events, args, event, previousResult);
            }
            var observer = observers.shift(), result = observer[event].apply(observer, args);
            return result && "function" === typeof result.then ? result.then(this.observeEvents.bind(this, events, args, event)).catch(this.failTransit.bind(this)) : false === result ? this.endTransit(false) : this.observeEvents(events, args, event, result);
          },
          onInvalidTransition: function(transition, from, to) {
            throw new Exception("transition is invalid in current state", transition, from, to, this.state);
          },
          onPendingTransition: function(transition, from, to) {
            throw new Exception("transition is invalid while previous transition is still in progress", transition, from, to, this.state);
          }
        });
        module.exports = JSM;
      }, function(module, exports, __webpack_require__) {
        "use strict";
        var mixin = __webpack_require__(0), camelize = __webpack_require__(2), plugin = __webpack_require__(1), Config = __webpack_require__(3), JSM = __webpack_require__(4);
        var PublicMethods = {
          is: function(state) {
            return this._fsm.is(state);
          },
          can: function(transition) {
            return this._fsm.can(transition);
          },
          cannot: function(transition) {
            return this._fsm.cannot(transition);
          },
          observe: function() {
            return this._fsm.observe(arguments);
          },
          transitions: function() {
            return this._fsm.transitions();
          },
          allTransitions: function() {
            return this._fsm.allTransitions();
          },
          allStates: function() {
            return this._fsm.allStates();
          },
          onInvalidTransition: function(t, from, to) {
            return this._fsm.onInvalidTransition(t, from, to);
          },
          onPendingTransition: function(t, from, to) {
            return this._fsm.onPendingTransition(t, from, to);
          }
        };
        var PublicProperties = {
          state: {
            configurable: false,
            enumerable: true,
            get: function() {
              return this._fsm.state;
            },
            set: function(state) {
              throw Error("use transitions to change state");
            }
          }
        };
        function StateMachine(options) {
          return apply(this || {}, options);
        }
        function factory() {
          var cstor, options;
          if ("function" === typeof arguments[0]) {
            cstor = arguments[0];
            options = arguments[1] || {};
          } else {
            cstor = function() {
              this._fsm.apply(this, arguments);
            };
            options = arguments[0] || {};
          }
          var config = new Config(options, StateMachine);
          build(cstor.prototype, config);
          cstor.prototype._fsm.config = config;
          return cstor;
        }
        function apply(instance, options) {
          var config = new Config(options, StateMachine);
          build(instance, config);
          instance._fsm();
          return instance;
        }
        function build(target, config) {
          if ("object" !== typeof target || Array.isArray(target)) throw Error("StateMachine can only be applied to objects");
          plugin.build(target, config);
          Object.defineProperties(target, PublicProperties);
          mixin(target, PublicMethods);
          mixin(target, config.methods);
          config.allTransitions().forEach(function(transition) {
            target[camelize(transition)] = function() {
              return this._fsm.fire(transition, [].slice.call(arguments));
            };
          });
          target._fsm = function() {
            this._fsm = new JSM(this, config);
            this._fsm.init(arguments);
          };
        }
        StateMachine.version = "3.0.1";
        StateMachine.factory = factory;
        StateMachine.apply = apply;
        StateMachine.defaults = {
          wildcard: "*",
          init: {
            name: "init",
            from: "none"
          }
        };
        module.exports = StateMachine;
      }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = function(message, transition, from, to, current) {
          this.message = message;
          this.transition = transition;
          this.from = from;
          this.to = to;
          this.current = current;
        };
      } ]);
    });
  }, {} ],
  AnimationState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c8c0dbE11ZGWos16acETK+A", "AnimationState");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.myanimation = this.node.getComponent(cc.Animation);
        this.myanimation.on("finished", this.onAnimationFinished, this);
      },
      onAnimationFinished: function onAnimationFinished() {
        Emitter.instance.emit(EVENT_NAME.DESTROY_ANI_NODE);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  AutoLoadMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29b7c/XR3pMiL1Cbxb2X4Fg", "AutoLoadMap");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      setMap: function setMap(map) {
        this.map = map;
        this.rows = this.map.length;
        this.cols = this.map[0].length;
      },
      setShip: function setShip(data) {
        for (var i = 0; i < data.arrayPos.length; i++) {
          var tile = this.map[data.arrayPos[i].y][data.arrayPos[i].x];
          tile.getComponent("Tile").shipId = data.shipId;
        }
      },
      isInMap: function isInMap(position) {
        return position.y >= 0 && position.y < this.rows && position.x >= 0 && position.x < this.cols;
      },
      checkAvailable: function checkAvailable(arrayPos) {
        for (var i = 0; i < arrayPos.length; i++) {
          if (!this.isInMap(arrayPos[i])) return false;
          var tile = this.map[arrayPos[i].y][arrayPos[i].x];
          if (null !== tile.getComponent("Tile").shipId) return false;
        }
        return true;
      }
    });
    cc._RF.pop();
  }, {} ],
  AutoLoadShip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68262yE7rlDYq+4k/aYdhPM", "AutoLoadShip");
    "use strict";
    var Ship = require("Ship");
    var _require = require("rands"), randomPosition = _require.randomPosition;
    var Emitter = require("EventEmitter");
    var EventName = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        mapContainer: cc.Node,
        map: cc.Node,
        ships: [ Ship ]
      },
      onLoad: function onLoad() {
        var onRandomShips = this.onRandomShips.bind(this);
        Emitter.instance.registerOnce(EventName.RANDOM_SHIPS, onRandomShips);
      },
      onRandomShips: function onRandomShips() {
        var _this = this;
        this.ships.forEach(function(ship) {
          _this.onRandomShip(ship);
        });
      },
      onRandomShip: function onRandomShip(ship) {
        ship.node.parent = this.mapContainer;
        ship.isHorizontal = Math.random() < .5;
        while (true) {
          var pos = randomPosition(8, 8);
          ship.calculatePosition(pos.column, pos.row, false);
          var autoMap = this.map.getComponent("AutoLoadMap");
          var isAvailable = autoMap.checkAvailable(ship.positions);
          if (isAvailable) {
            autoMap.setShip({
              shipId: ship.shipId,
              arrayPos: ship.positions
            });
            ship.setShipToMap(this.map, pos);
            break;
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT",
    Ship: "Ship",
    rands: "rands"
  } ],
  Bom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1406cSnn/9J4ai6owU5xElI", "Bom");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        bomSprite: cc.SpriteFrame
      },
      onLoad: function onLoad() {
        Emitter.instance.registerOnce("attackToPosition", this.onAttack.bind(this));
      },
      start: function start() {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on("finished", this.onAnimationFinished, this);
      },
      onAnimationFinished: function onAnimationFinished(data) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.bomSprite;
      },
      onAttack: function onAttack(data) {
        var _this = this;
        cc.tween(this.node).delay(.94).parallel(cc.tween().to(2, {
          position: this.node.parent.convertToNodeSpaceAR(data.worldPosition)
        }), cc.tween().to(.75, {
          scale: 2
        }, {
          easing: "sineOut"
        }).then(cc.tween().to(1.25, {
          scale: .5
        }, {
          easing: "sineIn"
        })), cc.tween().to(2, {
          angle: 2520
        })).call(function() {
          _this.playAnimationtileTarget(data);
          _this.node.destroy();
        }).start();
      },
      playAnimationtileTarget: function playAnimationtileTarget(data) {
        Emitter.instance.emit(EVENT_NAME.PLAY_ANI, data);
      },
      onDestroy: function onDestroy() {}
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  ClockController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "190aaYlrFFMXZeRZWB/kGQ6", "ClockController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        coldDownTime: 11
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  ContainerShipController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b3ba5yB+ohNCYsV95DRSJOW", "ContainerShipController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EventName = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        startButton: cc.Button,
        allShip: [ cc.Node ]
      },
      onLoad: function onLoad() {
        this.loadAllShip();
      },
      start: function start() {
        this.startButton.interactable = false;
        Emitter.instance.registerEvent(EventName.CHECK_SHIP_IN_CONTAINER, this.checkShipInContainer.bind(this));
      },
      checkShipInContainer: function checkShipInContainer() {
        var availableCount = 0;
        for (var index = 0; index < this.allShip.length; index++) {
          cc.log(this.allShip[index].getComponent("dradropGameObject").isAvailable);
          this.allShip[index].getComponent("dradropGameObject").isAvailable && availableCount++;
        }
        this.startButton.interactable = 4 == availableCount;
      },
      loadAllShip: function loadAllShip() {
        var allChildren = this.node.getChildren();
        for (var index = 0; index < allChildren.length; index++) this.allShip.push(allChildren[index]);
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  EffectSpawner: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6eccbBLPLVHVIwdX8l/oAeD", "EffectSpawner");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        fireEffect: cc.Prefab
      },
      onLoad: function onLoad() {},
      start: function start() {
        this.node.zIndex = 10;
        Emitter.instance.registerEvent("spawnEffects", this.spawnEffect.bind(this));
      },
      spawnEffect: function spawnEffect(data) {
        var effect = cc.instantiate(this.fireEffect);
        effect.parent = this.node;
        effect.position = data.position;
        Emitter.instance.emit("addEffects", {
          shipId: data.shipId,
          effect: effect
        });
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  Emitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f7614fPTuhAM7fVukeQeDEN", "Emitter");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.mousePos = cc.v2(0, 0);
        this.node.on("mousedown", this.onMouseDown, this);
      },
      onDestroy: function onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
      },
      onMouseDown: function onMouseDown(event) {
        this.mousePos = event.getLocation();
        Emitter.instance.emit("takePosition", this.mousePos);
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  EnemyController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7acce/yl7JAVZd3Girhwtbu", "EnemyController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    var _require = require("rands"), randomPosition = _require.randomPosition, randomHitShip = _require.randomHitShip;
    cc.Class({
      extends: cc.Component,
      properties: {
        _isHitting: false,
        _hitShips: {
          default: {}
        },
        _saveHitPos: [],
        _maxRow: 8,
        _maxColumn: 8
      },
      onLoad: function onLoad() {
        this.enemyId = Math.floor(Math.random() * Date.now()).toString();
        var onChooseCoordinates = this.chooseCoordinates.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.CHOOSE_COORDINATES, onChooseCoordinates);
        var onCompleteHitShip = this.onCompleteHitShip.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.COMPLETE_HIT_SHIP, onCompleteHitShip);
        var onHitShip = this.onHitShip.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.HIT_SHIP, onHitShip);
        Emitter.instance.registerEvent(EVENT_NAME.RECEIVE_RESULT, this.responeResult.bind(this));
      },
      start: function start() {
        Emitter.instance.emit("setEnemyId", this.enemyId);
        Emitter.instance.emit(EVENT_NAME.RANDOM_SHIPS);
        Emitter.instance.emit("log-enemy-map");
      },
      chooseCoordinates: function chooseCoordinates() {
        var position = null;
        do {
          position = this._isHitting ? randomHitShip(this._hitShips, this._maxRow, this._maxColumn) : randomPosition(this._maxRow, this._maxColumn);
        } while (this.hasHitShip(position));
        this._saveHitPos.push(position);
        cc.log("enemy shoot", position);
        Emitter.instance.emit(EVENT_NAME.POSITION, {
          position: {
            x: position.column,
            y: position.row
          }
        });
      },
      hasHitShip: function hasHitShip(position) {
        return this._saveHitPos.some(function(value) {
          return value.row === position.row && value.column === position.column;
        });
      },
      onHitShip: function onHitShip(data) {
        var shipId = data.shipId, position = data.position;
        this._hitShips[shipId] ? this._hitShips[shipId].push(position) : this._hitShips[shipId] = [ position ];
        this._isHitting = true;
      },
      onCompleteHitShip: function onCompleteHitShip(shipId) {
        delete this._hitShips[shipId];
        0 === Object.keys(this._hitShips).length && (this._isHitting = false);
      },
      responeResult: function responeResult(data) {
        if (this.enemyId == data.playerId) if (null == data.shipId) {
          cc.log("hut");
          Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
            isHit: false,
            worldPosition: data.worldPosition
          });
        } else {
          var out = {};
          Emitter.instance.emit("updateLength", data.shipId, out);
          var length = out.length;
          if (0 == length) {
            cc.log("no");
            Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
              isHit: true,
              worldPosition: data.worldPosition,
              shipLength: length
            });
            Emitter.instance.emit("showShip", data.shipId);
          } else {
            cc.log("trung");
            Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
              isHit: true,
              worldPosition: data.worldPosition,
              shipLength: length
            });
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT",
    rands: "rands"
  } ],
  EnemyMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "56e98JPQ6ZNiqrHU2yZSp6F", "EnemyMap");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        rows: 8,
        cols: 8,
        tilePrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        var _this = this;
        this.map = new Array(this.rows).fill(null).map(function() {
          return new Array(_this.cols).fill(null);
        });
        this.enemyId = null;
        this.creatMap();
        Emitter.instance.registerEvent("checkTile", this.checkTile.bind(this));
        Emitter.instance.registerEvent("setEnemyId", function(enemyId) {
          return _this.enemyId = enemyId;
        });
        Emitter.instance.registerEvent("log-enemy-map", function() {
          return cc.log("random ship", _this.map.map(function(row) {
            return row.map(function(tile) {
              return tile.getComponent("Tile").shipId;
            });
          }));
        });
        var autoMap = this.getComponent("AutoLoadMap");
        autoMap && autoMap.setMap(this.map);
      },
      start: function start() {
        this.changeInteractState(true);
      },
      onTouchEnd: function onTouchEnd(event) {
        cc.log("co nhan");
        var touchPosGlobal = event.getLocation();
        var touchPosLocal = this.node.convertToNodeSpaceAR(touchPosGlobal);
        this.convertPosition(touchPosLocal);
      },
      onMouseEnter: function onMouseEnter(event) {
        this.clearHover();
        this.hoverAction(event);
      },
      onMouseMove: function onMouseMove(event) {
        this.hoverAction(event);
      },
      onMouseLeave: function onMouseLeave(event) {
        this.clearHover();
      },
      hoverAction: function hoverAction(event) {
        this.clearHover();
        var touchPosGlobal = event.getLocation();
        var touchPosLocal = this.node.convertToNodeSpaceAR(touchPosGlobal);
        var posX = touchPosLocal.x - 30;
        var posY = touchPosLocal.y + 30;
        var stepX = Math.round(posX / 55);
        var stepY = Math.round(posY / 55);
        if (-1 * stepY < 0 || -1 * stepY >= this.cols || stepX < 0 || stepX >= this.rows) return;
        var tile = this.map[-1 * stepY][stepX];
        tile.getComponent("Tile").setHover(true);
      },
      clearHover: function clearHover() {
        this.map.forEach(function(rows) {
          rows.forEach(function(element) {
            element.getComponent("Tile").setHover(false);
          });
        });
      },
      convertPosition: function convertPosition(pos) {
        var posX = pos.x - 30;
        var posY = pos.y + 30;
        var stepX = Math.round(posX / 55);
        var stepY = Math.round(posY / 55);
        if (-1 * stepY < 0 || -1 * stepY >= this.cols || stepX < 0 || stepX >= this.rows) return;
        var tile = this.map[-1 * stepY][stepX];
        if (tile.getComponent("Tile").isShooted) cc.log("\xf4 n\xe0y \u0111\xe3 b\u1ecb b\u1eafn"); else {
          cc.log("G\u1eedi cho player c\xf3 th\u1ec3 b\u1eafn");
          Emitter.instance.emit("sendCoordinates", {
            x: stepX,
            y: -stepY
          });
        }
      },
      test: function test() {
        this.node.active = !this.node.active;
      },
      getRandomIntegerInRange: function getRandomIntegerInRange(minValue, maxValue) {
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      },
      creatMap: function creatMap() {
        for (var i = 0; i < this.rows; i++) for (var j = 0; j < this.cols; j++) {
          var tile = cc.instantiate(this.tilePrefab);
          this.map[i][j] = tile;
          tile.parent = this.node;
        }
      },
      checkTile: function checkTile(data) {
        if (this.enemyId == data.playerId) {
          var node = this.map[data.position.y][data.position.x];
          var targetPosition = node.convertToNodeSpaceAR(cc.v2(0, 0));
          var shipId = node.getComponent("Tile").shipId;
          cc.log("enemy ship", shipId);
          Emitter.instance.emit("receiveresult", {
            playerId: this.enemyId,
            worldPosition: targetPosition.mul(-1),
            shipId: shipId
          });
          node.getComponent("Tile").isShooted = true;
          cc.tween(this.node).delay(3).call(function() {
            node.getComponent("Tile").changeState();
          }).start();
        }
      },
      changeInteractState: function changeInteractState(isInteract) {
        if (isInteract) {
          this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
          this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
          this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        } else {
          this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
          this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
          this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        }
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  EventController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a5e6v4yb9Hr5MMTg0lMgs9", "EventController");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        Emitter.instance = new Emitter();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  EventEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b75617FkbdJ/qiEsWbv+Fn4", "EventEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var Emitter = function() {
      function Emitter() {
        _classCallCheck(this, Emitter);
        this._emitter = new EventEmitter();
        this._emitter.setMaxListeners(100);
      }
      _createClass(Emitter, [ {
        key: "emit",
        value: function emit() {
          var _emitter;
          (_emitter = this._emitter).emit.apply(_emitter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener) {
          this._emitter.on(event, listener);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emitter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emitter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emitter.removeAllListeners();
          this._emitter = null;
          Emitter.instance = null;
        }
      } ]);
      return Emitter;
    }();
    Emitter.instance = null;
    module.exports = Emitter;
    cc._RF.pop();
  }, {
    events: 1
  } ],
  FindTileInMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05567AzhmZAAKNEj79+RLfw", "FindTileInMap");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        spritePrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        this.node.on("mousedown", this.onMouseDown, this);
      },
      onMouseDown: function onMouseDown(event) {
        if (event.getButton() !== cc.Event.EventMouse.BUTTON_LEFT) return;
        this.mousePosition = event.getLocation();
        var object = {
          playerId: 0,
          position: this.mousePosition
        };
        Emitter.instance.emit(EVENT_NAME.POSITION, object);
        event.stopPropagation();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  GameController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4d16jmiWZC66S4QCxEkEZc", "GameController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    var StateMachine = require("javascript-state-machine");
    cc.Class({
      extends: cc.Component,
      properties: {
        ballCannon: cc.Prefab,
        mapEnemy: cc.Node,
        mapPlayer: cc.Node,
        changeSceneNode: cc.Node,
        pirate: sp.Skeleton,
        clockPlayer: cc.Label,
        clockEnemy: cc.Label
      },
      onLoad: function onLoad() {
        var _this = this;
        cc.log(Emitter);
        this.playerId = 0;
        this.enemyId = 1;
        this.shipPlayerCounter = 4;
        this.shipEnemyCounter = 4;
        this.oldPosition = this.mapPlayer.position;
        this.scalePositionMiniMap = cc.v2(540, 200);
        Emitter.instance.registerOnce("setEnemyId", function(enemyId) {
          _this.enemyId = enemyId;
        });
        Emitter.instance.registerOnce(EVENT_NAME.START, this.setPlayerIdStartGame.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.CHANGE_SCENE, this.changeScene.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.SEND_RESULT, this.playAnimation.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.RESET_TURN, this.restTurn.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.SHIP_FAIL_CHECK, this.changeSceneShipFail.bind(this));
        this.fsm = new StateMachine({
          init: "init",
          transitions: [ {
            name: "changePlayerScene",
            from: [ "init", "enemyScene", "shipFailScene", "playerScene" ],
            to: "playerScene"
          }, {
            name: "changeEnemyScene",
            from: [ "init", "playerScene", "shipFailScene", "enemyScene" ],
            to: "enemyScene"
          }, {
            name: "changeEndScene",
            from: [ "playerScene", "enemyScene", "shipFailScene" ],
            to: "endScene"
          }, {
            name: "changeShipFailScene",
            from: [ "playerScene", "enemyScene" ],
            to: "shipFailScene"
          } ],
          methods: {
            onChangePlayerScene: this.onChangePlayerScene.bind(this),
            onChangeEnemyScene: this.onChangeEnemyScene.bind(this),
            onEnterPlayerScene: this.onEnterplayerScene.bind(this),
            onEnterEnemyScene: this.onEnterenemyScene.bind(this),
            onChangeShipFailScene: this.changeSceneShipFail.bind(this)
          }
        });
      },
      setPlayerIdStartGame: function setPlayerIdStartGame(data) {
        var _this2 = this;
        this.playerId = data;
        cc.log(this.playerId);
        this.pirate.node.active = false;
        this.mapPlayer.active = false;
        this.mapEnemy.active = false;
        Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY);
        Emitter.instance.registerOnce(EVENT_NAME.WAIT_FOR_ENEMY_DONE, function() {
          _this2.fsm.changePlayerScene();
        });
      },
      onEnterplayerScene: function onEnterplayerScene() {
        var _this3 = this;
        cc.log("hello");
        this.pirate.node.active = false;
        this.mapEnemy.active = false;
        this.mapPlayer.active = false;
        Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL);
        Emitter.instance.registerOnce(EVENT_NAME.YOUR_TURN_PANEL_DONE, function() {
          _this3.mapEnemy.active = true;
          _this3.mapPlayer.active = true;
          _this3.pirate.node.active = true;
          _this3.changeToMiniMap(_this3.mapPlayer);
          var childrenArray = _this3.mapPlayer.children;
          _this3.changeToRealMap(_this3.mapEnemy, false);
        });
      },
      onChangePlayerScene: function onChangePlayerScene() {
        var _this4 = this;
        cc.log("chuyen player");
        Emitter.instance.registerOnce(EVENT_NAME.POSITION, function(data) {
          data.playerId = _this4.enemyId;
          var spine = _this4.pirate.node.getComponent(sp.Skeleton);
          spine.clearTracks();
          spine.setAnimation(0, "Attack_2", false);
          spine.addAnimation(0, "Idle", true);
          Emitter.instance.emit("checkTile", data);
        });
      },
      onEnterenemyScene: function onEnterenemyScene() {
        var _this5 = this;
        this.pirate.node.active = false;
        this.mapEnemy.active = false;
        this.mapPlayer.active = false;
        Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL);
        Emitter.instance.registerOnce(EVENT_NAME.ENEMY_TURN_PANEL_DONE, function() {
          _this5.changeToMiniMap(_this5.mapEnemy);
          _this5.mapPlayer.active = true;
          _this5.mapEnemy.active = true;
          _this5.pirate.node.active = true;
          _this5.changeToRealMap(_this5.mapPlayer, true);
        });
      },
      onChangeEnemyScene: function onChangeEnemyScene() {
        var _this6 = this;
        cc.log("chuyen enemy");
        Emitter.instance.registerOnce(EVENT_NAME.POSITION, function(data) {
          data.playerId = _this6.playerId;
          Emitter.instance.emit(EVENT_NAME.CHECK_POSITION, data);
          cc.log("playerId EnemyScene", data.playerId);
        });
        cc.tween(this.node).call(function() {}).delay(3).call(function() {
          Emitter.instance.emit(EVENT_NAME.CHOOSE_COORDINATES);
          var spine = _this6.pirate.node.getComponent(sp.Skeleton);
          spine.clearTracks();
          spine.setAnimation(0, "Attack_2", false);
          spine.addAnimation(0, "Idle", true);
        }).start();
      },
      playAnimation: function playAnimation(data) {
        var currentScene = cc.director.getScene().children[0];
        var cannonBall = cc.instantiate(this.ballCannon);
        cannonBall.setParent(currentScene);
        cannonBall.position = cc.v2(3, -250);
        Emitter.instance.emit(EVENT_NAME.SOUND_CANON_SHOOT);
        Emitter.instance.emit("attackToPosition", data);
      },
      restTurn: function restTurn() {
        if ("playerScene" === this.fsm.state) {
          this.fsm.changePlayerScene();
          cc.log("reset");
        }
        "enemyScene" === this.fsm.state && this.fsm.changeEnemyScene();
      },
      changeScene: function changeScene(data) {
        cc.log("data trong change scene", data);
        var nowScene = this.fsm.state;
        if ("playerScene" === nowScene && true === data) {
          cc.log("\u0111\u1ed5i enemy");
          this.fsm.changeEnemyScene();
        } else if ("enemyScene" === nowScene && true === data) {
          cc.log("\u0111\u1ed5i player");
          this.fsm.changePlayerScene();
        }
      },
      changeSceneShipFail: function changeSceneShipFail() {
        if ("playerScene" === this.fsm.state) {
          this.shipEnemyCounter -= 1;
          0 === this.shipEnemyCounter ? this.onChangeEndScene(true) : this.fsm.changePlayerScene();
        } else if ("enemyScene" === this.fsm.state) {
          this.shipPlayerCounter -= 1;
          0 === this.shipPlayerCounter ? this.onChangeEndScene(false) : this.fsm.changeEnemyScene();
        }
      },
      onChangeEndScene: function onChangeEndScene(data) {
        var win = true;
        win === data ? Emitter.instance.emit(EVENT_NAME.WIN) : Emitter.instance.emit(EVENT_NAME.LOSE);
      },
      changeToMiniMap: function changeToMiniMap(map) {
        cc.log(map);
        map.scale = .4;
        map.position = this.scalePositionMiniMap;
        map.opacity = 200;
      },
      changeToRealMap: function changeToRealMap(map, isShowShip) {
        map.scale = 1;
        map.position = this.oldPosition;
        map.opacity = 255;
        if (true === isShowShip) {
          var childrenArray = this.mapPlayer.children;
          childrenArray.forEach(function(e) {
            "ship" === e.name && (e.active = true);
          });
        }
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT",
    "javascript-state-machine": 2
  } ],
  MainController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98e5cqmZ81PPIEflGIGtiX7", "MainController");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        Emitter.instance = new Emitter();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  Map: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b248ah+AQtI06v5J+NxHvCe", "Map");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        rows: 8,
        cols: 8,
        tilePrefab: cc.Prefab,
        selectedTiles: [ cc.Node ]
      },
      onLoad: function onLoad() {
        var _this = this;
        this.map = new Array(this.rows).fill(null).map(function() {
          return new Array(_this.cols).fill(null);
        });
        cc.log(this.map);
        this.isAvailable = true;
        this.playerId = null;
        this.creatMap();
      },
      start: function start() {
        Emitter.instance.registerEvent("selected", this.addSelectedTile.bind(this));
        Emitter.instance.registerEvent("setShipId", this.setShipId.bind(this));
        Emitter.instance.registerEvent("clear", this.removeAllSelectedTile.bind(this));
        Emitter.instance.registerEvent("clearShipId", this.clearShipId.bind(this));
        Emitter.instance.registerEvent("checkTile", this.checkTile.bind(this));
        Emitter.instance.registerEvent("SavePlayerId", this.savePlayerId.bind(this));
      },
      creatMap: function creatMap() {
        for (var i = 0; i < this.rows; i++) for (var j = 0; j < this.cols; j++) {
          var tile = cc.instantiate(this.tilePrefab);
          this.map[i][j] = tile;
          tile.parent = this.node;
        }
      },
      removeAllSelectedTile: function removeAllSelectedTile() {
        if (this.selectedTiles.length >= 0) {
          this.selectedTiles.forEach(function(element) {
            element.getComponent("Tile").active(false);
          });
          this.selectedTiles.length = 0;
        }
      },
      addSelectedTile: function addSelectedTile(data) {
        var _this2 = this;
        this.removeAllSelectedTile();
        this.isAvailable = true;
        this.checkAvailable(data.positions, data.shipId);
        this.selectedTiles.forEach(function(element) {
          if (_this2.isAvailable) {
            element.getComponent("Tile").activeColor = cc.color(0, 255, 0, 180);
            element.getComponent("Tile").active(true);
          } else {
            element.getComponent("Tile").activeColor = cc.color(255, 0, 0, 180);
            element.getComponent("Tile").active(true);
          }
        });
        Emitter.instance.emit("setAvailable", {
          isAvailable: this.isAvailable,
          shipId: data.shipId
        });
      },
      checkAvailable: function checkAvailable(arrayPos, shipId) {
        var _this3 = this;
        for (var i = 0; i < arrayPos.length; i++) {
          if (arrayPos[i].y < 0 || arrayPos[i].y >= this.rows || arrayPos[i].x < 0 || arrayPos[i].x >= this.rows) {
            this.isAvailable = false;
            continue;
          }
          this.selectedTiles.push(this.map[arrayPos[i].y][arrayPos[i].x]);
        }
        this.selectedTiles.forEach(function(element) {
          null != element.getComponent("Tile").shipId && element.getComponent("Tile").shipId != shipId && (_this3.isAvailable = false);
        });
      },
      clearShipId: function clearShipId(shipId) {
        cc.log("clear:", shipId);
        for (var i = 0; i < this.rows; i++) for (var j = 0; j < this.cols; j++) if (this.map[i][j].getComponent("Tile").shipId == shipId) {
          cc.log("clear");
          this.map[i][j].getComponent("Tile").shipId = null;
        }
      },
      setShipId: function setShipId(data) {
        var _this4 = this;
        cc.log("setShipid");
        this.removeAllSelectedTile();
        this.clearShipId(data.shipId);
        data.positions.forEach(function(element) {
          _this4.map[element.y][element.x].getComponent("Tile").shipId = data.shipId;
        });
      },
      checkTile: function checkTile(data) {
        if (this.playerId == data.playerId) {
          var node = this.map[data.position.y][data.position.x];
          var targetPosition = node.convertToNodeSpaceAR(cc.v2(0, 0));
          var shipId = node.getComponent("Tile").shipId;
          Emitter.instance.emit("receiveresult", {
            playerId: this.playerId,
            worldPosition: targetPosition.mul(-1),
            shipId: shipId,
            position: data.position
          });
          cc.tween(this.node).delay(3).call(function() {
            node.getComponent("Tile").changeState();
            null != shipId && Emitter.instance.emit("spawnEffects", {
              position: node.position,
              shipId: shipId
            });
          }).start();
        }
      },
      savePlayerId: function savePlayerId(data) {
        cc.log("save player id");
        this.playerId = data;
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  NAME_EVENT: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29a6cBl6qxERYDFp8PhUrlL", "NAME_EVENT");
    "use strict";
    var eventName = {
      IS_SHOOT_SHIP: "FINISH_SHOOT",
      RESET_TURN: "RESET_TURN",
      CHANGE_SCENE: "CHANGE_SCENE",
      COLD_DOWN_CLOCK: "COLD_DOWN_CLOCK",
      STOP_CLOCK: "STOP_CLOCK",
      RESET_TURN_CLOCK: "RESET_TURN_CLOCK",
      CHANGE_SCENE_CLOCK: "CHANGE_SCENE_CLOCK",
      POSITION: "POSITION",
      SEND_RESULT: "SEND_RESULT",
      CHECK_POSITION: "CHECK_POSITION",
      PLAY_ANI: "PLAY_ANI",
      DESTROY_ANI_NODE: "DESTROY_ANI_NODE",
      SHIP_FAIL: "SHIP_FAIL",
      SHIP_FAIL_CHECK: "SHIP_FAIL_CHECK",
      START: "START",
      DONE_CLIP_SHIP_FAIL: "DONE_CLIP_SHIP_FAIL",
      PLAY_ANI_SHIP_FAIL: "PLAY_ANI_SHIP_FAIL",
      COMPLETE_HIT_SHIP: "complete-hit-ship",
      HIT_SHIP: "hit-ship",
      CHOOSE_COORDINATES: "choose-coordinates",
      YOUR_TURN_PANEL: "UI-yourTurn",
      YOUR_TURN_PANEL_DONE: "UI-yourTurnDone",
      ENEMY_TURN_PANEL: "UI-enemyTurn",
      ENEMY_TURN_PANEL_DONE: "UI-enemyTurnDone",
      WAIT_FOR_ENEMY: "UI-waitForEnemy",
      WAIT_FOR_ENEMY_DONE: "UI-waitForEnemyDone",
      SOUND_CANON_SHOOT: "SOUND_CANON_SHOOT",
      SOUND_SHOOT_WATER: "SOUND_SHOOT_WATER",
      SOUND_EXPLOSION: "SOUND_EXPLOSION",
      SOUND_CLICK: "SOUND_CLICK",
      SOUND_LOADING: "SOUND_LOADING",
      SOUND_SHIP_SANK: "SOUND_SHIP_SANK",
      WIN: "WIN",
      LOSE: "LOSE",
      CHECK_SHIP_IN_CONTAINER: "checkShipInContainer",
      RECEIVE_RESULT: "receiveresult",
      RANDOM_SHIPS: "random-ships"
    };
    module.exports = eventName;
    cc._RF.pop();
  }, {} ],
  PirateContoller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14c43CiLyBCPadjuyd/ct6y", "PirateContoller");
    "use strict";
    var Emitter = require("EventEmitter");
    var StateMachine = require("javascript-state-machine");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onEnable: function onEnable() {
        var spine = this.node.getComponent(sp.Skeleton);
        spine.clearTracks();
        spine.setAnimation(0, "Idle", true);
      },
      onLoad: function onLoad() {
        Emitter.instance.registerEvent(EVENT_NAME.IS_SHOOT_SHIP, this.handleState.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.CHANGE_SCENE_CLOCK, this.handleState.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.SHIP_FAIL, this.changeStateShipFail.bind(this));
        this.onAttack();
      },
      clockOverTime: function clockOverTime() {
        var _this = this;
        var talkString = this.node.children[0].children[0].getComponent(cc.Label);
        var arrayTalking = {
          CB: "BOY IS OVER TIME",
          YT: "YOURS TURN HAS FINISHED"
        };
        cc.tween(talkString.node).call(function() {
          talkString.string = arrayTalking.CB;
        }).delay(1).call(function() {
          talkString.string = arrayTalking.YT;
        }).delay(1).call(function() {
          Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true);
        }).call(function() {
          _this.onAttack();
        }).start();
      },
      onAttack: function onAttack() {
        var talkString = this.node.children[0].children[0].getComponent(cc.Label);
        talkString.string = "SHOOTING SHIP ENEMY";
      },
      onFinal: function onFinal() {
        var _this2 = this;
        var talkString = this.node.children[0].children[0].getComponent(cc.Label);
        var arrayTalking = {
          CB: "CHICKEN BOYS",
          YT: "YOURS TURN HAS FINISHED"
        };
        cc.tween(talkString.node).call(function() {
          talkString.string = arrayTalking.CB;
        }).delay(1).call(function() {
          talkString.string = arrayTalking.YT;
        }).delay(1).call(function() {
          Emitter.instance.emit(EVENT_NAME.CHANGE_SCENE, true);
        }).call(function() {
          _this2.onAttack();
        }).start();
      },
      onAttackToAttack: function onAttackToAttack() {
        var talkString = this.node.children[0].children[0].getComponent(cc.Label);
        var arrayTalking = {
          GB: "GOOD BOYS",
          HASHIT: "U HAS HIT ENEMY SHIP",
          SA: "SHOOT AGAIN"
        };
        cc.tween(talkString.node).call(function() {
          talkString.string = arrayTalking.GB;
        }).delay(1).call(function() {
          talkString.string = arrayTalking.HASHIT;
        }).delay(1).call(function() {
          talkString.string = arrayTalking.SA;
          Emitter.instance.emit(EVENT_NAME.RESET_TURN);
        }).start();
      },
      onShipFail: function onShipFail() {
        var _this3 = this;
        cc.log("pirate taking");
        Emitter.instance.emit(EVENT_NAME.PLAY_ANI_SHIP_FAIL);
        Emitter.instance.registerOnce(EVENT_NAME.DONE_CLIP_SHIP_FAIL, function() {
          var talkString = _this3.node.children[0].children[0].getComponent(cc.Label);
          var arrayTalking = {
            GB: "GOOD BOYS",
            SB: "ENEMY SHIP HAS FAILED",
            GJ: "GOOD JOBS",
            SA: "SHOOT AGAIN"
          };
          cc.tween(talkString.node).call(function() {
            talkString.string = arrayTalking.GB;
          }).delay(1).call(function() {
            talkString.string = arrayTalking.SB;
          }).delay(2).call(function() {
            talkString.string = arrayTalking.GJ;
          }).delay(1).call(function() {
            talkString.string = arrayTalking.SA;
            Emitter.instance.emit(EVENT_NAME.SHIP_FAIL_CHECK);
          }).start();
        });
      },
      changeStateShipFail: function changeStateShipFail() {
        this.onShipFail();
      },
      handleState: function handleState(data) {
        cc.log("pre" + data);
        if (true === data) this.onAttackToAttack(); else if (false === data) this.onFinal(); else if (void 0 === data) {
          cc.log("pirate final");
          this.clockOverTime();
        }
      },
      update: function update() {}
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT",
    "javascript-state-machine": 2
  } ],
  PlayerController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3022fJBh1FFwaAJRQs5S41T", "PlayerController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        map: cc.Node,
        shipBool: cc.Node
      },
      onLoad: function onLoad() {
        this.playerId = this.generateRandomId();
        this.registerEvent();
      },
      start: function start() {},
      loadTheShip: function loadTheShip() {
        var _this = this;
        Emitter.instance.emit(EVENT_NAME.SOUND_CLICK);
        var allChildren = this.node.children[0].getChildren();
        this.ships = [];
        allChildren.forEach(function(child) {
          "ship" === child.name && _this.ships.push(child.getComponent("Ship"));
        });
        if (this.ships.length < 4) cc.log("Vui l\xf2ng ch\u1ecdn \u0111\u1ee7 t\xe0u"); else {
          Emitter.instance.emit("SavePlayerId", this.playerId);
          Emitter.instance.emit("START", this.playerId);
          this.shipBool.active = false;
          this.turnOffDraDrop();
        }
      },
      turnOffDraDrop: function turnOffDraDrop() {
        this.ships.forEach(function(element) {
          element.node.getComponent("dradropGameObject").turnOffListener();
        });
      },
      getShipById: function getShipById(shipId) {
        for (var index = 0; index < this.ships.length; index++) if (this.ships[index].shipId == shipId) return this.ships[index];
      },
      updateLength: function updateLength(shipId) {
        var ship = this.getShipById(shipId);
        ship.length -= 1;
        return ship.length;
      },
      responeResult: function responeResult(data) {
        if (this.playerId == data.playerId) if (null == data.shipId) {
          cc.log("hut");
          Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
            isHit: false,
            worldPosition: data.worldPosition
          });
        } else {
          var length = this.updateLength(data.shipId);
          if (0 == length) {
            cc.log("no");
            Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
              isHit: true,
              worldPosition: data.worldPosition,
              shipLength: length
            });
            Emitter.instance.emit(EVENT_NAME.COMPLETE_HIT_SHIP, data.shipId);
          } else {
            cc.log("trung");
            Emitter.instance.emit(EVENT_NAME.SEND_RESULT, {
              isHit: true,
              worldPosition: data.worldPosition,
              shipLength: length
            });
            var position = data.position;
            cc.log("enemy call:", data);
            Emitter.instance.emit(EVENT_NAME.HIT_SHIP, {
              shipId: data.shipId,
              position: {
                row: position.y,
                column: position.x
              }
            });
          }
        }
      },
      sendCoordinates: function sendCoordinates(data) {
        cc.log({
          playerId: this.playerId,
          position: data
        });
        Emitter.instance.emit("POSITION", {
          playerId: this.playerId,
          position: data
        });
      },
      checkPositon: function checkPositon(data) {
        cc.log(data);
        this.playerId == data.playerId && Emitter.instance.emit("checkTile", {
          playerId: this.playerId,
          position: data.position
        });
      },
      generateRandomId: function generateRandomId() {
        return Math.floor(Math.random() * Date.now()).toString();
      },
      addEffect: function addEffect(data) {
        var ship = this.getShipById(data.shipId).node.getChildByName("shipSprite");
        cc.log(ship);
        var worldPosition = data.effect.parent.convertToWorldSpaceAR(data.effect.position);
        data.effect.parent = ship;
        var localPosition = ship.convertToNodeSpaceAR(worldPosition);
        data.effect.position = localPosition;
        this.getShipById(data.shipId).isHorizontal && (data.effect.rotation = 90);
      },
      registerEvent: function registerEvent() {
        Emitter.instance.registerEvent(EVENT_NAME.CHECK_POSITION, this.checkPositon.bind(this));
        Emitter.instance.registerEvent("receiveresult", this.responeResult.bind(this));
        Emitter.instance.registerEvent("sendCoordinates", this.sendCoordinates.bind(this));
        Emitter.instance.registerEvent("addEffects", this.addEffect.bind(this));
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  Position: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eab40akdMhIfpqnZrls+Clw", "Position");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var position = function() {
      function position(x, y) {
        _classCallCheck(this, position);
        this._x = x;
        this._y = y;
      }
      _createClass(position, [ {
        key: "x",
        get: function get() {
          return this._x;
        },
        set: function set(value) {
          this._x = value;
        }
      }, {
        key: "y",
        get: function get() {
          return this._y;
        },
        set: function set(value) {
          this._y = value;
        }
      } ]);
      return position;
    }();
    module.exports = position;
    cc._RF.pop();
  }, {} ],
  ShipFailAnimation: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aa428ZAnzxPEL+tePqQ9jxW", "ShipFailAnimation");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        shipFailVideo: cc.Animation
      },
      onLoad: function onLoad() {
        Emitter.instance.registerEvent(EVENT_NAME.PLAY_ANI_SHIP_FAIL, this.playClip.bind(this));
        this.animation = this.shipFailVideo.node.getComponent(cc.Animation);
        this.animation.on("finished", this.onAnimationFinished, this);
      },
      playClip: function playClip() {
        Emitter.instance.emit(EVENT_NAME.SOUND_SHIP_SANK);
        this.shipFailVideo.node.active = true;
        var myanimation = this.shipFailVideo.node.getComponent(cc.Animation);
        myanimation.play(myanimation.getClips()[0].name);
        cc.log("hello clip");
      },
      onAnimationFinished: function onAnimationFinished() {
        this.shipFailVideo.node.active = false;
        Emitter.instance.emit(EVENT_NAME.DONE_CLIP_SHIP_FAIL);
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  Ship: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "306811SyINK4YlworkZ43RU", "Ship");
    "use strict";
    var position = require("Position");
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        length: 0,
        isHorizontal: true,
        hideShip: {
          get: function get() {
            return this._hideShip;
          },
          set: function set(value) {
            this._hideShip = value;
            this.shipSprite.node.active = !value;
          }
        },
        _hideShip: false,
        shipSprite: cc.Sprite
      },
      ctor: function ctor(length, isHorizontal) {
        this.length = length;
        this.isHorizontal = isHorizontal;
        this.shipId = this.generateRandomId();
        this.anchorIndex = Math.floor(this.length / 2);
        this.positions = [];
        this.creatPos();
      },
      onLoad: function onLoad() {
        null == this.shipId && (this.shipId = this.generateRandomId());
        this.isHorizontal = true, this.anchorIndex = Math.floor(this.length / 2);
        this.positions = [];
        this.creatPos();
        Emitter.instance.registerEvent("updateLength", this.updateLength.bind(this));
        Emitter.instance.registerEvent("showShip", this.showShip.bind(this));
      },
      creatPos: function creatPos() {
        for (var i = 0; i < this.length; i++) this.positions.push(new position(0, 0));
      },
      calculatePosition: function calculatePosition(x, y, isPlayer) {
        this.positions[this.anchorIndex].x = x;
        this.positions[this.anchorIndex].y = y;
        if (this.isHorizontal) {
          for (var i = this.anchorIndex - 1; i >= 0; i--) {
            this.positions[i].x = x - (this.anchorIndex - i);
            this.positions[i].y = y;
          }
          for (var _i = this.anchorIndex + 1; _i <= this.length - 1; _i++) {
            this.positions[_i].x = x + (_i - this.anchorIndex);
            this.positions[_i].y = y;
          }
        } else {
          for (var _i2 = this.anchorIndex - 1; _i2 >= 0; _i2--) {
            this.positions[_i2].x = x;
            this.positions[_i2].y = y - (this.anchorIndex - _i2);
          }
          for (var _i3 = this.anchorIndex + 1; _i3 <= this.length - 1; _i3++) {
            this.positions[_i3].x = x;
            this.positions[_i3].y = y + (_i3 - this.anchorIndex);
          }
        }
        isPlayer && Emitter.instance.emit("selected", {
          positions: this.positions,
          shipId: this.shipId
        });
      },
      generateRandomId: function generateRandomId() {
        return Math.floor(Math.random() * Date.now()).toString();
      },
      playanimOnWater: function playanimOnWater() {
        var scaleDown = cc.scaleTo(3, .9);
        var scaleUp = cc.scaleTo(3, 1);
        var sequence = cc.sequence(scaleDown, scaleUp);
        var repeatedAction = cc.repeatForever(sequence);
        this.node.getChildByName("shipSprite").runAction(repeatedAction);
      },
      changeRotation: function changeRotation() {
        cc.log("rotation");
        this.isHorizontal = !this.isHorizontal;
        this.isHorizontal ? this.node.rotation = 0 : this.node.rotation = 90;
        this.calculatePosition(this.positions[this.anchorIndex].x, this.positions[this.anchorIndex].y, true);
      },
      setShipToMap: function setShipToMap(map, position) {
        var row = position.row, column = position.column;
        var x = 55 * column;
        var y = 55 * -row;
        var newPos = cc.v2(x, y).add(map.position).add(cc.v2(30, -30));
        this.node.position = newPos;
        this.node.angle = this.isHorizontal ? 0 : -90;
      },
      updateLength: function updateLength(shipId, out) {
        if (this.shipId !== shipId) return;
        this.length--;
        out.length = this.length;
      },
      showShip: function showShip(shipId) {
        var _this = this;
        if (this.shipId !== shipId) return;
        cc.tween(this.node).delay(5).call(function() {
          return _this.hideShip = false;
        }).start();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    Position: "Position"
  } ],
  TestButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1ca18SXw2NLY4LIR1nX93u3", "TestButton");
    "use strict";
    var Emitter = require("EventEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        player: cc.Node
      },
      onLoad: function onLoad() {
        this.position = {
          x: 0,
          y: 0
        };
      },
      start: function start() {},
      test: function test() {
        Emitter.instance.emit("checkposition", {
          playerId: this.player.getComponent("PlayerController").playerId,
          position: this.position
        });
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter"
  } ],
  Test: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7fb826mX7BOwYHcVU6A8Cmk", "Test");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      sendResult: function sendResult(data) {
        var sendObject = {
          isHit: true,
          shipLength: 0,
          worldPosition: data.position
        };
        Emitter.instance.emit(EVENT_NAME.SEND_RESULT, sendObject);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  Tile: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3df79YCTr9Oq7rzT6lDba87", "Tile");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        cover: cc.Node,
        hover: cc.Node,
        activeColor: cc.Color,
        effect: [ cc.Prefab ],
        shipId: null,
        isShooted: false
      },
      active: function active(isSelected) {
        if (isSelected) {
          this.cover.active = true;
          this.cover.color = this.activeColor;
        } else this.cover.active = false;
      },
      select: function select() {
        var effect = null;
        effect = this.isHasShip ? cc.instantiate(this.effect[0]) : cc.instantiate(this.effect[1]);
        effect.parent = this.node;
      },
      setHover: function setHover(isHover) {
        this.hover.active = !!isHover;
      },
      changeState: function changeState() {
        if (null == this.shipId) {
          this.cover.active = true;
          this.cover.color = this.activeColor = cc.color(80, 80, 80, 180);
        } else {
          this.cover.active = true;
          this.cover.color = this.activeColor = cc.color(255, 0, 0, 180);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  VfxController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d0a7dAmlqtN46G74qJ7/Tp4", "VfxController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        bomPrefab: cc.Prefab,
        missPrefab: cc.Prefab,
        explosionShip: cc.Prefab
      },
      onLoad: function onLoad() {
        this.shipLenght = 0;
        this.bom;
        this.isHit = false;
        Emitter.instance.registerEvent(EVENT_NAME.PLAY_ANI, this.playAnimation.bind(this));
        Emitter.instance.registerEvent(EVENT_NAME.DESTROY_ANI_NODE, this.destroyNode.bind(this));
        this.animation = null;
      },
      playAnimation: function playAnimation(data) {
        this.isHit = data.isHit;
        this.shipLength = data.shipLength;
        this.bom = cc.instantiate(this.bomPrefab);
        var canvas = cc.find("Canvas");
        this.bom.setParent(canvas);
        this.bom.position = canvas.convertToNodeSpaceAR(data.worldPosition);
        if (this.isHit) {
          var myanimation = this.bom.getComponent(cc.Animation);
          myanimation.play(myanimation.getClips()[0].name);
          Emitter.instance.emit(EVENT_NAME.SOUND_EXPLOSION);
          0 !== this.shipLength && Emitter.instance.emit(EVENT_NAME.IS_SHOOT_SHIP, true);
        } else {
          var _myanimation = this.bom.getComponent(cc.Animation);
          _myanimation.play(_myanimation.getClips()[1].name);
          Emitter.instance.emit(EVENT_NAME.SOUND_SHOOT_WATER);
          0 !== this.shipLength && Emitter.instance.emit(EVENT_NAME.IS_SHOOT_SHIP, false);
        }
      },
      destroyNode: function destroyNode() {
        0 === this.shipLength && Emitter.instance.emit(EVENT_NAME.SHIP_FAIL);
        this.bom.destroy();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  dradropGameObject: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "56371aesqZE4IqgNLaxJtZD", "dradropGameObject");
    "use strict";
    var Emitter = require("EventEmitter");
    var EventName = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        map: cc.Node,
        container: cc.Node,
        isAvailable: false,
        touchDelay: .2
      },
      onLoad: function onLoad() {
        this.offset = cc.Vec2.ZERO;
        this.isDragging = false;
        this.isDoubleClick = false;
        this.count = 0;
        this.lastTouchTime = 0;
        this.convertPos = new cc.Vec2();
        this.lastPosition = this.node.position;
        this.setAgain = false;
        cc.log(this.lastPosition);
      },
      start: function start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        Emitter.instance.registerEvent("setAvailable", this.setAvailable.bind(this));
        Emitter.instance.registerEvent("checkAvailableAll", this.checkAvailableAgain.bind(this));
        this.node.getComponent("Ship").playanimOnWater();
      },
      onTouchStart: function onTouchStart(event) {
        cc.log("start");
        this.node.getChildByName("shipSprite").stopAllActions();
        var prevTouch = this.lastTouchTime ? this.lastTouchTime : 0;
        this.lastTouchTime = Date.now();
        if (this.lastTouchTime - prevTouch < 500) {
          cc.log(this.node.parent);
          if (this.node.parent != this.container) {
            cc.log("doubleTap");
            this.isDoubleClick = true;
          }
        } else this.isDoubleClick = false;
        if (this.node.parent == this.container && false == this.isDoubleClick) {
          this.node.parent = this.container.parent.parent;
          this.node.position = new cc.Vec2(this.node.x + this.container.x + this.container.parent.x, this.node.y + this.container.y + this.container.parent.y);
        }
        this.isDragging = true;
        var worldPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.offset = this.node.position.sub(worldPos);
      },
      onTouchMove: function onTouchMove(event) {
        cc.log("dra");
        if (!this.isDragging) return;
        var worldPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.node.position = worldPos.add(this.offset);
        var shipPos = new cc.Vec2(this.node.x - this.map.x, this.node.y - this.map.y);
        this.convertPosition(shipPos);
      },
      onTouchEnd: function onTouchEnd(event) {
        cc.log("c\xf3 ch\u1ea1y tochend");
        if (this.isDoubleClick) this.node.getComponent("Ship").changeRotation(); else {
          this.isDoubleClick = false;
          this.endTochAction();
        }
        var currentTime = new Date().getTime();
        this.lastTouchTime = currentTime;
      },
      convertPosition: function convertPosition(shipPos) {
        var posX = shipPos.x - 30;
        var posY = shipPos.y + 30;
        var stepX = Math.round(posX / 55);
        var stepY = Math.round(posY / 55);
        var newPos = new cc.Vec2(55 * stepX, 55 * stepY);
        this.node.getComponent("Ship").calculatePosition(stepX, -1 * stepY, true);
        this.convertPos = new cc.Vec2(newPos.x + this.map.x + 30, newPos.y + this.map.y - 30);
      },
      setAvailable: function setAvailable(data) {
        if (this.node.getComponent("Ship").shipId == data.shipId) {
          cc.log("data", data);
          cc.log("isdraging", this.isDragging);
          this.isAvailable = data.isAvailable;
          cc.log("isdouble click", this.isDoubleClick);
          if (this.isDoubleClick) {
            this.endTochAction();
            this.isDoubleClick = false;
          }
          if (this.setAgain && this.isAvailable) {
            this.setAgain = false;
            Emitter.instance.emit("setShipId", {
              positions: this.node.getComponent("Ship").positions,
              shipId: this.node.getComponent("Ship").shipId
            });
            Emitter.instance.emit(EventName.CHECK_SHIP_IN_CONTAINER);
          }
        }
      },
      endTochAction: function endTochAction() {
        this.node.position = this.convertPos;
        this.isDragging = false;
        cc.log("isAvailable", this.isAvailable);
        if (false == this.isAvailable) {
          if (false == this.isDoubleClick) {
            this.node.parent = this.container;
            this.node.position = this.lastPosition;
            this.node.getComponent("Ship").isHorizontal = true;
            this.node.rotation = 0;
            cc.log(this.node.parent);
            Emitter.instance.emit("clear", {
              shipId: this.node.getComponent("Ship").shipId
            });
          }
          Emitter.instance.emit("clearShipId", this.node.getComponent("Ship").shipId);
        } else {
          cc.log("c\xf3 set");
          Emitter.instance.emit("setShipId", {
            positions: this.node.getComponent("Ship").positions,
            shipId: this.node.getComponent("Ship").shipId
          });
        }
        Emitter.instance.emit(EventName.CHECK_SHIP_IN_CONTAINER);
        Emitter.instance.emit("checkAvailableAll", this.node.getComponent("Ship").shipId);
        this.node.getComponent("Ship").playanimOnWater();
      },
      turnOffListener: function turnOffListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
      },
      checkAvailableAgain: function checkAvailableAgain(data) {
        if (this.node.getComponent("Ship").shipId != data && this.node.parent != this.container && false == this.isAvailable) {
          this.setAgain = true;
          var shipPos = new cc.Vec2(this.node.x - this.map.x, this.node.y - this.map.y);
          this.convertPosition(shipPos);
        }
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  gameOverManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5434q1V+1P04GdrfotDNBL", "gameOverManager");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        winPanel: cc.Node,
        losePanel: cc.Node,
        loadingScene: cc.Node,
        loadingWaves: cc.Node,
        yEnd: 280
      },
      onLoad: function onLoad() {
        var _openWinPanel = this.openWinPanel.bind(this);
        var _openLosePanel = this.openLosePanel.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.WIN, _openWinPanel);
        Emitter.instance.registerEvent(EVENT_NAME.LOSE, _openLosePanel);
      },
      start: function start() {
        this.winPanel.active = false;
        this.losePanel.active = false;
        this.loadingScene.active = false;
      },
      openWinPanel: function openWinPanel() {
        this.winPanel.active = true;
        this.scheduleOnce(function() {
          this.loading();
        }, 5);
      },
      openLosePanel: function openLosePanel() {
        this.losePanel.active = true;
        this.scheduleOnce(function() {
          this.loading();
        }, 5);
      },
      restart: function restart() {
        cc.director.loadScene("logInScene");
      },
      loading: function loading() {
        var _this = this;
        this.loadingScene.active = true;
        cc.tween(this.loadingWaves).to(5.2, {
          y: this.yEnd
        }).call(function() {
          _this.restart();
        }).start();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  helpInfoManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2a97aluKypAQK3kJbAuAlSD", "helpInfoManager");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        pageIndex: 1,
        leftButton: cc.Node,
        rightButton: cc.Node,
        pagePool: cc.Node
      },
      onLoad: function onLoad() {
        this.pageNodes = this.pagePool.getChildren();
        this.setPage();
      },
      start: function start() {},
      nextPage: function nextPage() {
        this.pageIndex++;
        this.setPage();
      },
      backPage: function backPage() {
        this.pageIndex--;
        this.setPage();
      },
      setPage: function setPage() {
        var _this = this;
        this.checkButton();
        this.pageNodes.forEach(function(element) {
          element.name === "Page" + _this.pageIndex ? element.active = true : element.active = false;
        });
      },
      checkButton: function checkButton() {
        if (this.pageIndex >= this.pageNodes.length) this.rightButton.active = false; else if (this.pageIndex <= 1) this.leftButton.active = false; else {
          this.rightButton.active = true;
          this.leftButton.active = true;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  loginManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e5a4Szn7hCRJELoZIxqkqk", "loginManager");
    "use strict";
    var percent = {
      value: 0
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        loginScene: cc.Node,
        loadingScene: cc.Node,
        loadingWaves: cc.Node,
        yStart: 40,
        yEnd: 280,
        speed: 100,
        percentLabel: cc.Label
      },
      onLoad: function onLoad() {},
      start: function start() {
        this.loginScene.active = true;
        this.loadingScene.active = false;
      },
      update: function update(dt) {
        this.setPercentLabel(Math.floor(percent.value));
      },
      setPercentLabel: function setPercentLabel(percent) {
        this.percentLabel.string = percent + "%";
      },
      loading: function loading() {
        var _this = this;
        this.loginScene.active = false;
        this.loadingScene.active = true;
        cc.tween(percent).delay(.5).to(.5, {
          value: 20
        }).delay(.5).call(function() {
          _this.loadMainScene();
        }).to(.4, {
          value: 30
        }).delay(.4).to(.3, {
          value: 60
        }).delay(.3).to(.3, {
          value: 65
        }).delay(.3).to(.2, {
          value: 90
        }).delay(.2).to(1, {
          value: 100
        }).start();
        cc.tween(this.loadingWaves).to(5.2, {
          y: this.yEnd
        }).start();
      },
      loadMainScene: function loadMainScene() {
        cc.director.loadScene("mainScene");
      }
    });
    cc._RF.pop();
  }, {} ],
  menuController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "49aacbe0fVJvob6t7pgZSUV", "menuController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        mainMenu: cc.Node,
        mainMenuButton: cc.Node,
        setting: cc.Node,
        helpInfo: cc.Node,
        soundManager: cc.Node,
        musicSlider: cc.Slider,
        soundsSlider: cc.Slider
      },
      onLoad: function onLoad() {},
      start: function start() {
        this.mainMenu.active = false;
        this.setting.active = false;
        this.helpInfo.active = false;
        this._soundManager = this.soundManager.getComponent("soundManager");
        this.updateSlider();
      },
      update: function update(dt) {},
      openMainMenu: function openMainMenu() {
        this.mainMenu.active = true;
        this.mainMenuButton.active = false;
        this.soundButton();
        cc.director.pause();
      },
      closeMainMenu: function closeMainMenu() {
        this.mainMenu.active = false;
        this.mainMenuButton.active = true;
        this.soundButton();
        cc.director.resume();
      },
      openSetting: function openSetting() {
        this.setting.active = true;
        this.soundButton();
      },
      closeSetting: function closeSetting() {
        this.setting.active = false;
        this.soundButton();
      },
      openHelpInfo: function openHelpInfo() {
        this.helpInfo.active = true;
        this.soundButton();
      },
      closeHelpInfo: function closeHelpInfo() {
        this.helpInfo.active = false;
        this.soundButton();
      },
      newGame: function newGame() {
        cc.director.resume();
        this.closeMainMenu();
        cc.director.loadScene("mainScene");
      },
      soundButton: function soundButton() {
        this._soundManager.click();
      },
      changeMusicVolume: function changeMusicVolume() {
        this._soundManager.changeMusicVolume(this.musicSlider.progress);
        this.musicSlider.node.getChildByName("Music ProgressBar").getComponent(cc.ProgressBar).progress = this.musicSlider.progress;
      },
      changeSoundsVolume: function changeSoundsVolume() {
        this._soundManager.changeSoundsVolume(this.soundsSlider.progress);
        this.soundsSlider.node.getChildByName("Sound ProgressBar").getComponent(cc.ProgressBar).progress = this.soundsSlider.progress;
      },
      updateSlider: function updateSlider() {
        this.musicSlider.progress = cc.sys.localStorage.getItem("mainMusicVolume");
        this.soundsSlider.progress = cc.sys.localStorage.getItem("soundsVolume");
        this.changeMusicVolume();
        this.changeSoundsVolume();
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  rands: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "391e2mRLk9BobPkb7nRaVip", "rands");
    "use strict";
    var horizontalOffsets = [ [ 0, -1 ], [ 0, 1 ] ];
    var verticalOffsets = [ [ -1, 0 ], [ 1, 0 ] ];
    var offsets = [].concat(horizontalOffsets, verticalOffsets);
    var random = function random(min, max) {
      if (!max) {
        max = min;
        min = 0;
      }
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var randomInArray = function randomInArray(array) {
      var index = random(array.length - 1);
      return array[index];
    };
    var randomPosition = function randomPosition(maxRow, maxColumn) {
      var row = random(maxRow - 1);
      var column = random(maxColumn - 1);
      return {
        row: row,
        column: column
      };
    };
    var addPosition = function addPosition(position, offset) {
      return {
        row: position.row + offset[0],
        column: position.column + offset[1]
      };
    };
    var checkPosition = function checkPosition(position, maxRow, maxColumn) {
      return position.row >= 0 && position.row < maxRow && position.column >= 0 && position.column < maxColumn;
    };
    var randomAroundPos = function randomAroundPos(position, maxRow, maxColumn) {
      var newPos = {};
      do {
        var offset = randomInArray(offsets);
        newPos = addPosition(position, offset);
      } while (!checkPosition(newPos, maxRow, maxColumn));
      return newPos;
    };
    var randomAroundPosWithOffset = function randomAroundPosWithOffset(firstPos, lastPos, maxRow, maxColumn, offsets) {
      var position = {};
      var newPositions = [ addPosition(firstPos, offsets[0]), addPosition(lastPos, offsets[1]) ];
      do {
        position = randomInArray(newPositions);
      } while (!checkPosition(position, maxRow, maxColumn));
      return position;
    };
    var randomAroundPositions = function randomAroundPositions(positions, maxRow, maxColumn) {
      if (1 === positions.length) return randomAroundPos(positions[0], maxRow, maxColumn);
      positions.sort(function(a, b) {
        return a.row - b.row || a.column - b.column;
      });
      var firstPos = positions[0];
      var lastPos = positions[positions.length - 1];
      var isHorizontal = firstPos.row - lastPos.row === 0;
      var offsets = isHorizontal ? horizontalOffsets : verticalOffsets;
      return randomAroundPosWithOffset(firstPos, lastPos, maxRow, maxColumn, offsets);
    };
    var randomHitShip = function randomHitShip(hitShips, maxRow, maxColumn) {
      var shipId = randomInArray(Object.keys(hitShips));
      var shipPos = hitShips[shipId];
      return randomAroundPositions(shipPos, maxRow, maxColumn);
    };
    module.exports = {
      random: random,
      randomInArray: randomInArray,
      randomPosition: randomPosition,
      randomHitShip: randomHitShip
    };
    cc._RF.pop();
  }, {} ],
  soundManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d0b80fTuKRFEq5VkWdGERVU", "soundManager");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        mainMusic: cc.AudioSource,
        sounds: [ cc.AudioSource ]
      },
      onLoad: function onLoad() {
        var _canonShoot = this.canonShoot.bind(this);
        var _explosion = this.explosion.bind(this);
        var _shootWater = this.shootWater.bind(this);
        var _click = this.click.bind(this);
        var _loading = this.loading.bind(this);
        var _shipSank = this.shipSank.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_CANON_SHOOT, _canonShoot);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_SHOOT_WATER, _shootWater);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_EXPLOSION, _explosion);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_CLICK, _click);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_LOADING, _loading);
        Emitter.instance.registerEvent(EVENT_NAME.SOUND_SHIP_SANK, _shipSank);
      },
      start: function start() {
        this.mainMusic.play();
        this.changeMusicVolume(cc.sys.localStorage.getItem("mainMusicVolume"));
        this.changeSoundsVolume(cc.sys.localStorage.getItem("soundsVolume"));
      },
      canonShoot: function canonShoot() {
        this.playSound("explosion");
      },
      explosion: function explosion() {
        this.playSound("explosion");
      },
      shootWater: function shootWater() {
        this.playSound("shoot_water");
      },
      click: function click() {
        this.playSound("click");
      },
      shipSank: function shipSank() {
        this.playSound("shipSank");
      },
      loading: function loading() {
        var _this = this;
        this.playSound("loading");
        this.node.runAction(cc.sequence(cc.delayTime(4), cc.callFunc(function() {
          _this.stopSound("loading");
        })));
      },
      playSound: function playSound(name) {
        this.sounds.forEach(function(element) {
          if (element.node.name == name) {
            element.play();
            return;
          }
        });
      },
      stopSound: function stopSound(name) {
        this.sounds.forEach(function(element) {
          if (element.node.name == name) {
            element.stop();
            return;
          }
        });
      },
      changeMusicVolume: function changeMusicVolume(volume) {
        this.mainMusic.volume = volume;
        cc.sys.localStorage.setItem("mainMusicVolume", volume);
      },
      changeSoundsVolume: function changeSoundsVolume(volume) {
        cc.sys.localStorage.setItem("soundsVolume", volume);
        this.sounds.forEach(function(element) {
          element.volume = volume;
        });
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  stats: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae522pScS1KM7YGv8yRZKOa", "stats");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
        cc.sys.localStorage.setItem("mainMusicVolume", .5);
        cc.sys.localStorage.setItem("soundsVolume", .5);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  turnController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98f7d9rySNGXKRqRWEY6XQe", "turnController");
    "use strict";
    var Emitter = require("EventEmitter");
    var EVENT_NAME = require("NAME_EVENT");
    cc.Class({
      extends: cc.Component,
      properties: {
        yourTurnPanel: cc.Node,
        xStartYourTurn: -1500,
        enemyTurnPanel: cc.Node,
        xStartEnemyTurn: 1500,
        circleLoading: cc.Node,
        loadingLabel: cc.Label
      },
      onLoad: function onLoad() {
        this.circleLoading.parent.active = false;
        var _yourTurn = this.yourTurn.bind(this);
        var _enemyTurn = this.enemyTurn.bind(this);
        var _waitForEnemy = this.waitForEnemy.bind(this);
        Emitter.instance.registerEvent(EVENT_NAME.YOUR_TURN_PANEL, _yourTurn);
        Emitter.instance.registerEvent(EVENT_NAME.ENEMY_TURN_PANEL, _enemyTurn);
        Emitter.instance.registerEvent(EVENT_NAME.WAIT_FOR_ENEMY, _waitForEnemy);
      },
      start: function start() {
        this.resetPosition();
      },
      resetPosition: function resetPosition() {
        this.yourTurnPanel.x = this.xStartYourTurn;
        this.enemyTurnPanel.x = this.xStartEnemyTurn;
        this.yourTurnPanel.active = false;
        this.enemyTurnPanel.active = false;
      },
      yourTurn: function yourTurn() {
        var _this = this;
        this.yourTurnPanel.active = true;
        var action = cc.sequence(cc.moveTo(.5, -20, 0), cc.moveTo(1, 20, 0), cc.moveTo(.5, 1500, 0), cc.callFunc(function() {
          _this.resetPosition();
          Emitter.instance.emit(EVENT_NAME.YOUR_TURN_PANEL_DONE);
        }));
        this.yourTurnPanel.runAction(action);
      },
      enemyTurn: function enemyTurn() {
        var _this2 = this;
        this.enemyTurnPanel.active = true;
        var action = cc.sequence(cc.moveTo(.5, 20, 0), cc.moveTo(1, -20, 0), cc.moveTo(.5, -1500, 0), cc.callFunc(function() {
          _this2.resetPosition();
          Emitter.instance.emit(EVENT_NAME.ENEMY_TURN_PANEL_DONE);
        }));
        this.enemyTurnPanel.runAction(action);
      },
      waitForEnemy: function waitForEnemy() {
        var _this3 = this;
        this.circleLoading.parent.active = true;
        var action = cc.sequence(cc.spawn(cc.rotateTo(3, 180), cc.callFunc(function() {
          _this3.loadingLabel.string = "WAITING ENEMY";
          Emitter.instance.emit(EVENT_NAME.SOUND_LOADING);
        })), cc.spawn(cc.delayTime(1), cc.callFunc(function() {
          _this3.loadingLabel.string = "START";
        })), cc.callFunc(function() {
          _this3.circleLoading.rotation = 0;
          _this3.circleLoading.parent.active = false;
          Emitter.instance.emit(EVENT_NAME.WAIT_FOR_ENEMY_DONE);
        }));
        this.circleLoading.runAction(action);
      }
    });
    cc._RF.pop();
  }, {
    EventEmitter: "EventEmitter",
    NAME_EVENT: "NAME_EVENT"
  } ],
  waveController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97536XFv0NCvL6LY3ePOzI6", "waveController");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        posX: 0,
        posY: 0
      },
      start: function start() {
        this.posX = this.node.x;
        this.posY = this.node.y;
        var action = cc.repeatForever(cc.sequence(cc.spawn(cc.scaleTo(2, this.random(1, 1.3), this.random(1, 1.1)), cc.moveTo(2, this.random(this.posX, this.posX + 5), this.random(this.posY, this.posY + 5))), cc.spawn(cc.scaleTo(2, 1, 1), cc.moveTo(2, this.random(this.posX, this.posX - 5, this.posY), this.random(this.posY, this.posY - 5)))));
        this.node.runAction(action);
      },
      random: function random(min, max) {
        return Math.random() * (max - min) + min;
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "ClockController", "ContainerShipController", "EnemyController", "EventController", "GameController", "MainController", "PirateContoller", "PlayerController", "VfxController", "menuController", "turnController", "waveController", "EffectSpawner", "gameOverManager", "helpInfoManager", "loginManager", "soundManager", "stats", "AnimationState", "AutoLoadMap", "AutoLoadShip", "Bom", "Emitter", "EnemyMap", "FindTileInMap", "Map", "Ship", "ShipFailAnimation", "Test", "TestButton", "Tile", "dradropGameObject", "EventEmitter", "NAME_EVENT", "Position", "rands" ]);