import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import clsx from 'clsx';
import styled from '@mui/styled-engine';
import styleFunctionSx, { extendSxProp } from './styleFunctionSx';
import useTheme from './useTheme';
import { jsx as _jsx } from "react/jsx-runtime";
export default function createBox() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var themeId = options.themeId,
    defaultTheme = options.defaultTheme,
    _options$defaultClass = options.defaultClassName,
    defaultClassName = _options$defaultClass === void 0 ? 'MuiBox-root' : _options$defaultClass,
    generateClassName = options.generateClassName;
  var BoxRoot = styled('div', {
    shouldForwardProp: function shouldForwardProp(prop) {
      return prop !== 'theme' && prop !== 'sx' && prop !== 'as';
    }
  })(styleFunctionSx);
  var Box = /*#__PURE__*/React.forwardRef(function Box(inProps, ref) {
    var theme = useTheme(defaultTheme);
    var _extendSxProp = extendSxProp(inProps),
      className = _extendSxProp.className,
      _extendSxProp$compone = _extendSxProp.component,
      component = _extendSxProp$compone === void 0 ? 'div' : _extendSxProp$compone,
      other = _objectWithoutProperties(_extendSxProp, ["className", "component"]);
    return /*#__PURE__*/_jsx(BoxRoot, _objectSpread({
      as: component,
      ref: ref,
      className: clsx(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
      theme: themeId ? theme[themeId] || theme : theme
    }, other));
  });
  return Box;
}