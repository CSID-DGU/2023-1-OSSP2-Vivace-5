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
import { getDialogContentUtilityClass } from './dialogContentClasses';
import dialogTitleClasses from '../DialogTitle/dialogTitleClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    dividers = ownerState.dividers;
  var slots = {
    root: ['root', dividers && 'dividers']
  };
  return composeClasses(slots, getDialogContentUtilityClass, classes);
};
var DialogContentRoot = styled('div', {
  name: 'MuiDialogContent',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    var ownerState = props.ownerState;
    return [styles.root, ownerState.dividers && styles.dividers];
  }
})(function (_ref) {
  var theme = _ref.theme,
    ownerState = _ref.ownerState;
  return _objectSpread({
    flex: '1 1 auto',
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: 'touch',
    overflowY: 'auto',
    padding: '20px 24px'
  }, ownerState.dividers ? {
    padding: '16px 24px',
    borderTop: "1px solid ".concat((theme.vars || theme).palette.divider),
    borderBottom: "1px solid ".concat((theme.vars || theme).palette.divider)
  } : _defineProperty({}, ".".concat(dialogTitleClasses.root, " + &"), {
    paddingTop: 0
  }));
});
var DialogContent = /*#__PURE__*/React.forwardRef(function DialogContent(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiDialogContent'
  });
  var className = props.className,
    _props$dividers = props.dividers,
    dividers = _props$dividers === void 0 ? false : _props$dividers,
    other = _objectWithoutProperties(props, ["className", "dividers"]);
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    dividers: dividers
  });
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(DialogContentRoot, _objectSpread({
    className: clsx(classes.root, className),
    ownerState: ownerState,
    ref: ref
  }, other));
});
process.env.NODE_ENV !== "production" ? DialogContent.propTypes /* remove-proptypes */ = {
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
   * Display the top and bottom dividers.
   * @default false
   */
  dividers: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export default DialogContent;