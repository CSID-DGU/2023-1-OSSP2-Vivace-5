"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getOutlinedInputUtilityClass = getOutlinedInputUtilityClass;
var _utils = require("@mui/utils");
var _generateUtilityClass = _interopRequireDefault(require("../generateUtilityClass"));
var _InputBase = require("../InputBase");
function getOutlinedInputUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiOutlinedInput', slot);
}
const outlinedInputClasses = {
  ..._InputBase.inputBaseClasses,
  ...(0, _utils.unstable_generateUtilityClasses)('MuiOutlinedInput', ['root', 'notchedOutline', 'input'])
};
var _default = outlinedInputClasses;
exports.default = _default;