import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import RadioButtonUncheckedIcon from '../internal/svg-icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '../internal/svg-icons/RadioButtonChecked';
import styled from '../styles/styled';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var RadioButtonIconRoot = styled('span')({
  position: 'relative',
  display: 'flex'
});
var RadioButtonIconBackground = styled(RadioButtonUncheckedIcon)({
  // Scale applied to prevent dot misalignment in Safari
  transform: 'scale(1)'
});
var RadioButtonIconDot = styled(RadioButtonCheckedIcon)(function (_ref) {
  var theme = _ref.theme,
    ownerState = _ref.ownerState;
  return _objectSpread({
    left: 0,
    position: 'absolute',
    transform: 'scale(0)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.shortest
    })
  }, ownerState.checked && {
    transform: 'scale(1)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shortest
    })
  });
});

/**
 * @ignore - internal component.
 */
function RadioButtonIcon(props) {
  var _props$checked = props.checked,
    checked = _props$checked === void 0 ? false : _props$checked,
    _props$classes = props.classes,
    classes = _props$classes === void 0 ? {} : _props$classes,
    fontSize = props.fontSize;
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    checked: checked
  });
  return /*#__PURE__*/_jsxs(RadioButtonIconRoot, {
    className: classes.root,
    ownerState: ownerState,
    children: [/*#__PURE__*/_jsx(RadioButtonIconBackground, {
      fontSize: fontSize,
      className: classes.background,
      ownerState: ownerState
    }), /*#__PURE__*/_jsx(RadioButtonIconDot, {
      fontSize: fontSize,
      className: classes.dot,
      ownerState: ownerState
    })]
  });
}
process.env.NODE_ENV !== "production" ? RadioButtonIcon.propTypes = {
  /**
   * If `true`, the component is checked.
   */
  checked: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * The size of the component.
   * `small` is equivalent to the dense radio styling.
   */
  fontSize: PropTypes.oneOf(['small', 'medium'])
} : void 0;
export default RadioButtonIcon;