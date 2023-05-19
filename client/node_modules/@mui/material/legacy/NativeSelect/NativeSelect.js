import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import NativeSelectInput from './NativeSelectInput';
import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import ArrowDropDownIcon from '../internal/svg-icons/ArrowDropDown';
import Input from '../Input';
import useThemeProps from '../styles/useThemeProps';
import { getNativeSelectUtilityClasses } from './nativeSelectClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['root']
  };
  return composeClasses(slots, getNativeSelectUtilityClasses, classes);
};
var defaultInput = /*#__PURE__*/_jsx(Input, {});
/**
 * An alternative to `<Select native />` with a much smaller bundle size footprint.
 */
var NativeSelect = /*#__PURE__*/React.forwardRef(function NativeSelect(inProps, ref) {
  var props = useThemeProps({
    name: 'MuiNativeSelect',
    props: inProps
  });
  var className = props.className,
    children = props.children,
    _props$classes = props.classes,
    classesProp = _props$classes === void 0 ? {} : _props$classes,
    _props$IconComponent = props.IconComponent,
    IconComponent = _props$IconComponent === void 0 ? ArrowDropDownIcon : _props$IconComponent,
    _props$input = props.input,
    input = _props$input === void 0 ? defaultInput : _props$input,
    inputProps = props.inputProps,
    variant = props.variant,
    other = _objectWithoutProperties(props, ["className", "children", "classes", "IconComponent", "input", "inputProps", "variant"]);
  var muiFormControl = useFormControl();
  var fcs = formControlState({
    props: props,
    muiFormControl: muiFormControl,
    states: ['variant']
  });
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    classes: classesProp
  });
  var classes = useUtilityClasses(ownerState);
  var root = classesProp.root,
    otherClasses = _objectWithoutProperties(classesProp, ["root"]);
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: /*#__PURE__*/React.cloneElement(input, _objectSpread(_objectSpread({
      // Most of the logic is implemented in `NativeSelectInput`.
      // The `Select` component is a simple API wrapper to expose something better to play with.
      inputComponent: NativeSelectInput,
      inputProps: _objectSpread(_objectSpread({
        children: children,
        classes: otherClasses,
        IconComponent: IconComponent,
        variant: fcs.variant,
        type: undefined
      }, inputProps), input ? input.props.inputProps : {}),
      ref: ref
    }, other), {}, {
      className: clsx(classes.root, input.props.className, className)
    }))
  });
});
process.env.NODE_ENV !== "production" ? NativeSelect.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The option elements to populate the select with.
   * Can be some `<option>` elements.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * @default {}
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The icon that displays the arrow.
   * @default ArrowDropDownIcon
   */
  IconComponent: PropTypes.elementType,
  /**
   * An `Input` element; does not have to be a material-ui specific `Input`.
   * @default <Input />
   */
  input: PropTypes.element,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attributes) applied to the `select` element.
   */
  inputProps: PropTypes.object,
  /**
   * Callback fired when a menu item is selected.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange: PropTypes.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * The `input` value. The DOM API casts this to a string.
   */
  value: PropTypes.any,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['filled', 'outlined', 'standard'])
} : void 0;
NativeSelect.muiName = 'Select';
export default NativeSelect;