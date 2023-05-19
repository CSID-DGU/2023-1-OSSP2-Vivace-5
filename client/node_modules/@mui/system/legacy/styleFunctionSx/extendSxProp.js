import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { isPlainObject } from '@mui/utils';
import defaultSxConfig from './defaultSxConfig';
var splitProps = function splitProps(props) {
  var _props$theme$unstable, _props$theme;
  var result = {
    systemProps: {},
    otherProps: {}
  };
  var config = (_props$theme$unstable = props == null ? void 0 : (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : defaultSxConfig;
  Object.keys(props).forEach(function (prop) {
    if (config[prop]) {
      result.systemProps[prop] = props[prop];
    } else {
      result.otherProps[prop] = props[prop];
    }
  });
  return result;
};
export default function extendSxProp(props) {
  var inSx = props.sx,
    other = _objectWithoutProperties(props, ["sx"]);
  var _splitProps = splitProps(other),
    systemProps = _splitProps.systemProps,
    otherProps = _splitProps.otherProps;
  var finalSx;
  if (Array.isArray(inSx)) {
    finalSx = [systemProps].concat(_toConsumableArray(inSx));
  } else if (typeof inSx === 'function') {
    finalSx = function finalSx() {
      var result = inSx.apply(void 0, arguments);
      if (!isPlainObject(result)) {
        return systemProps;
      }
      return _objectSpread(_objectSpread({}, systemProps), result);
    };
  } else {
    finalSx = _objectSpread(_objectSpread({}, systemProps), inSx);
  }
  return _objectSpread(_objectSpread({}, otherProps), {}, {
    sx: finalSx
  });
}