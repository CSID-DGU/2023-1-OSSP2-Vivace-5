import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import prepareCssVars from './prepareCssVars';
function createCssVarsTheme(theme) {
  var cssVarPrefix = theme.cssVarPrefix,
    shouldSkipGeneratingVar = theme.shouldSkipGeneratingVar,
    otherTheme = _objectWithoutProperties(theme, ["cssVarPrefix", "shouldSkipGeneratingVar"]);
  return _objectSpread(_objectSpread({}, theme), prepareCssVars(otherTheme, {
    prefix: cssVarPrefix,
    shouldSkipGeneratingVar: shouldSkipGeneratingVar
  }));
}
export default createCssVarsTheme;