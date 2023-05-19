"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prepareCssVars = _interopRequireDefault(require("./prepareCssVars"));
function createCssVarsTheme(theme) {
  const {
    cssVarPrefix,
    shouldSkipGeneratingVar,
    ...otherTheme
  } = theme;
  return {
    ...theme,
    ...(0, _prepareCssVars.default)(otherTheme, {
      prefix: cssVarPrefix,
      shouldSkipGeneratingVar
    })
  };
}
var _default = createCssVarsTheme;
exports.default = _default;