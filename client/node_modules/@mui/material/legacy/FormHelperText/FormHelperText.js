import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _span;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import styled from '../styles/styled';
import capitalize from '../utils/capitalize';
import formHelperTextClasses, { getFormHelperTextUtilityClasses } from './formHelperTextClasses';
import useThemeProps from '../styles/useThemeProps';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    contained = ownerState.contained,
    size = ownerState.size,
    disabled = ownerState.disabled,
    error = ownerState.error,
    filled = ownerState.filled,
    focused = ownerState.focused,
    required = ownerState.required;
  var slots = {
    root: ['root', disabled && 'disabled', error && 'error', size && "size".concat(capitalize(size)), contained && 'contained', focused && 'focused', filled && 'filled', required && 'required']
  };
  return composeClasses(slots, getFormHelperTextUtilityClasses, classes);
};
var FormHelperTextRoot = styled('p', {
  name: 'MuiFormHelperText',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    var ownerState = props.ownerState;
    return [styles.root, ownerState.size && styles["size".concat(capitalize(ownerState.size))], ownerState.contained && styles.contained, ownerState.filled && styles.filled];
  }
})(function (_ref) {
  var _objectSpread2;
  var theme = _ref.theme,
    ownerState = _ref.ownerState;
  return _objectSpread(_objectSpread(_objectSpread({
    color: (theme.vars || theme).palette.text.secondary
  }, theme.typography.caption), {}, (_objectSpread2 = {
    textAlign: 'left',
    marginTop: 3,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  }, _defineProperty(_objectSpread2, "&.".concat(formHelperTextClasses.disabled), {
    color: (theme.vars || theme).palette.text.disabled
  }), _defineProperty(_objectSpread2, "&.".concat(formHelperTextClasses.error), {
    color: (theme.vars || theme).palette.error.main
  }), _objectSpread2), ownerState.size === 'small' && {
    marginTop: 4
  }), ownerState.contained && {
    marginLeft: 14,
    marginRight: 14
  });
});
var FormHelperText = /*#__PURE__*/React.forwardRef(function FormHelperText(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiFormHelperText'
  });
  var children = props.children,
    className = props.className,
    _props$component = props.component,
    component = _props$component === void 0 ? 'p' : _props$component,
    disabled = props.disabled,
    error = props.error,
    filled = props.filled,
    focused = props.focused,
    margin = props.margin,
    required = props.required,
    variant = props.variant,
    other = _objectWithoutProperties(props, ["children", "className", "component", "disabled", "error", "filled", "focused", "margin", "required", "variant"]);
  var muiFormControl = useFormControl();
  var fcs = formControlState({
    props: props,
    muiFormControl: muiFormControl,
    states: ['variant', 'size', 'disabled', 'error', 'filled', 'focused', 'required']
  });
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    component: component,
    contained: fcs.variant === 'filled' || fcs.variant === 'outlined',
    variant: fcs.variant,
    size: fcs.size,
    disabled: fcs.disabled,
    error: fcs.error,
    filled: fcs.filled,
    focused: fcs.focused,
    required: fcs.required
  });
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(FormHelperTextRoot, _objectSpread(_objectSpread({
    as: component,
    ownerState: ownerState,
    className: clsx(classes.root, className),
    ref: ref
  }, other), {}, {
    children: children === ' ' ? // notranslate needed while Google Translate will not fix zero-width space issue
    _span || (_span = /*#__PURE__*/_jsx("span", {
      className: "notranslate",
      children: "\u200B"
    })) : children
  }));
});
process.env.NODE_ENV !== "production" ? FormHelperText.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   *
   * If `' '` is provided, the component reserves one line height for displaying a future message.
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
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the helper text should be displayed in a disabled state.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, helper text should be displayed in an error state.
   */
  error: PropTypes.bool,
  /**
   * If `true`, the helper text should use filled classes key.
   */
  filled: PropTypes.bool,
  /**
   * If `true`, the helper text should use focused classes key.
   */
  focused: PropTypes.bool,
  /**
   * If `dense`, will adjust vertical spacing. This is normally obtained via context from
   * FormControl.
   */
  margin: PropTypes.oneOf(['dense']),
  /**
   * If `true`, the helper text should use required classes key.
   */
  required: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * The variant to use.
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['filled', 'outlined', 'standard']), PropTypes.string])
} : void 0;
export default FormHelperText;