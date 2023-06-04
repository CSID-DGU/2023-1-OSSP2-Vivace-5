import prepareCssVars from './prepareCssVars';
function createCssVarsTheme(theme) {
  const {
    cssVarPrefix,
    shouldSkipGeneratingVar,
    ...otherTheme
  } = theme;
  return {
    ...theme,
    ...prepareCssVars(otherTheme, {
      prefix: cssVarPrefix,
      shouldSkipGeneratingVar
    })
  };
}
export default createCssVarsTheme;