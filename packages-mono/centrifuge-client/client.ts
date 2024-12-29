import { noNil } from '@fepkg/common/utils/utils';
import { Centrifuge, ConnectedContext, HistoryOptions, SubscribedContext } from 'centrifuge';
import { CentrifugeClientConfig, ConnectionHandlers, SubscriptionHandlers } from './types';

export const CENTRIFUGE_URL_DEV = 'wss://api-dev.zoople.cn/api/v1/infra/streaming/centrifugo-v4/connection/websocket';
export const CENTRIFUGE_URL_TEST = 'wss://api-test.zoople.cn/api/v1/infra/streaming/centrifugo-v4/connection/websocket';

export class CentrifugeClient {
  private centrifuge: Centrifuge;

  private clientId: string | undefined;

  constructor(config: CentrifugeClientConfig) {
    let centrifugeUrl;
    if (config.websocketHost) {
      centrifugeUrl = config.websocketHost;
    } else if (config.env === 'dev') {
      centrifugeUrl = CENTRIFUGE_URL_DEV;
    } else if (config.env === 'test') {
      centrifugeUrl = CENTRIFUGE_URL_TEST;
    } else {
      centrifugeUrl = '';
    }

    this.centrifuge = new Centrifuge(
      centrifugeUrl,
      noNil({
        websocket: config.websocket,
        minReconnectDelay: config.minReconnectDelay,
        maxReconnectDelay: config.maxReconnectDelay,
        maxServerPingDelay: config.maxServerPingDelay,
        timeout: config.timeout,
        data: { token: config.token }
      })
    );
  }

  connect(handlers?: ConnectionHandlers) {
    return new Promise((resolve, reject) => {
      // 连接成功后
      this.centrifuge.once('connected', (ctx: ConnectedContext) => {
        this.clientId = ctx.client;

        this.centrifuge.on('disconnected', context => {
          handlers?.onDisconnect?.(context);
        });
        this.centrifuge.on('error', context => {
          handlers?.onError?.(context);
        });

        resolve(void 0);
      });

      // 连接失败后
      this.centrifuge.once('disconnected', ctx => {
        this.disconnect();
        reject(new Error(`Centrifuge client connect failed.${ctx?.reason}`));
      });
      this.centrifuge.once('error', ctx => {
        // this.disconnect(); 断网会走到这，不能disconnect，不然断网后一定要重新登录
        reject(new Error(`Centrifuge client connect failed.${ctx?.error.message}`));
      });

      this.centrifuge.connect();
    });
  }

  subscribe<T>(channel: string, handlers?: SubscriptionHandlers<T>): Promise<SubscribedContext> {
    return new Promise((resolve, reject) => {
      // TODO: 待确认必要性
      /** centrifuge 是否已连接 */
      // const isConnected = this.centrifuge.state === State.Connected;

      // if (!isConnected) {
      //   reject(Error(`Centrifuge client disconnected.`));
      //   return;
      // }

      /** 该 channel 是否被订阅过 */
      const isSubscribed = this.centrifuge.getSubscription(channel);
      if (isSubscribed) {
        reject(new Error(`The ${channel} subscribed.`));
        return;
      }

      const sub = this.centrifuge.newSubscription(channel, {
        // 丢包检测
        positioned: true
      });

      // 成功订阅后
      sub.once('subscribed', ctx => {
        sub.on('unsubscribed', context => {
          handlers?.onUnsubscribe?.(context);
        });
        sub.on('subscribing', context => {
          // centrifugal的订阅中的事件为temporary connection loss or resubscribe advice from server，目前只会收到loss消息
          handlers?.onTempConnectionLoss?.(context);
        });
        sub.on('subscribed', context => {
          handlers?.onResubscribe?.(context);
        });
        sub.on('error', context => {
          handlers?.onError?.(context);
        });
        sub.on('publication', context => {
          const publishClientId = context.info?.client;
          // 如果不为当前客户端发送的消息，则需要主动处理
          if (publishClientId !== this.getClientId()) {
            handlers?.onPublish?.(context);
          }
        });
        resolve(ctx);
      });
      // 订阅失败后
      sub.once('unsubscribed', ctx => {
        this.unsubscribe(channel);
        reject(ctx);
      });

      sub.subscribe();
    });
  }

  unsubscribe(channel: string) {
    const sub = this.centrifuge.getSubscription(channel);
    sub?.removeAllListeners();
    sub?.unsubscribe();
    this.centrifuge.removeSubscription(sub);
  }

  publish<D>(channel: string, data: D) {
    // const sub = this.centrifuge.getSubscription(channel);
    // if (sub) return sub.publish(data);
    return this.centrifuge.publish(channel, data);
  }

  getHistory(channel: string, options: HistoryOptions) {
    return this.centrifuge.history(channel, options);
  }

  /** 获取连接状态 */
  getConnectionState() {
    return this.centrifuge.state;
  }

  /** 获取当前订阅状态 */
  getSubscriptionState(channel: string) {
    return this.centrifuge.getSubscription(channel)?.state;
  }

  disconnect() {
    const subRecord = this.centrifuge.subscriptions();
    for (const sub of Object.keys(subRecord)) {
      this.unsubscribe(sub);
    }
    this.centrifuge.removeAllListeners();
    this.centrifuge.disconnect();
  }

  /** 获取 centrifuge 建立连接后返回的 client id */
  getClientId() {
    return this.clientId;
  }
}
