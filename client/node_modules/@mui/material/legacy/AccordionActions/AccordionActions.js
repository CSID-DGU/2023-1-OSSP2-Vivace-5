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
import { getAccordionActionsUtilityClass } from './accordionActionsClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    disableSpacing = ownerState.disableSpacing;
  var slots = {
    root: ['root', !disableSpacing && 'spacing']
  };
  return composeClasses(slots, getAccordionActionsUtilityClass, classes);
};
var AccordionActionsRoot = styled('div', {
  name: 'MuiAccordionActions',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    var ownerState = props.ownerState;
    return [styles.root, !ownerState.disableSpacing && styles.spacing];
  }
})(function (_ref) {
  var ownerState = _ref.ownerState;
  return _objectSpread({
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'flex-end'
  }, !ownerState.disableSpacing && {
    '& > :not(:first-of-type)': {
      marginLeft: 8
    }
  });
});
var AccordionActions = /*#__PURE__*/React.forwardRef(function AccordionActions(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiAccordionActions'
  });
  var className = props.className,
    _props$disableSpacing = props.disableSpacing,
    disableSpacing = _props$disableSpacing === void 0 ? false : _props$disableSpacing,
    other = _objectWithoutProperties(props, ["className", "disableSpacing"]);
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    disableSpacing: disableSpacing
  });
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(AccordionActionsRoot, _objectSpread({
    className: clsx(classes.root, className),
    ref: ref,
    ownerState: ownerState
  }, other));
});
process.env.NODE_ENV !== "production" ? AccordionActions.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
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
   * If `true`, the actions do not have additional margin.
   * @default false
   */
  disableSpacing: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export default AccordionActions;