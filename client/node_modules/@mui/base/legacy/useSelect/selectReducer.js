import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { moveHighlight, listReducer, ListActionTypes } from '../useList';
import { SelectActionTypes } from './useSelect.types';
export default function selectReducer(state, action) {
  var open = state.open;
  var selectionMode = action.context.selectionMode;
  if (action.type === SelectActionTypes.buttonClick) {
    var _state$selectedValues;
    var itemToHighlight = (_state$selectedValues = state.selectedValues[0]) != null ? _state$selectedValues : moveHighlight(null, 'start', action.context);
    return _objectSpread(_objectSpread({}, state), {}, {
      open: !open,
      highlightedValue: !open ? itemToHighlight : null
    });
  }
  var newState = listReducer(state, action);
  switch (action.type) {
    case ListActionTypes.keyDown:
      if (state.open) {
        if (action.event.key === 'Escape') {
          return _objectSpread(_objectSpread({}, newState), {}, {
            open: false
          });
        }
        if (selectionMode === 'single' && (action.event.key === 'Enter' || action.event.key === ' ')) {
          return _objectSpread(_objectSpread({}, newState), {}, {
            open: false
          });
        }
      } else {
        if (action.event.key === 'Enter' || action.event.key === ' ' || action.event.key === 'ArrowDown') {
          var _state$selectedValues2;
          return _objectSpread(_objectSpread({}, state), {}, {
            open: true,
            highlightedValue: (_state$selectedValues2 = state.selectedValues[0]) != null ? _state$selectedValues2 : moveHighlight(null, 'start', action.context)
          });
        }
        if (action.event.key === 'ArrowUp') {
          var _state$selectedValues3;
          return _objectSpread(_objectSpread({}, state), {}, {
            open: true,
            highlightedValue: (_state$selectedValues3 = state.selectedValues[0]) != null ? _state$selectedValues3 : moveHighlight(null, 'end', action.context)
          });
        }
      }
      break;
    case ListActionTypes.itemClick:
      if (selectionMode === 'single') {
        return _objectSpread(_objectSpread({}, newState), {}, {
          open: false
        });
      }
      break;
    case ListActionTypes.blur:
      return _objectSpread(_objectSpread({}, newState), {}, {
        open: false
      });
    default:
      return newState;
  }
  return newState;
}