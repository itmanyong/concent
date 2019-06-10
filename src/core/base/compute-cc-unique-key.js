import util from '../../support/util'
import uuid from './uuid';

export default function (isClassSingle, ccClassKey, ccKey, forFragment = false) {
  let ccUniqueKey;
  let isCcUniqueKeyAutoGenerated = false;
  let newCcKey = ccKey;
  
  if (isClassSingle) {
    if (ccKey) util.justWarning(`now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:${ccKey}`)
    ccUniqueKey = ccClassKey;
    newCcKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      // const uuidStr = uuid().replace(/-/g, '_');
      const uuidStr = uuid(forFragment);
      newCcKey = uuidStr;
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, uuidStr);
      isCcUniqueKeyAutoGenerated = true;
    }
  }
  return { ccKey: newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated };
}