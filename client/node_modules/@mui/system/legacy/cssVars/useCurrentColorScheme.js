import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import * as React from 'react';
import { DEFAULT_MODE_STORAGE_KEY, DEFAULT_COLOR_SCHEME_STORAGE_KEY } from './getInitColorSchemeScript';
export function getSystemMode(mode) {
  if (typeof window !== 'undefined' && mode === 'system') {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (mql.matches) {
      return 'dark';
    }
    return 'light';
  }
  return undefined;
}
function processState(state, callback) {
  if (state.mode === 'light' || state.mode === 'system' && state.systemMode === 'light') {
    return callback('light');
  }
  if (state.mode === 'dark' || state.mode === 'system' && state.systemMode === 'dark') {
    return callback('dark');
  }
  return undefined;
}
export function getColorScheme(state) {
  return processState(state, function (mode) {
    if (mode === 'light') {
      return state.lightColorScheme;
    }
    if (mode === 'dark') {
      return state.darkColorScheme;
    }
    return undefined;
  });
}
function initializeValue(key, defaultValue) {
  if (typeof window === 'undefined') {
    return undefined;
  }
  var value;
  try {
    value = localStorage.getItem(key) || undefined;
    if (!value) {
      // the first time that user enters the site.
      localStorage.setItem(key, defaultValue);
    }
  } catch (e) {
    // Unsupported
  }
  return value || defaultValue;
}
export default function useCurrentColorScheme(options) {
  var _options$defaultMode = options.defaultMode,
    defaultMode = _options$defaultMode === void 0 ? 'light' : _options$defaultMode,
    defaultLightColorScheme = options.defaultLightColorScheme,
    defaultDarkColorScheme = options.defaultDarkColorScheme,
    _options$supportedCol = options.supportedColorSchemes,
    supportedColorSchemes = _options$supportedCol === void 0 ? [] : _options$supportedCol,
    _options$modeStorageK = options.modeStorageKey,
    modeStorageKey = _options$modeStorageK === void 0 ? DEFAULT_MODE_STORAGE_KEY : _options$modeStorageK,
    _options$colorSchemeS = options.colorSchemeStorageKey,
    colorSchemeStorageKey = _options$colorSchemeS === void 0 ? DEFAULT_COLOR_SCHEME_STORAGE_KEY : _options$colorSchemeS,
    _options$storageWindo = options.storageWindow,
    storageWindow = _options$storageWindo === void 0 ? typeof window === 'undefined' ? undefined : window : _options$storageWindo;
  var joinedColorSchemes = supportedColorSchemes.join(',');
  var _React$useState = React.useState(function () {
      var initialMode = initializeValue(modeStorageKey, defaultMode);
      var lightColorScheme = initializeValue("".concat(colorSchemeStorageKey, "-light"), defaultLightColorScheme);
      var darkColorScheme = initializeValue("".concat(colorSchemeStorageKey, "-dark"), defaultDarkColorScheme);
      return {
        mode: initialMode,
        systemMode: getSystemMode(initialMode),
        lightColorScheme: lightColorScheme,
        darkColorScheme: darkColorScheme
      };
    }),
    state = _React$useState[0],
    setState = _React$useState[1];
  var colorScheme = getColorScheme(state);
  var setMode = React.useCallback(function (mode) {
    setState(function (currentState) {
      if (mode === currentState.mode) {
        // do nothing if mode does not change
        return currentState;
      }
      var newMode = !mode ? defaultMode : mode;
      try {
        localStorage.setItem(modeStorageKey, newMode);
      } catch (e) {
        // Unsupported
      }
      return _objectSpread(_objectSpread({}, currentState), {}, {
        mode: newMode,
        systemMode: getSystemMode(newMode)
      });
    });
  }, [modeStorageKey, defaultMode]);
  var setColorScheme = React.useCallback(function (value) {
    if (!value) {
      setState(function (currentState) {
        try {
          localStorage.setItem("".concat(colorSchemeStorageKey, "-light"), defaultLightColorScheme);
          localStorage.setItem("".concat(colorSchemeStorageKey, "-dark"), defaultDarkColorScheme);
        } catch (e) {
          // Unsupported
        }
        return _objectSpread(_objectSpread({}, currentState), {}, {
          lightColorScheme: defaultLightColorScheme,
          darkColorScheme: defaultDarkColorScheme
        });
      });
    } else if (typeof value === 'string') {
      if (value && !joinedColorSchemes.includes(value)) {
        console.error("`".concat(value, "` does not exist in `theme.colorSchemes`."));
      } else {
        setState(function (currentState) {
          var newState = _objectSpread({}, currentState);
          processState(currentState, function (mode) {
            try {
              localStorage.setItem("".concat(colorSchemeStorageKey, "-").concat(mode), value);
            } catch (e) {
              // Unsupported
            }
            if (mode === 'light') {
              newState.lightColorScheme = value;
            }
            if (mode === 'dark') {
              newState.darkColorScheme = value;
            }
          });
          return newState;
        });
      }
    } else {
      setState(function (currentState) {
        var newState = _objectSpread({}, currentState);
        var newLightColorScheme = value.light === null ? defaultLightColorScheme : value.light;
        var newDarkColorScheme = value.dark === null ? defaultDarkColorScheme : value.dark;
        if (newLightColorScheme) {
          if (!joinedColorSchemes.includes(newLightColorScheme)) {
            console.error("`".concat(newLightColorScheme, "` does not exist in `theme.colorSchemes`."));
          } else {
            newState.lightColorScheme = newLightColorScheme;
            try {
              localStorage.setItem("".concat(colorSchemeStorageKey, "-light"), newLightColorScheme);
            } catch (error) {
              // Unsupported
            }
          }
        }
        if (newDarkColorScheme) {
          if (!joinedColorSchemes.includes(newDarkColorScheme)) {
            console.error("`".concat(newDarkColorScheme, "` does not exist in `theme.colorSchemes`."));
          } else {
            newState.darkColorScheme = newDarkColorScheme;
            try {
              localStorage.setItem("".concat(colorSchemeStorageKey, "-dark"), newDarkColorScheme);
            } catch (error) {
              // Unsupported
            }
          }
        }
        return newState;
      });
    }
  }, [joinedColorSchemes, colorSchemeStorageKey, defaultLightColorScheme, defaultDarkColorScheme]);
  var handleMediaQuery = React.useCallback(function (e) {
    if (state.mode === 'system') {
      setState(function (currentState) {
        return _objectSpread(_objectSpread({}, currentState), {}, {
          systemMode: e != null && e.matches ? 'dark' : 'light'
        });
      });
    }
  }, [state.mode]);

  // Ref hack to avoid adding handleMediaQuery as a dep
  var mediaListener = React.useRef(handleMediaQuery);
  mediaListener.current = handleMediaQuery;
  React.useEffect(function () {
    var handler = function handler() {
      return mediaListener.current.apply(mediaListener, arguments);
    };

    // Always listen to System preference
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handler);
    handler(media);
    return function () {
      return media.removeListener(handler);
    };
  }, []);

  // Handle when localStorage has changed
  React.useEffect(function () {
    var handleStorage = function handleStorage(event) {
      var value = event.newValue;
      if (typeof event.key === 'string' && event.key.startsWith(colorSchemeStorageKey) && (!value || joinedColorSchemes.match(value))) {
        // If the key is deleted, value will be null then reset color scheme to the default one.
        if (event.key.endsWith('light')) {
          setColorScheme({
            light: value
          });
        }
        if (event.key.endsWith('dark')) {
          setColorScheme({
            dark: value
          });
        }
      }
      if (event.key === modeStorageKey && (!value || ['light', 'dark', 'system'].includes(value))) {
        setMode(value || defaultMode);
      }
    };
    if (storageWindow) {
      // For syncing color-scheme changes between iframes
      storageWindow.addEventListener('storage', handleStorage);
      return function () {
        return storageWindow.removeEventListener('storage', handleStorage);
      };
    }
    return undefined;
  }, [setColorScheme, setMode, modeStorageKey, colorSchemeStorageKey, joinedColorSchemes, defaultMode, storageWindow]);
  return _objectSpread(_objectSpread({}, state), {}, {
    colorScheme: colorScheme,
    setMode: setMode,
    setColorScheme: setColorScheme
  });
}