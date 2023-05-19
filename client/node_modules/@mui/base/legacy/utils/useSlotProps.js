import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import appendOwnerState from './appendOwnerState';
import mergeSlotProps from './mergeSlotProps';
import resolveComponentProps from './resolveComponentProps';
/**
 * @ignore - do not document.
 * Builds the props to be passed into the slot of an unstyled component.
 * It merges the internal props of the component with the ones supplied by the user, allowing to customize the behavior.
 * If the slot component is not a host component, it also merges in the `ownerState`.
 *
 * @param parameters.getSlotProps - A function that returns the props to be passed to the slot component.
 */
export default function useSlotProps(parameters) {
  var _parameters$additiona;
  var elementType = parameters.elementType,
    externalSlotProps = parameters.externalSlotProps,
    ownerState = parameters.ownerState,
    rest = _objectWithoutProperties(parameters, ["elementType", "externalSlotProps", "ownerState"]);
  var resolvedComponentsProps = resolveComponentProps(externalSlotProps, ownerState);
  var _mergeSlotProps = mergeSlotProps(_objectSpread(_objectSpread({}, rest), {}, {
      externalSlotProps: resolvedComponentsProps
    })),
    mergedProps = _mergeSlotProps.props,
    internalRef = _mergeSlotProps.internalRef;
  var ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
  var props = appendOwnerState(elementType, _objectSpread(_objectSpread({}, mergedProps), {}, {
    ref: ref
  }), ownerState);
  return props;
}