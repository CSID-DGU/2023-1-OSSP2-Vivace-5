import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { deepmerge } from '@mui/utils';
import cssVarsParser from './cssVarsParser';
function prepareCssVars(theme, parserConfig) {
  // @ts-ignore - ignore components do not exist
  var _theme$colorSchemes = theme.colorSchemes,
    colorSchemes = _theme$colorSchemes === void 0 ? {} : _theme$colorSchemes,
    components = theme.components,
    otherTheme = _objectWithoutProperties(theme, ["colorSchemes", "components"]);
  var _cssVarsParser = cssVarsParser(otherTheme, parserConfig),
    rootVars = _cssVarsParser.vars,
    rootCss = _cssVarsParser.css,
    rootVarsWithDefaults = _cssVarsParser.varsWithDefaults;
  var themeVars = rootVarsWithDefaults;
  var colorSchemesMap = {};
  var light = colorSchemes.light,
    otherColorSchemes = _objectWithoutProperties(colorSchemes, ["light"]);
  Object.entries(otherColorSchemes || {}).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      scheme = _ref2[1];
    var _cssVarsParser2 = cssVarsParser(scheme, parserConfig),
      vars = _cssVarsParser2.vars,
      css = _cssVarsParser2.css,
      varsWithDefaults = _cssVarsParser2.varsWithDefaults;
    themeVars = deepmerge(themeVars, varsWithDefaults);
    colorSchemesMap[key] = {
      css: css,
      vars: vars
    };
  });
  if (light) {
    // light color scheme vars should be merged last to set as default
    var _cssVarsParser3 = cssVarsParser(light, parserConfig),
      css = _cssVarsParser3.css,
      vars = _cssVarsParser3.vars,
      varsWithDefaults = _cssVarsParser3.varsWithDefaults;
    themeVars = deepmerge(themeVars, varsWithDefaults);
    colorSchemesMap.light = {
      css: css,
      vars: vars
    };
  }
  var generateCssVars = function generateCssVars(colorScheme) {
    if (!colorScheme) {
      return {
        css: _objectSpread({}, rootCss),
        vars: rootVars
      };
    }
    return {
      css: _objectSpread({}, colorSchemesMap[colorScheme].css),
      vars: colorSchemesMap[colorScheme].vars
    };
  };
  return {
    vars: themeVars,
    generateCssVars: generateCssVars
  };
}
export default prepareCssVars;