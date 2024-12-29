import { useRef } from 'react';
import type { TrackingMessage } from '@fepkg/services/types/base/tracking';
import type { BondQuoteMulCreate } from '@fepkg/services/types/bond-quote/mul-create';
import moment from 'moment';
import { createContainer } from 'unstated-next';
import { serverTracking } from '@/common/services/api/base/tracking';

const ParsingUploadContainer = createContainer(() => {
  const parsingContentRef = useRef<string | undefined>();

  const clearParsingContent = () => {
    parsingContentRef.current = undefined;
  };

  const insertParsingContent = (val: string) => {
    parsingContentRef.current = val;
  };

  /** 向服务端上传识别参数和最终结果的对照 */
  const uploadParsingContent = (requestParams: BondQuoteMulCreate.Request) => {
    if (!parsingContentRef.current) return;
    const uploadParam = { recString: parsingContentRef.current, submitParam: requestParams };
    const uploadStr = JSON.stringify(uploadParam);
    const trackingMessage: TrackingMessage = {
      event: 'SingleQuoteV2',
      event_time: moment().valueOf(),
      extra: uploadStr
    };
    serverTracking({ message_list: [trackingMessage] }, { hideErrorMessage: true });
    clearParsingContent();
  };

  return { insertParsingContent, clearParsingContent, uploadParsingContent };
});

export const ParsingUploadProvider = ParsingUploadContainer.Provider;
export const useParsingUpload = ParsingUploadContainer.useContainer;
