import { trackPoint } from '../../utils/main-logger';
import { SpotPricingHintClientConfig, SpotPricingHintEventAction, SpotPricingHintEventData } from './types';

export class SpotPricingHintClient {
  private worker: Worker;

  private messageHandler: (evt: MessageEvent<SpotPricingHintEventData>) => void;

  constructor(worker: Worker, messageHandler: (evt: MessageEvent<SpotPricingHintEventData>) => void) {
    this.worker = worker;
    this.messageHandler = messageHandler;
  }

  private post(data: SpotPricingHintEventData) {
    this.worker.postMessage(data);
  }

  startPolling(config: SpotPricingHintClientConfig) {
    trackPoint('try_spot_pricing_hint_worker_start');
    this.post({ action: SpotPricingHintEventAction.Start, value: config });
  }

  endPolling() {
    trackPoint('try_spot_pricing_hint_worker_end');
    this.post({ action: SpotPricingHintEventAction.End });
  }

  updateToken(token: string) {
    trackPoint('try_spot_pricing_hint_worker_update_token');
    this.post({ action: SpotPricingHintEventAction.UpdateToken, value: token });
  }

  start() {
    this.worker.addEventListener('message', this.messageHandler);
  }

  end() {
    this.worker.terminate();
  }
}
