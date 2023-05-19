"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSlotProps;
var _utils = require("@mui/utils");
var _appendOwnerState = _interopRequireDefault(require("./appendOwnerState"));
var _mergeSlotProps = _interopRequireDefault(require("./mergeSlotProps"));
var _resolveComponentProps = _interopRequireDefault(require("./resolveComponentProps"));
/**
 * @ignore - do not document.
 * Builds the props to be passed into the slot of an unstyled component.
 * It merges the internal props of the component with the ones supplied by the user, allowing to customize the behavior.
 * If the slot component is not a host component, it also merges in the `ownerState`.
 *
 * @param parameters.getSlotProps - A function that returns the props to be passed to the slot component.
 */
function useSlotProps(parameters) {
  var _parameters$additiona;
  const {
    elementType,
    externalSlotProps,
    ownerState,
    ...rest
  } = parameters;
  const resolvedComponentsProps = (0, _resolveComponentProps.default)(externalSlotProps, ownerState);
  const {
    props: mergedProps,
    internalRef
  } = (0, _mergeSlotProps.default)({
    ...rest,
    externalSlotProps: resolvedComponentsProps
  });
  const ref = (0, _utils.unstable_useForkRef)(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
  const props = (0, _appendOwnerState.default)(elementType, {
    ...mergedProps,
    ref
  }, ownerState);
  return props;
}