import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styled from '../styles/styled';
import capitalize from '../utils/capitalize';
import { isHorizontal } from '../Drawer/Drawer';
import { jsx as _jsx } from "react/jsx-runtime";
var SwipeAreaRoot = styled('div')(function (_ref) {
  var theme = _ref.theme,
    ownerState = _ref.ownerState;
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread({
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: theme.zIndex.drawer - 1
  }, ownerState.anchor === 'left' && {
    right: 'auto'
  }), ownerState.anchor === 'right' && {
    left: 'auto',
    right: 0
  }), ownerState.anchor === 'top' && {
    bottom: 'auto',
    right: 0
  }), ownerState.anchor === 'bottom' && {
    top: 'auto',
    bottom: 0,
    right: 0
  });
});

/**
 * @ignore - internal component.
 */
var SwipeArea = /*#__PURE__*/React.forwardRef(function SwipeArea(props, ref) {
  var anchor = props.anchor,
    _props$classes = props.classes,
    classes = _props$classes === void 0 ? {} : _props$classes,
    className = props.className,
    width = props.width,
    style = props.style,
    other = _objectWithoutProperties(props, ["anchor", "classes", "className", "width", "style"]);
  var ownerState = props;
  return /*#__PURE__*/_jsx(SwipeAreaRoot, _objectSpread({
    className: clsx('PrivateSwipeArea-root', classes.root, classes["anchor".concat(capitalize(anchor))], className),
    ref: ref,
    style: _objectSpread(_defineProperty({}, isHorizontal(anchor) ? 'width' : 'height', width), style),
    ownerState: ownerState
  }, other));
});
process.env.NODE_ENV !== "production" ? SwipeArea.propTypes = {
  /**
   * Side on which to attach the discovery area.
   */
  anchor: PropTypes.oneOf(['left', 'top', 'right', 'bottom']).isRequired,
  /**
   * @ignore
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * @ignore
   */
  style: PropTypes.object,
  /**
   * The width of the left most (or right most) area in `px` where the
   * drawer can be swiped open from.
   */
  width: PropTypes.number.isRequired
} : void 0;
export default SwipeArea;