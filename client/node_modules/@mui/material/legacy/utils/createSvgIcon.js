import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import SvgIcon from '../SvgIcon';

/**
 * Private module reserved for @mui packages.
 */
import { jsx as _jsx } from "react/jsx-runtime";
export default function createSvgIcon(path, displayName) {
  function Component(props, ref) {
    return /*#__PURE__*/_jsx(SvgIcon, _objectSpread(_objectSpread({
      "data-testid": "".concat(displayName, "Icon"),
      ref: ref
    }, props), {}, {
      children: path
    }));
  }
  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = "".concat(displayName, "Icon");
  }
  Component.muiName = SvgIcon.muiName;
  return /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(Component));
}