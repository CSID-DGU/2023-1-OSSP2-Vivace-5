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
import StepIcon from '../StepIcon';
import StepperContext from '../Stepper/StepperContext';
import StepContext from '../Step/StepContext';
import stepLabelClasses, { getStepLabelUtilityClass } from './stepLabelClasses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes,
    orientation = ownerState.orientation,
    active = ownerState.active,
    completed = ownerState.completed,
    error = ownerState.error,
    disabled = ownerState.disabled,
    alternativeLabel = ownerState.alternativeLabel;
  var slots = {
    root: ['root', orientation, error && 'error', disabled && 'disabled', alternativeLabel && 'alternativeLabel'],
    label: ['label', active && 'active', completed && 'completed', error && 'error', disabled && 'disabled', alternativeLabel && 'alternativeLabel'],
    iconContainer: ['iconContainer', active && 'active', completed && 'completed', error && 'error', disabled && 'disabled', alternativeLabel && 'alternativeLabel'],
    labelContainer: ['labelContainer', alternativeLabel && 'alternativeLabel']
  };
  return composeClasses(slots, getStepLabelUtilityClass, classes);
};
var StepLabelRoot = styled('span', {
  name: 'MuiStepLabel',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    var ownerState = props.ownerState;
    return [styles.root, styles[ownerState.orientation]];
  }
})(function (_ref) {
  var _objectSpread2;
  var ownerState = _ref.ownerState;
  return _objectSpread((_objectSpread2 = {
    display: 'flex',
    alignItems: 'center'
  }, _defineProperty(_objectSpread2, "&.".concat(stepLabelClasses.alternativeLabel), {
    flexDirection: 'column'
  }), _defineProperty(_objectSpread2, "&.".concat(stepLabelClasses.disabled), {
    cursor: 'default'
  }), _objectSpread2), ownerState.orientation === 'vertical' && {
    textAlign: 'left',
    padding: '8px 0'
  });
});
var StepLabelLabel = styled('span', {
  name: 'MuiStepLabel',
  slot: 'Label',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.label;
  }
})(function (_ref2) {
  var _objectSpread3;
  var theme = _ref2.theme;
  return _objectSpread(_objectSpread({}, theme.typography.body2), {}, (_objectSpread3 = {
    display: 'block',
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.shortest
    })
  }, _defineProperty(_objectSpread3, "&.".concat(stepLabelClasses.active), {
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: 500
  }), _defineProperty(_objectSpread3, "&.".concat(stepLabelClasses.completed), {
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: 500
  }), _defineProperty(_objectSpread3, "&.".concat(stepLabelClasses.alternativeLabel), {
    marginTop: 16
  }), _defineProperty(_objectSpread3, "&.".concat(stepLabelClasses.error), {
    color: (theme.vars || theme).palette.error.main
  }), _objectSpread3));
});
var StepLabelIconContainer = styled('span', {
  name: 'MuiStepLabel',
  slot: 'IconContainer',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.iconContainer;
  }
})(function () {
  return _defineProperty({
    flexShrink: 0,
    // Fix IE11 issue
    display: 'flex',
    paddingRight: 8
  }, "&.".concat(stepLabelClasses.alternativeLabel), {
    paddingRight: 0
  });
});
var StepLabelLabelContainer = styled('span', {
  name: 'MuiStepLabel',
  slot: 'LabelContainer',
  overridesResolver: function overridesResolver(props, styles) {
    return styles.labelContainer;
  }
})(function (_ref4) {
  var theme = _ref4.theme;
  return _defineProperty({
    width: '100%',
    color: (theme.vars || theme).palette.text.secondary
  }, "&.".concat(stepLabelClasses.alternativeLabel), {
    textAlign: 'center'
  });
});
var StepLabel = /*#__PURE__*/React.forwardRef(function StepLabel(inProps, ref) {
  var _slotProps$label;
  var props = useThemeProps({
    props: inProps,
    name: 'MuiStepLabel'
  });
  var children = props.children,
    className = props.className,
    _props$componentsProp = props.componentsProps,
    componentsProps = _props$componentsProp === void 0 ? {} : _props$componentsProp,
    _props$error = props.error,
    error = _props$error === void 0 ? false : _props$error,
    iconProp = props.icon,
    optional = props.optional,
    _props$slotProps = props.slotProps,
    slotProps = _props$slotProps === void 0 ? {} : _props$slotProps,
    StepIconComponentProp = props.StepIconComponent,
    StepIconProps = props.StepIconProps,
    other = _objectWithoutProperties(props, ["children", "className", "componentsProps", "error", "icon", "optional", "slotProps", "StepIconComponent", "StepIconProps"]);
  var _React$useContext = React.useContext(StepperContext),
    alternativeLabel = _React$useContext.alternativeLabel,
    orientation = _React$useContext.orientation;
  var _React$useContext2 = React.useContext(StepContext),
    active = _React$useContext2.active,
    disabled = _React$useContext2.disabled,
    completed = _React$useContext2.completed,
    iconContext = _React$useContext2.icon;
  var icon = iconProp || iconContext;
  var StepIconComponent = StepIconComponentProp;
  if (icon && !StepIconComponent) {
    StepIconComponent = StepIcon;
  }
  var ownerState = _objectSpread(_objectSpread({}, props), {}, {
    active: active,
    alternativeLabel: alternativeLabel,
    completed: completed,
    disabled: disabled,
    error: error,
    orientation: orientation
  });
  var classes = useUtilityClasses(ownerState);
  var labelSlotProps = (_slotProps$label = slotProps.label) != null ? _slotProps$label : componentsProps.label;
  return /*#__PURE__*/_jsxs(StepLabelRoot, _objectSpread(_objectSpread({
    className: clsx(classes.root, className),
    ref: ref,
    ownerState: ownerState
  }, other), {}, {
    children: [icon || StepIconComponent ? /*#__PURE__*/_jsx(StepLabelIconContainer, {
      className: classes.iconContainer,
      ownerState: ownerState,
      children: /*#__PURE__*/_jsx(StepIconComponent, _objectSpread({
        completed: completed,
        active: active,
        error: error,
        icon: icon
      }, StepIconProps))
    }) : null, /*#__PURE__*/_jsxs(StepLabelLabelContainer, {
      className: classes.labelContainer,
      ownerState: ownerState,
      children: [children ? /*#__PURE__*/_jsx(StepLabelLabel, _objectSpread(_objectSpread({
        ownerState: ownerState
      }, labelSlotProps), {}, {
        className: clsx(classes.label, labelSlotProps == null ? void 0 : labelSlotProps.className),
        children: children
      })) : null, optional]
    })]
  }));
});
process.env.NODE_ENV !== "production" ? StepLabel.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * In most cases will simply be a string containing a title for the label.
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
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps: PropTypes.shape({
    label: PropTypes.object
  }),
  /**
   * If `true`, the step is marked as failed.
   * @default false
   */
  error: PropTypes.bool,
  /**
   * Override the default label of the step icon.
   */
  icon: PropTypes.node,
  /**
   * The optional node to display.
   */
  optional: PropTypes.node,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.shape({
    label: PropTypes.object
  }),
  /**
   * The component to render in place of the [`StepIcon`](/material-ui/api/step-icon/).
   */
  StepIconComponent: PropTypes.elementType,
  /**
   * Props applied to the [`StepIcon`](/material-ui/api/step-icon/) element.
   */
  StepIconProps: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
StepLabel.muiName = 'StepLabel';
export default StepLabel;