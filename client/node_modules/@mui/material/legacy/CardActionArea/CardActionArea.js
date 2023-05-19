import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import useThemeProps from '../styles/useThemeProps';
import styled from '../styles/styled';
import cardActionAreaClasses, { getCardActionAreaUtilityClass } from './cardActionAreaClasses';
import ButtonBase from '../ButtonBase';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['root'],
    focusHighlight: ['focusHighlight']
  };
  return composeClasses(slots, getCardActionAreaUtilityClass, classes);
};
var CardActionAreaRoot = styled(ButtonBase, {
  name: 'MuiCardActionArea',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.root;
  }
})(function (_ref) {
  var _ref2;
  var theme = _ref.theme;
  return _ref2 = {
    display: 'block',
    textAlign: 'inherit',
    borderRadius: 'inherit',
    // for Safari to work https://github.com/mui/material-ui/issues/36285.
    width: '100%'
  }, _defineProperty(_ref2, "&:hover .".concat(cardActionAreaClasses.focusHighlight), {
    opacity: (theme.vars || theme).palette.action.hoverOpacity,
    '@media (hover: none)': {
      opacity: 0
    }
  }), _defineProperty(_ref2, "&.".concat(cardActionAreaClasses.focusVisible, " .").concat(cardActionAreaClasses.focusHighlight), {
    opacity: (theme.vars || theme).palette.action.focusOpacity
  }), _ref2;
});
var CardActionAreaFocusHighlight = styled('span', {
  name: 'MuiCardActionArea',
  slot: 'FocusHighlight',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.focusHighlight;
  }
})(function (_ref3) {
  var theme = _ref3.theme;
  return {
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 'inherit',
    opacity: 0,
    backgroundColor: 'currentcolor',
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.short
    })
  };
});
var CardActionArea = /*#__PURE__*/React.forwardRef(function CardActionArea(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiCardActionArea'
  });
  var children = props.children,
    className = props.className,
    focusVisibleClassName = props.focusVisibleClassName,
    other = _objectWithoutProperties(props, ["children", "className", "focusVisibleClassName"]);
  var ownerState = props;
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsxs(CardActionAreaRoot, _objectSpread(_objectSpread({
    className: clsx(classes.root, className),
    focusVisibleClassName: clsx(focusVisibleClassName, classes.focusVisible),
    ref: ref,
    ownerState: ownerState
  }, other), {}, {
    children: [children, /*#__PURE__*/_jsx(CardActionAreaFocusHighlight, {
      className: classes.focusHighlight,
      ownerState: ownerState
    })]
  }));
});
process.env.NODE_ENV !== "production" ? CardActionArea.propTypes /* remove-proptypes */ = {
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
   * @ignore
   */
  focusVisibleClassName: PropTypes.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export default CardActionArea;