"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = require("@mui/utils");
var _cssVarsParser = _interopRequireDefault(require("./cssVarsParser"));
function prepareCssVars(theme, parserConfig) {
  // @ts-ignore - ignore components do not exist
  const {
    colorSchemes = {},
    components,
    ...otherTheme
  } = theme;
  const {
    vars: rootVars,
    css: rootCss,
    varsWithDefaults: rootVarsWithDefaults
  } = (0, _cssVarsParser.default)(otherTheme, parserConfig);
  let themeVars = rootVarsWithDefaults;
  const colorSchemesMap = {};
  const {
    light,
    ...otherColorSchemes
  } = colorSchemes;
  Object.entries(otherColorSchemes || {}).forEach(([key, scheme]) => {
    const {
      vars,
      css,
      varsWithDefaults
    } = (0, _cssVarsParser.default)(scheme, parserConfig);
    themeVars = (0, _utils.deepmerge)(themeVars, varsWithDefaults);
    colorSchemesMap[key] = {
      css,
      vars
    };
  });
  if (light) {
    // light color scheme vars should be merged last to set as default
    const {
      css,
      vars,
      varsWithDefaults
    } = (0, _cssVarsParser.default)(light, parserConfig);
    themeVars = (0, _utils.deepmerge)(themeVars, varsWithDefaults);
    colorSchemesMap.light = {
      css,
      vars
    };
  }
  const generateCssVars = colorScheme => {
    if (!colorScheme) {
      return {
        css: {
          ...rootCss
        },
        vars: rootVars
      };
    }
    return {
      css: {
        ...colorSchemesMap[colorScheme].css
      },
      vars: colorSchemesMap[colorScheme].vars
    };
  };
  return {
    vars: themeVars,
    generateCssVars
  };
}
var _default = prepareCssVars;
exports.default = _default;