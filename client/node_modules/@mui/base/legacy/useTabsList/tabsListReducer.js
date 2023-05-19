import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { listReducer, ListActionTypes, moveHighlight } from '../useList';
import { TabsListActionTypes } from './useTabsList.types';
export default function tabsListReducer(state, action) {
  if (action.type === TabsListActionTypes.valueChange) {
    return _objectSpread(_objectSpread({}, state), {}, {
      highlightedValue: action.value
    });
  }
  var newState = listReducer(state, action);
  var selectionFollowsFocus = action.context.selectionFollowsFocus;
  if (action.type === ListActionTypes.itemsChange) {
    if (newState.selectedValues.length > 0) {
      return _objectSpread(_objectSpread({}, newState), {}, {
        highlightedValue: newState.selectedValues[0]
      });
    }
    moveHighlight(null, 'reset', action.context);
  }
  if (selectionFollowsFocus && newState.highlightedValue != null) {
    return _objectSpread(_objectSpread({}, newState), {}, {
      selectedValues: [newState.highlightedValue]
    });
  }
  return newState;
}