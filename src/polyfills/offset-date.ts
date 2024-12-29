// @ts-nocheck
export const polyfillOffsetDate = offset => {
  const OldDate = Date;
  function _classCallCheck(instance, Constructor) {
    return instance instanceof Constructor;
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) Object.defineProperties(Constructor.prototype, protoProps);
    if (staticProps) Object.defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, 'prototype', { writable: false });
    return Constructor;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function');
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: { value: subClass, writable: true, configurable: true }
    });
    Object.defineProperty(subClass, 'prototype', { writable: false });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _createSuper(Derived) {
    const hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      const Super = _getPrototypeOf(Derived);
      let result;
      if (hasNativeReflectConstruct) {
        const NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === 'object' || typeof call === 'function')) {
      return call;
    }
    if (call !== void 0) {
      throw new TypeError('Derived constructors may only return object or undefined');
    }
    return _assertThisInitialized(self);
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _wrapNativeSuper(Class) {
    const _cache = typeof Map === 'function' ? new Map() : undefined;
    // @ts-ignore
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;
      if (typeof Class !== 'function') {
        throw new TypeError('Super expression must either be null or a function');
      }
      if (typeof _cache !== 'undefined') {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        // @ts-ignore
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      // @ts-ignore
      _construct = Reflect.construct.bind();
    } else {
      // @ts-ignore
      _construct = function _construct(Parent, args, Class) {
        const a = [null];
        a.push.apply(a, args);
        // @ts-ignore
        const Constructor = Function.bind.apply(Parent, a);
        // @ts-ignore
        const instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    // @ts-ignore
    return _construct.apply(null, arguments);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
    // @ts-ignore
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === 'function') return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf('[native code]') !== -1;
  }
  function _setPrototypeOf(o, p) {
    // @ts-ignore
    _setPrototypeOf = Object.setPrototypeOf
      ? // @ts-ignore
        Object.setPrototypeOf.bind()
      : function _setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
        };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    // @ts-ignore
    _getPrototypeOf = Object.setPrototypeOf
      ? // @ts-ignore
        Object.getPrototypeOf.bind()
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }

  const MyDate = /* #__PURE__ */ (function (_Date) {
    _inherits(MyDate, _Date);
    // @ts-ignore
    if (_classCallCheck(this, MyDate)) {
      // @ts-ignore
      if (arguments.length === 0) return OldDate.now() + offset;
      // @ts-ignore
      return new OldDate(...arguments);
    }
    const _super = _createSuper(MyDate);
    function MyDate() {
      let _this;
      // @ts-ignore
      if (!_classCallCheck(this, MyDate)) {
        // @ts-ignore
        if (arguments.length === 0) return new OldDate(OldDate.now() + offset).toString();
        // @ts-ignore
        return OldDate(...arguments);
      }
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }
      if (params.length === 0) {
        // @ts-ignore
        const timeStamp = OldDate.now() + offset;
        // @ts-ignore
        _this = _super.call(this, timeStamp);
      } else {
        // @ts-ignore
        _this = _super.call.apply(_super, [this].concat(params));
      }

      // @ts-ignore
      return _possibleConstructorReturn(_this);
    }
    // @ts-ignore
    _createClass(MyDate);
    return MyDate;
  })(/* #__PURE__ */ _wrapNativeSuper(OldDate));

  MyDate.now = () => {
    return OldDate.now() + offset;
  };

  window.Date = MyDate;
};
