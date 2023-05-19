import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import useThemeProps from '../styles/useThemeProps';
import styled from '../styles/styled';
import { html, body } from '../CssBaseline/CssBaseline';
import { getScopedCssBaselineUtilityClass } from './scopedCssBaselineClasses';
import { jsx as _jsx } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['root']
  };
  return composeClasses(slots, getScopedCssBaselineUtilityClass, classes);
};
var ScopedCssBaselineRoot = styled('div', {
  name: 'MuiScopedCssBaseline',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.root;
  }
})(function (_ref) {
  var theme = _ref.theme,
    ownerState = _ref.ownerState;
  var colorSchemeStyles = {};
  if (ownerState.enableColorScheme && theme.colorSchemes) {
    Object.entries(theme.colorSchemes).forEach(function (_ref2) {
      var _scheme$palette;
      var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        scheme = _ref3[1];
      colorSchemeStyles["&".concat(theme.getColorSchemeSelector(key).replace(/\s*&/, ''))] = {
        colorScheme: (_scheme$palette = scheme.palette) == null ? void 0 : _scheme$palette.mode
      };
    });
  }
  return _objectSpread(_objectSpread(_objectSpread({}, html(theme, ownerState.enableColorScheme)), body(theme)), {}, {
    '& *, & *::before, & *::after': {
      boxSizing: 'inherit'
    },
    '& strong, & b': {
      fontWeight: theme.typography.fontWeightBold
    }
  }, colorSchemeStyles);
});
var ScopedCssBaseline = /*#__PURE__*/React.forwardRef(function ScopedCssBaseline(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiScopedCssBaseline'
  });
  var className = props.className,
    _props$component = props.component,
    component = _props$component === void 0 ? 'div' : _props$component,
    enableColorScheme = props.enableColorScheme,
    other = _objectWithoutProperties(props, ["className", "component", "enableColorScheme"]);
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    component: component
  });
  var classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(ScopedCssBaselineRoot, _objectSpread({
    as: component,
    className: clsx(classes.root, className),
    ref: ref,
    ownerState: ownerState
  }, other));
});
process.env.NODE_ENV !== "production" ? ScopedCssBaseline.propTypes /* remove-proptypes */ = {
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
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * Enable `color-scheme` CSS property to use `theme.palette.mode`.
   * For more details, check out https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
   * For browser support, check out https://caniuse.com/?search=color-scheme
   */
  enableColorScheme: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export default ScopedCssBaseline;