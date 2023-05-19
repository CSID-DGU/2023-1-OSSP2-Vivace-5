import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import { unstable_useControlled as useControlled } from '@mui/utils';
import { useCompoundParent } from '../utils/useCompound';
/**
 *
 * Demos:
 *
 * - [Tabs](https://mui.com/base/react-tabs/#hooks)
 *
 * API:
 *
 * - [useTabs API](https://mui.com/base/react-tabs/hooks-api/#use-tabs)
 */
function useTabs(parameters) {
  var valueProp = parameters.value,
    defaultValue = parameters.defaultValue,
    onChange = parameters.onChange,
    orientation = parameters.orientation,
    direction = parameters.direction,
    selectionFollowsFocus = parameters.selectionFollowsFocus;
  var _useControlled = useControlled({
      controlled: valueProp,
      default: defaultValue,
      name: 'Tabs',
      state: 'value'
    }),
    _useControlled2 = _slicedToArray(_useControlled, 2),
    value = _useControlled2[0],
    setValue = _useControlled2[1];
  var onSelected = React.useCallback(function (event, newValue) {
    setValue(newValue);
    onChange == null ? void 0 : onChange(event, newValue);
  }, [onChange, setValue]);
  var _useCompoundParent = useCompoundParent(),
    tabPanels = _useCompoundParent.subitems,
    compoundComponentContextValue = _useCompoundParent.contextValue;
  var tabIdLookup = React.useRef(function () {
    return undefined;
  });
  var getTabPanelId = React.useCallback(function (tabValue) {
    return tabPanels.get(tabValue);
  }, [tabPanels]);
  var getTabId = React.useCallback(function (tabPanelId) {
    return tabIdLookup.current(tabPanelId);
  }, []);
  var registerTabIdLookup = React.useCallback(function (lookupFunction) {
    tabIdLookup.current = lookupFunction;
  }, []);
  return {
    contextValue: _objectSpread({
      direction: direction,
      getTabId: getTabId,
      getTabPanelId: getTabPanelId,
      onSelected: onSelected,
      orientation: orientation,
      registerTabIdLookup: registerTabIdLookup,
      selectionFollowsFocus: selectionFollowsFocus,
      value: value
    }, compoundComponentContextValue)
  };
}
export default useTabs;