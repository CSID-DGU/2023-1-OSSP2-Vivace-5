import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '../composeClasses';
import { getButtonUtilityClass } from './buttonClasses';
import useButton from '../useButton';
import { useSlotProps } from '../utils';
import { useClassNamesOverride } from '../utils/ClassNameConfigurator';
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    active,
    disabled,
    focusVisible
  } = ownerState;
  const slots = {
    root: ['root', disabled && 'disabled', focusVisible && 'focusVisible', active && 'active']
  };
  return composeClasses(slots, useClassNamesOverride(getButtonUtilityClass));
};
/**
 * The foundation for building custom-styled buttons.
 *
 * Demos:
 *
 * - [Button](https://mui.com/base/react-button/)
 *
 * API:
 *
 * - [Button API](https://mui.com/base/react-button/components-api/#button)
 */
const Button = /*#__PURE__*/React.forwardRef(function Button(props, forwardedRef) {
  const {
    action,
    children,
    disabled,
    focusableWhenDisabled = false,
    onFocusVisible,
    slotProps = {},
    slots = {},
    ...other
  } = props;
  const buttonRef = React.useRef();
  const {
    active,
    focusVisible,
    setFocusVisible,
    getRootProps
  } = useButton({
    ...props,
    focusableWhenDisabled
  });
  React.useImperativeHandle(action, () => ({
    focusVisible: () => {
      setFocusVisible(true);
      buttonRef.current.focus();
    }
  }), [setFocusVisible]);
  const ownerState = {
    ...props,
    active,
    focusableWhenDisabled,
    focusVisible
  };
  const classes = useUtilityClasses(ownerState);
  const defaultElement = other.href || other.to ? 'a' : 'button';
  const Root = slots.root ?? defaultElement;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    externalSlotProps: slotProps.root,
    additionalProps: {
      ref: forwardedRef
    },
    ownerState,
    className: classes.root
  });
  return /*#__PURE__*/_jsx(Root, {
    ...rootProps,
    children: children
  });
});
process.env.NODE_ENV !== "production" ? Button.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A ref for imperative actions. It currently only supports `focusVisible()` action.
   */
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.shape({
      focusVisible: PropTypes.func.isRequired
    })
  })]),
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, allows a disabled button to receive focus.
   * @default false
   */
  focusableWhenDisabled: PropTypes.bool,
  /**
   * @ignore
   */
  href: PropTypes.string,
  /**
   * @ignore
   */
  onFocusVisible: PropTypes.func,
  /**
   * The props used for each slot inside the Button.
   * @default {}
   */
  slotProps: PropTypes.shape({
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  }),
  /**
   * The components used for each slot inside the Button.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  slots: PropTypes.shape({
    root: PropTypes.elementType
  }),
  /**
   * @ignore
   */
  to: PropTypes.string
} : void 0;
export default Button;