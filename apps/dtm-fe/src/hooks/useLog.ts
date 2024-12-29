import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Cache, LocalStorageCacheStorage } from '@fepkg/common/utils/cache';
import { useEventListener } from 'usehooks-ts';
import { trackPoint } from '@/common/logger';
import { RouteUrl } from '@/router/constants';

export enum DTMTrackEventDashBoardEnum {
  EnterPageDeal = '/enter/approval/pageDeal', // 进入成交单管理-审核页时触发
  EnterPageHistory = '/enter/approval/pageHistory', // 进入成交单管理-历史记录页时触发
  EnterPageBackendSetting = '/enter/approval/pageBackendSetting', // 进入成交单管理-后台管理页时触发
  EnterUnknownPage = '/enter/unknownPage', // 进入未知页面

  TimeOnPage = 'TimeOnPage', // 进入未知页面

  ClickApprovalButton = '/click/approval/list/approvalButton', // 所有用户在审核表单中点击通过/不通过的合计时记录
  ClickHistoryExportButton = '/click/approval/history/list/exportButton', // 所有用户点击导出按钮时记录
  ClickHistoryPrintButton = '/click/approval/history/list/printButton', // 所有用户点击打印按钮时记录
  ClickHistoryRefreshButton = '/click/approval/history/list/refreshButton', // 在历史查询页，所有用户数据发生变化时，点击刷新时记录
  ClickApprovalFilter = '/click/approval/list/filter', // 审核列表中，点击各筛选项时记录
  ClickHistoryFilter = '/click/approval/history/list/filter' // 历史查询中，点击各筛选项时记录
}

const pathToDTMEnterEvent: Record<string, DTMTrackEventDashBoardEnum> = {
  [RouteUrl.ApprovalHistoryList]: DTMTrackEventDashBoardEnum.EnterPageHistory,
  [RouteUrl.ApprovalList]: DTMTrackEventDashBoardEnum.EnterPageDeal,
  [RouteUrl.BackendSetting]: DTMTrackEventDashBoardEnum.EnterPageBackendSetting
};

const getDTMEnterEvent = (pathname: string) => {
  for (const path in pathToDTMEnterEvent) {
    if (pathname.includes(path)) {
      return pathToDTMEnterEvent[path];
    }
  }
  return DTMTrackEventDashBoardEnum.EnterUnknownPage;
};

export const getDTMClickFilterEvent = (isHistory: boolean) => {
  return isHistory ? DTMTrackEventDashBoardEnum.ClickHistoryFilter : DTMTrackEventDashBoardEnum.ClickApprovalFilter;
};

function parseUserAgent(userAgent: string) {
  let browser: string | undefined;
  let browserVersion: string | undefined;

  if (/edg/i.test(userAgent)) {
    // Microsoft Edge
    browser = 'Edge';
    browserVersion = userAgent.match(/edg\/([\d.]+)/i)?.[1];
  } else if (/(qqbrowser|tencenttraveler)/i.test(userAgent)) {
    // QQ browser
    browser = 'QQ browser';
    browserVersion = userAgent.match(/(qqbrowser|tencenttraveler)\/([\d.]+)/i)?.[1];
  } else if (/opera/i.test(userAgent)) {
    // Opera
    browser = 'Opera';
    browserVersion = userAgent.match(/opera\/([\d.]+)/i)?.[1];
  } else if (/360/i.test(userAgent)) {
    // 360
    browser = '360';
    browserVersion = userAgent.match(/360\/([\d.]+)/i)?.[1];
  } else if (/firefox/i.test(userAgent)) {
    // Firefox
    browser = 'Firefox';
    browserVersion = userAgent.match(/firefox\/([\d.]+)/i)?.[1];
  } else if (/chrome/i.test(userAgent)) {
    // Chrome
    browser = 'Chrome';
    browserVersion = userAgent.match(/chrome\/([\d.]+)/i)?.[1];
  } else if (/safari/i.test(userAgent)) {
    // Safari
    browser = 'Safari';
    browserVersion = userAgent.match(/version\/([\d.]+)/i)?.[1];
  } else if (/(chrome|firefox|safari|edg|msie|trident|qqbrowser)[ /]?(\d+(\.\d+)*)/i.test(userAgent)) {
    browser = 'Unknown';
    browserVersion = userAgent.match(/(?:msie|rv:)\s?([\d.]+)/i)?.[1];
  }

  const osRegex = /(windows|mac os|linux|iphone|ipad|ipod|android)/i;

  return {
    os: userAgent.match(osRegex)?.[1] ?? '',
    browser: browser ?? '',
    browserVersion: browserVersion ?? ''
  };
}

function getFullXPath(element: Element | null) {
  if (element === null || !(element instanceof Element)) return '';
  const path: string[] = [];
  while (element?.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();

    let sibling = element;
    let index = 1;

    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling;
      index++;
    }
    selector += `[${index}]`;
    path.unshift(selector);
    element = element.parentElement;
  }
  return path.length ? `/${path.join('/')}` : '';
}

const isTextChildNode = (target?: Element | null): boolean => {
  return target?.lastChild?.nodeType === Node.TEXT_NODE;
};

const handleClick = (e: Event) => {
  // 获取事件的目标元素
  const { target } = e;
  if (e instanceof MouseEvent && target instanceof Element) {
    const eventData = {
      id: target?.id || null,
      class: target?.className || null,
      nodeName: target?.nodeName.toLowerCase(),
      textContent: target?.textContent ?? '',
      classList: target?.classList ?? [],
      innerHTML: target?.innerHTML ?? '',
      x: e?.x,
      y: e?.y,
      offsetX: e?.offsetX,
      offsetY: e?.offsetY,
      xpath: getFullXPath(target),
      baseURI: target.baseURI,
      timeStamp: Date.now()
    };

    // 过滤非input/button按钮与非文字区域的点击事件
    const pattern = /(input|button)/i; // i flag for case insensitive matching
    if (pattern.test(eventData.xpath) || isTextChildNode(target)) {
      trackPoint('click-event', eventData);
    }
  }
};

const DTM_USER_DURATION_TIME = 'DTM_USER_DURATION_TIME';
const localCache = new Cache<{ url: string; duration: number }>({
  storage: new LocalStorageCacheStorage(),
  cacheTime: 12 * 30 * 24 * 60 * 60 * 1000 // 缓存一年
});

export const useLog = () => {
  const location = useLocation();
  const enterTimeRef = useRef(Date.now());

  // 点击事件通用埋点
  useEventListener('click', handleClick, undefined, true);

  // 进入页面事件埋点
  useEffect(() => {
    const userAgent = parseUserAgent(navigator.userAgent);
    trackPoint(getDTMEnterEvent(location.pathname), { url: location.pathname, ...userAgent });
  }, [location.pathname]);

  // 用户留存时间埋点，离开页面的时候记录，进入页面的时候上报上次的
  useEventListener('unload', () => {
    localCache.set(DTM_USER_DURATION_TIME, { url: location.pathname, duration: Date.now() - enterTimeRef.current });
  });
  useEffect(() => {
    enterTimeRef.current = Date.now();

    const lastDurationInfo = localCache.get(DTM_USER_DURATION_TIME);
    localCache.remove(DTM_USER_DURATION_TIME);

    if (lastDurationInfo?.url && lastDurationInfo?.duration) {
      trackPoint(DTMTrackEventDashBoardEnum.TimeOnPage, {
        url: lastDurationInfo?.url,
        duration: lastDurationInfo?.duration
      });
    }

    return () => {
      localCache.set(DTM_USER_DURATION_TIME, { url: location.pathname, duration: Date.now() - enterTimeRef.current });
    };
  }, [location.pathname]);

  return null;
};
