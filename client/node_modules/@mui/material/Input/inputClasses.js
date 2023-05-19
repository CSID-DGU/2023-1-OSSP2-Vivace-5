import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import generateUtilityClass from '../generateUtilityClass';
import { inputBaseClasses } from '../InputBase';
export function getInputUtilityClass(slot) {
  return generateUtilityClass('MuiInput', slot);
}
const inputClasses = {
  ...inputBaseClasses,
  ...generateUtilityClasses('MuiInput', ['root', 'underline', 'input'])
};
export default inputClasses;