import React from 'react';
import ReactDOM from 'react-dom';
import util, { bindToWindow } from '../support/util';
import { ERR, CC_DISPATCHER_BOX, CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';
import * as boot from '../core/base/boot';
import clearContextIfUnderHotReloadMode from './clear-context-if-under-hot-reload-mode';

export default function ({
  store = {},
  reducer = {},
  init = null,
  computed = {},
  watch = {},
  moduleSingleClass = {},
  middlewares = [],
  plugins = [],
  isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
  isDebug = false,
  errorHandler = null,
  isHot = false,
  autoCreateDispatcher = true,
  isReducerArgsOldMode = false,
  bindCtxToMethod = false,
} = {}) {
  try {
    util.justTip(`cc version ${ccContext.info.version}`);
    ccContext.isHot = isHot;
    ccContext.errorHandler = errorHandler;
    ccContext.isStrict = isStrict;
    ccContext.isDebug = isDebug;
    ccContext.isReducerArgsOldMode = isReducerArgsOldMode;
    ccContext.bindCtxToMethod = bindCtxToMethod;

    const err = util.makeError(ERR.CC_ALREADY_STARTUP);
    clearContextIfUnderHotReloadMode(true, err);

    boot.configModuleSingleClass(moduleSingleClass);
    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (autoCreateDispatcher) {
      if (!ccContext.refs[CC_DISPATCHER]) {
        const Dispatcher = createDispatcher();
        let box = document.querySelector(`#${CC_DISPATCHER_BOX}`);
        if (!box) {
          box = document.createElement('div');
          box.id = CC_DISPATCHER_BOX;
          const boxSt = box.style;
          boxSt.position = 'fixed';
          boxSt.left = 0;
          boxSt.top = 0;
          boxSt.display = 'none';
          boxSt.zIndex = -888666;
          document.body.append(box);
        }
        ReactDOM.render(React.createElement(Dispatcher), box);
        util.justTip(`[[startUp]]: cc create a CcDispatcher automatically`);
      } else {
        util.justTip(`[[startUp]]: CcDispatcher existed already`);
      }
    } else {
      throw new Error('customizing Dispatcher is not allowed in current version cc');
    }

    bindToWindow('CC_CONTEXT', ccContext);
    bindToWindow('ccc', ccContext);
    bindToWindow('cccc', ccContext.computed._computedValue);
    bindToWindow('sss',ccContext.store._state );

    ccContext.isCcAlreadyStartup = true;
    //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册
    boot.configPlugins(plugins);
  } catch (err) {
    if (errorHandler) errorHandler(err);
    else throw err;
  }
}