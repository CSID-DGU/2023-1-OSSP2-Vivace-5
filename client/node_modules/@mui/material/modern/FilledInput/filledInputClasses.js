import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import generateUtilityClass from '../generateUtilityClass';
import { inputBaseClasses } from '../InputBase';
export function getFilledInputUtilityClass(slot) {
  return generateUtilityClass('MuiFilledInput', slot);
}
const filledInputClasses = {
  ...inputBaseClasses,
  ...generateUtilityClasses('MuiFilledInput', ['root', 'underline', 'input'])
};
export default filledInputClasses;