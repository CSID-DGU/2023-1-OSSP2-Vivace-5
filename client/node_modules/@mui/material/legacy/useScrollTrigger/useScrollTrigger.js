import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
function defaultTrigger(store, options) {
  var _options$disableHyste = options.disableHysteresis,
    disableHysteresis = _options$disableHyste === void 0 ? false : _options$disableHyste,
    _options$threshold = options.threshold,
    threshold = _options$threshold === void 0 ? 100 : _options$threshold,
    target = options.target;
  var previous = store.current;
  if (target) {
    // Get vertical scroll
    store.current = target.pageYOffset !== undefined ? target.pageYOffset : target.scrollTop;
  }
  if (!disableHysteresis && previous !== undefined) {
    if (store.current < previous) {
      return false;
    }
  }
  return store.current > threshold;
}
var defaultTarget = typeof window !== 'undefined' ? window : null;
export default function useScrollTrigger() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$getTrigger = options.getTrigger,
    getTrigger = _options$getTrigger === void 0 ? defaultTrigger : _options$getTrigger,
    _options$target = options.target,
    target = _options$target === void 0 ? defaultTarget : _options$target,
    other = _objectWithoutProperties(options, ["getTrigger", "target"]);
  var store = React.useRef();
  var _React$useState = React.useState(function () {
      return getTrigger(store, other);
    }),
    trigger = _React$useState[0],
    setTrigger = _React$useState[1];
  React.useEffect(function () {
    var handleScroll = function handleScroll() {
      setTrigger(getTrigger(store, _objectSpread({
        target: target
      }, other)));
    };
    handleScroll(); // Re-evaluate trigger when dependencies change
    target.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return function () {
      target.removeEventListener('scroll', handleScroll, {
        passive: true
      });
    };
    // See Option 3. https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, getTrigger, JSON.stringify(other)]);
  return trigger;
}