"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getInputUtilityClass = getInputUtilityClass;
var _utils = require("@mui/utils");
var _generateUtilityClass = _interopRequireDefault(require("../generateUtilityClass"));
var _InputBase = require("../InputBase");
function getInputUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiInput', slot);
}
const inputClasses = {
  ..._InputBase.inputBaseClasses,
  ...(0, _utils.unstable_generateUtilityClasses)('MuiInput', ['root', 'underline', 'input'])
};
var _default = inputClasses;
exports.default = _default;