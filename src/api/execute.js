
import getRefsByClassKey from '../core/ref/get-refs-by-class-key';

export default (ccClassKey)=>{
  const refs = getRefsByClassKey(ccClassKey);
  refs.forEach(ref=>{
    if(ref.ctx.execute)ref.ctx.execute();
  });
}