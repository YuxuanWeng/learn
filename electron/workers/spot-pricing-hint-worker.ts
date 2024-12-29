import { LogContext, Logger, LoggerMeta } from '@fepkg/logger';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { parentPort } from 'worker_threads';
import { RequestClient } from '../packages/request-client';
import {
  SpotPricingHintClientConfig,
  SpotPricingHintEventAction,
  SpotPricingHintEventData
} from '../packages/spot-pricing-hint-client/types';

declare let self: ServiceWorkerGlobalScope;

let requestClient: RequestClient | undefined;
let allowPolling = false;

type SpotPricingHintEvent = ExtendableMessageEvent & {
  data: SpotPricingHintEventData;
};

const post = (data: SpotPricingHintEventData) => {
  parentPort?.postMessage(data);
};

let logger: Logger | undefined;

const trackPoint = (val: Record<string, any>) => {
  logger?.i(
    {
      type: 'track-point',
      ...val
    },
    { immediate: true }
  );
};

const getSpotPricingHint = async () => {
  if (!allowPolling) return;
  try {
    const result = await requestClient?.fetchSpotPricingHint({});

    post({ action: SpotPricingHintEventAction.NewHint, value: result?.unread_notify_list });

    if (result?.unread_notify_list?.some(i => i.spot_pricing_detail.spot_pricing_record == null)) {
      trackPoint({
        keyword: 'fetch_spot_pricing_hint_wrong_data',
        data: JSON.stringify(result)
      });
    }
  } catch (e) {
    trackPoint({
      keyword: 'fetch_spot_pricing_hint_unread_fail',
      message: (e as any)?.toString()
    });
  }

  setTimeout(() => {
    getSpotPricingHint();
  }, 500);
};

const onSend = (value: LogContext[]) => {
  post({ action: SpotPricingHintEventAction.Log, value });
};

self.addEventListener('message', (evt: SpotPricingHintEvent) => {
  const { action, value } = evt.data;

  if (action === SpotPricingHintEventAction.Start) {
    const config = value as SpotPricingHintClientConfig;

    const newLoggerMeta: LoggerMeta = {
      userId: config.userInfo.user_id,
      userPost: config.userInfo.post, // 用户岗位 enum(1表示经纪人；2表示助理经纪人；3表示经纪人培训生；4表示DI；5表示后台)
      account: config.userInfo.account,
      version: config.version,
      softLifecycleId: config.softLifecycleId, // 一次应用生命周期
      deviceId: config.deviceId, // 设备id
      apiEnv: config.apiEnv,
      deviceType: config.deviceType, // 设备型号
      uploadUrl: config.uploadUrl
    };

    if (logger == null) {
      logger = new Logger({
        source: 'node',
        meta: newLoggerMeta,
        onSend
      });

      trackPoint({
        keyword: 'spot_pricing_hint_worker_init'
      });
    } else {
      logger.setMeta(newLoggerMeta);
      trackPoint({
        keyword: 'spot_pricing_hint_worker_update'
      });
    }

    requestClient = new RequestClient({
      baseURL: config.requestBaseURL,
      token: config.token,
      version: config.version,
      platform: config.platform,
      deviceId: config.deviceId,
      productType: config.productType
    });

    allowPolling = false;

    if (config.productType !== ProductType.NCD && config.productType !== ProductType.NCDP) {
      allowPolling = true;
      getSpotPricingHint();
    }
  }

  if (action === SpotPricingHintEventAction.End) {
    trackPoint({
      keyword: 'spot_pricing_hint_worker_end'
    });
    requestClient = undefined;

    allowPolling = false;
  }

  if (action === SpotPricingHintEventAction.UpdateToken) {
    trackPoint({
      keyword: 'spot_pricing_hint_worker_update_token'
    });
    requestClient?.tokenUpdate(value);
  }
});

export default null;
