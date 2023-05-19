import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import styled from '../styles/styled';
import useThemeProps from '../styles/useThemeProps';
import ButtonBase from '../ButtonBase';
import StepLabel from '../StepLabel';
import isMuiElement from '../utils/isMuiElement';
import StepperContext from '../Stepper/StepperContext';
import StepContext from '../Step/StepContext';
import stepButtonClasses, { getStepButtonUtilityClass } from './stepButtonClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    orientation = ownerState.orientation;
  var slots = {
    root: ['root', orientation],
    touchRipple: ['touchRipple']
  };
  return composeClasses(slots, getStepButtonUtilityClass, classes);
};
var StepButtonRoot = styled(ButtonBase, {
  name: 'MuiStepButton',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    var ownerState = props.ownerState;
    return [_defineProperty({}, "& .".concat(stepButtonClasses.touchRipple), styles.touchRipple), styles.root, styles[ownerState.orientation]];
  }
})(function (_ref2) {
  var ownerState = _ref2.ownerState;
  return _objectSpread(_objectSpread({
    width: '100%',
    padding: '24px 16px',
    margin: '-24px -16px',
    boxSizing: 'content-box'
  }, ownerState.orientation === 'vertical' && {
    justifyContent: 'flex-start',
    padding: '8px',
    margin: '-8px'
  }), {}, _defineProperty({}, "& .".concat(stepButtonClasses.touchRipple), {
    color: 'rgba(0, 0, 0, 0.3)'
  }));
});
var StepButton = /*#__PURE__*/React.forwardRef(function StepButton(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiStepButton'
  });
  var children = props.children,
    className = props.className,
    icon = props.icon,
    optional = props.optional,
    other = _objectWithoutProperties(props, ["children", "className", "icon", "optional"]);
  var _React$useContext = React.useContext(StepContext),
    disabled = _React$useContext.disabled,
    active = _React$useContext.active;
  var _React$useContext2 = React.useContext(StepperContext),
    orientation = _React$useContext2.orientation;
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    orientation: orientation
  });
  var classes = useUtilityClasses(ownerState);
  var childProps = {
    icon: icon,
    optional: optional
  };
  var child = isMuiElement(children, ['StepLabel']) ? /*#__PURE__*/React.cloneElement(children, childProps) : /*#__PURE__*/_jsx(StepLabel, _objectSpread(_objectSpread({}, childProps), {}, {
    children: children
  }));
  return /*#__PURE__*/_jsx(StepButtonRoot, _objectSpread(_objectSpread({
    focusRipple: true,
    disabled: disabled,
    TouchRippleProps: {
      className: classes.touchRipple
    },
    className: clsx(classes.root, className),
    ref: ref,
    ownerState: ownerState,
    "aria-current": active ? 'step' : undefined
  }, other), {}, {
    children: child
  }));
});
process.env.NODE_ENV !== "production" ? StepButton.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * Can be a `StepLabel` or a node to place inside `StepLabel` as children.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The icon displayed by the step label.
   */
  icon: PropTypes.node,
  /**
   * The optional node to display.
   */
  optional: PropTypes.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export default StepButton;