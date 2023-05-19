"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = require("@mui/utils");
var _createBreakpoints = _interopRequireDefault(require("./createBreakpoints"));
var _shape = _interopRequireDefault(require("./shape"));
var _createSpacing = _interopRequireDefault(require("./createSpacing"));
var _styleFunctionSx = _interopRequireDefault(require("../styleFunctionSx/styleFunctionSx"));
var _defaultSxConfig = _interopRequireDefault(require("../styleFunctionSx/defaultSxConfig"));
function createTheme(options = {}, ...args) {
  const {
    breakpoints: breakpointsInput = {},
    palette: paletteInput = {},
    spacing: spacingInput,
    shape: shapeInput = {},
    ...other
  } = options;
  const breakpoints = (0, _createBreakpoints.default)(breakpointsInput);
  const spacing = (0, _createSpacing.default)(spacingInput);
  let muiTheme = (0, _utils.deepmerge)({
    breakpoints,
    direction: 'ltr',
    components: {},
    // Inject component definitions.
    palette: {
      mode: 'light',
      ...paletteInput
    },
    spacing,
    shape: {
      ..._shape.default,
      ...shapeInput
    }
  }, other);
  muiTheme = args.reduce((acc, argument) => (0, _utils.deepmerge)(acc, argument), muiTheme);
  muiTheme.unstable_sxConfig = {
    ..._defaultSxConfig.default,
    ...(other == null ? void 0 : other.unstable_sxConfig)
  };
  muiTheme.unstable_sx = function sx(props) {
    return (0, _styleFunctionSx.default)({
      sx: props,
      theme: this
    });
  };
  return muiTheme;
}
var _default = createTheme;
exports.default = _default;