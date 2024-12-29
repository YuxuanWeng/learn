import localServerListener from 'app/windows/listeners/local-server-listener';
import abRulesListener from './ab-rules-listener';
import appBarListener from './app-bar-listener';
import performanceListener from './app-performance-listener';
import autoUpdateListener from './auto-update-listener';
import broadcastListener from './broadcast-listener';
import busListener from './bus-listener';
import businessLogListener from './business-log-listener';
import createWindowListener from './create-window-listener';
import dataLocalizationListener from './data-localization-listener';
import dialogListener from './dialog-listener';
import imHelperListener from './im-helper-listener';
import iquoteCardsListener from './iquote-card-listener';
import layoutSettingsListener from './layout-settings-listener';
import loadingListener from './loading-listener';
import loginListener from './login-listener';
import memoryMessageListener from './memory-message-listener';
import networkListener from './network-listener';
import spotPricingHintListener from './spot-pricing-hint-listener';
import utilListener from './util-listener';
import windowCrashListener from './window-crash-listener';

export const listeners = [
  createWindowListener(),
  appBarListener(),
  dialogListener(),
  loginListener(),
  utilListener(),
  autoUpdateListener(),
  performanceListener(),
  broadcastListener(),
  windowCrashListener(),
  busListener(),
  networkListener(),
  abRulesListener(),
  memoryMessageListener(),
  layoutSettingsListener(),
  spotPricingHintListener(),
  businessLogListener(), // 监听渲染进程日志，business日志本地化
  dataLocalizationListener(),
  imHelperListener(),
  localServerListener(),
  loadingListener(),
  iquoteCardsListener()
];
