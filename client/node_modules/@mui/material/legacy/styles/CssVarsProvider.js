import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { unstable_createCssVarsProvider as createCssVarsProvider, unstable_styleFunctionSx as styleFunctionSx } from '@mui/system';
import experimental_extendTheme from './experimental_extendTheme';
import createTypography from './createTypography';
import excludeVariablesFromRoot from './excludeVariablesFromRoot';
import THEME_ID from './identifier';
var defaultTheme = experimental_extendTheme();
var _createCssVarsProvide = createCssVarsProvider({
    themeId: THEME_ID,
    theme: defaultTheme,
    attribute: 'data-mui-color-scheme',
    modeStorageKey: 'mui-mode',
    colorSchemeStorageKey: 'mui-color-scheme',
    defaultColorScheme: {
      light: 'light',
      dark: 'dark'
    },
    resolveTheme: function resolveTheme(theme) {
      var newTheme = _objectSpread(_objectSpread({}, theme), {}, {
        typography: createTypography(theme.palette, theme.typography)
      });
      newTheme.unstable_sx = function sx(props) {
        return styleFunctionSx({
          sx: props,
          theme: this
        });
      };
      return newTheme;
    },
    excludeVariablesFromRoot: excludeVariablesFromRoot
  }),
  CssVarsProvider = _createCssVarsProvide.CssVarsProvider,
  useColorScheme = _createCssVarsProvide.useColorScheme,
  getInitColorSchemeScript = _createCssVarsProvide.getInitColorSchemeScript;
export { useColorScheme, getInitColorSchemeScript, CssVarsProvider as Experimental_CssVarsProvider };