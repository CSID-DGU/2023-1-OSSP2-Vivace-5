import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import Typography from '../Typography';
import useThemeProps from '../styles/useThemeProps';
import styled from '../styles/styled';
import cardHeaderClasses, { getCardHeaderUtilityClass } from './cardHeaderClasses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['root'],
    avatar: ['avatar'],
    action: ['action'],
    content: ['content'],
    title: ['title'],
    subheader: ['subheader']
  };
  return composeClasses(slots, getCardHeaderUtilityClass, classes);
};
var CardHeaderRoot = styled('div', {
  name: 'MuiCardHeader',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    var _objectSpread2;
    return _objectSpread((_objectSpread2 = {}, _defineProperty(_objectSpread2, "& .".concat(cardHeaderClasses.title), styles.title), _defineProperty(_objectSpread2, "& .".concat(cardHeaderClasses.subheader), styles.subheader), _objectSpread2), styles.root);
  }
})({
  display: 'flex',
  alignItems: 'center',
  padding: 16
});
var CardHeaderAvatar = styled('div', {
  name: 'MuiCardHeader',
  slot: 'Avatar',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.avatar;
  }
})({
  display: 'flex',
  flex: '0 0 auto',
  marginRight: 16
});
var CardHeaderAction = styled('div', {
  name: 'MuiCardHeader',
  slot: 'Action',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.action;
  }
})({
  flex: '0 0 auto',
  alignSelf: 'flex-start',
  marginTop: -4,
  marginRight: -8,
  marginBottom: -4
});
var CardHeaderContent = styled('div', {
  name: 'MuiCardHeader',
  slot: 'Content',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.content;
  }
})({
  flex: '1 1 auto'
});
var CardHeader = /*#__PURE__*/React.forwardRef(function CardHeader(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiCardHeader'
  });
  var action = props.action,
    avatar = props.avatar,
    className = props.className,
    _props$component = props.component,
    component = _props$component === void 0 ? 'div' : _props$component,
    _props$disableTypogra = props.disableTypography,
    disableTypography = _props$disableTypogra === void 0 ? false : _props$disableTypogra,
    subheaderProp = props.subheader,
    subheaderTypographyProps = props.subheaderTypographyProps,
    titleProp = props.title,
    titleTypographyProps = props.titleTypographyProps,
    other = _objectWithoutProperties(props, ["action", "avatar", "className", "component", "disableTypography", "subheader", "subheaderTypographyProps", "title", "titleTypographyProps"]);
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    component: component,
    disableTypography: disableTypography
  });
  var classes = useUtilityClasses(ownerState);
  var title = titleProp;
  if (title != null && title.type !== Typography && !disableTypography) {
    title = /*#__PURE__*/_jsx(Typography, _objectSpread(_objectSpread({
      variant: avatar ? 'body2' : 'h5',
      className: classes.title,
      component: "span",
      display: "block"
    }, titleTypographyProps), {}, {
      children: title
    }));
  }
  var subheader = subheaderProp;
  if (subheader != null && subheader.type !== Typography && !disableTypography) {
    subheader = /*#__PURE__*/_jsx(Typography, _objectSpread(_objectSpread({
      variant: avatar ? 'body2' : 'body1',
      className: classes.subheader,
      color: "text.secondary",
      component: "span",
      display: "block"
    }, subheaderTypographyProps), {}, {
      children: subheader
    }));
  }
  return /*#__PURE__*/_jsxs(CardHeaderRoot, _objectSpread(_objectSpread({
    className: clsx(classes.root, className),
    as: component,
    ref: ref,
    ownerState: ownerState
  }, other), {}, {
    children: [avatar && /*#__PURE__*/_jsx(CardHeaderAvatar, {
      className: classes.avatar,
      ownerState: ownerState,
      children: avatar
    }), /*#__PURE__*/_jsxs(CardHeaderContent, {
      className: classes.content,
      ownerState: ownerState,
      children: [title, subheader]
    }), action && /*#__PURE__*/_jsx(CardHeaderAction, {
      className: classes.action,
      ownerState: ownerState,
      children: action
    })]
  }));
});
process.env.NODE_ENV !== "production" ? CardHeader.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The action to display in the card header.
   */
  action: PropTypes.node,
  /**
   * The Avatar element to display.
   */
  avatar: PropTypes.node,
  /**
   * @ignore
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
   * If `true`, `subheader` and `title` won't be wrapped by a Typography component.
   * This can be useful to render an alternative Typography variant by wrapping
   * the `title` text, and optional `subheader` text
   * with the Typography component.
   * @default false
   */
  disableTypography: PropTypes.bool,
  /**
   * The content of the component.
   */
  subheader: PropTypes.node,
  /**
   * These props will be forwarded to the subheader
   * (as long as disableTypography is not `true`).
   */
  subheaderTypographyProps: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * The content of the component.
   */
  title: PropTypes.node,
  /**
   * These props will be forwarded to the title
   * (as long as disableTypography is not `true`).
   */
  titleTypographyProps: PropTypes.object
} : void 0;
export default CardHeader;