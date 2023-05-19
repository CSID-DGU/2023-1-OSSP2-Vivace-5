import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '../composeClasses';
import { getOptionGroupUtilityClass } from './optionGroupClasses';
import { useSlotProps } from '../utils';
import { useClassNamesOverride } from '../utils/ClassNameConfigurator';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function useUtilityClasses(disabled) {
  var slots = {
    root: ['root', disabled && 'disabled'],
    label: ['label'],
    list: ['list']
  };
  return composeClasses(slots, useClassNamesOverride(getOptionGroupUtilityClass));
}

/**
 * An unstyled option group to be used within a Select.
 *
 * Demos:
 *
 * - [Select](https://mui.com/base/react-select/)
 *
 * API:
 *
 * - [OptionGroup API](https://mui.com/base/react-select/components-api/#option-group)
 */
var OptionGroup = /*#__PURE__*/React.forwardRef(function OptionGroup(props, forwardedRef) {
  var _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    _props$slotProps = props.slotProps,
    slotProps = _props$slotProps === void 0 ? {} : _props$slotProps,
    _props$slots = props.slots,
    slots = _props$slots === void 0 ? {} : _props$slots,
    other = _objectWithoutProperties(props, ["disabled", "slotProps", "slots"]);
  var Root = (slots == null ? void 0 : slots.root) || 'li';
  var Label = (slots == null ? void 0 : slots.label) || 'span';
  var List = (slots == null ? void 0 : slots.list) || 'ul';
  var classes = useUtilityClasses(disabled);
  var rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: forwardedRef
    },
    ownerState: props,
    className: classes.root
  });
  var labelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps.label,
    ownerState: props,
    className: classes.label
  });
  var listProps = useSlotProps({
    elementType: List,
    externalSlotProps: slotProps.list,
    ownerState: props,
    className: classes.list
  });
  return /*#__PURE__*/_jsxs(Root, _objectSpread(_objectSpread({}, rootProps), {}, {
    children: [/*#__PURE__*/_jsx(Label, _objectSpread(_objectSpread({}, labelProps), {}, {
      children: props.label
    })), /*#__PURE__*/_jsx(List, _objectSpread(_objectSpread({}, listProps), {}, {
      children: props.children
    }))]
  }));
});
process.env.NODE_ENV !== "production" ? OptionGroup.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * If `true` all the options in the group will be disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * The human-readable description of the group.
   */
  label: PropTypes.node,
  /**
   * The props used for each slot inside the Input.
   * @default {}
   */
  slotProps: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    list: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  }),
  /**
   * The components used for each slot inside the OptionGroup.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  slots: PropTypes.shape({
    label: PropTypes.elementType,
    list: PropTypes.elementType,
    root: PropTypes.elementType
  })
} : void 0;
export default OptionGroup;