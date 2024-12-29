import { BaseWindowProps } from '../windows/models/base';
import { WindowCategory } from './types';
import { CommonRoute, WindowName } from './window-v2';

export const SingleQuoteDialogConfig: BaseWindowProps = {
  name: WindowName.SingleQuoteV2,
  category: WindowCategory.Special,
  title: '报价',
  custom: { route: CommonRoute.SingleQuote, isTop: true },
  options: {
    width: 720,
    height: 400,
    paintWhenInitiallyHidden: false,
    resizable: false
  }

  // ..注意，不能出现函数，否则前端无法获取
  // onReadyShow() {}
};
