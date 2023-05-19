import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import { unstable_useForkRef as useForkRef, unstable_useId as useId } from '@mui/utils';
import { useListItem } from '../useList';
import { useCompoundItem } from '../utils/useCompoundItem';

/**
 *
 * Demos:
 *
 * - [Select](https://mui.com/base/react-select/#hooks)
 *
 * API:
 *
 * - [useOption API](https://mui.com/base/react-select/hooks-api/#use-option)
 */
export default function useOption(params) {
  var value = params.value,
    label = params.label,
    disabled = params.disabled,
    optionRefParam = params.rootRef,
    idParam = params.id;
  var _useListItem = useListItem({
      item: value
    }),
    getListItemProps = _useListItem.getRootProps,
    listItemRefHandler = _useListItem.rootRef,
    highlighted = _useListItem.highlighted,
    selected = _useListItem.selected;
  var id = useId(idParam);
  var optionRef = React.useRef(null);
  var selectOption = React.useMemo(function () {
    return {
      disabled: disabled,
      label: label,
      value: value,
      ref: optionRef,
      id: id
    };
  }, [disabled, label, value, id]);
  var _useCompoundItem = useCompoundItem(value, selectOption),
    index = _useCompoundItem.index;
  var handleRef = useForkRef(optionRefParam, optionRef, listItemRefHandler);
  return {
    getRootProps: function getRootProps() {
      var otherHandlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread(_objectSpread(_objectSpread({}, otherHandlers), getListItemProps(otherHandlers)), {}, {
        id: id,
        ref: handleRef,
        role: 'option',
        'aria-selected': selected
      });
    },
    highlighted: highlighted,
    index: index,
    selected: selected,
    rootRef: handleRef
  };
}