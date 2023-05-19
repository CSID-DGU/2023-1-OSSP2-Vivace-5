"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = menuReducer;
var _useList = require("../useList");
function menuReducer(state, action) {
  if (action.type === _useList.ListActionTypes.itemHover) {
    return state;
  }
  const newState = (0, _useList.listReducer)(state, action);

  // make sure an item is always highlighted
  if (newState.highlightedValue === null && action.context.items.length > 0) {
    return {
      ...newState,
      highlightedValue: action.context.items[0]
    };
  }
  if (action.type === _useList.ListActionTypes.keyDown) {
    if (action.event.key === 'Escape') {
      return {
        ...newState,
        open: false
      };
    }
  }
  if (action.type === _useList.ListActionTypes.blur) {
    var _action$context$listb;
    if (!((_action$context$listb = action.context.listboxRef.current) != null && _action$context$listb.contains(action.event.relatedTarget))) {
      return {
        ...newState,
        open: false,
        highlightedValue: action.context.items[0]
      };
    }
  }
  return newState;
}