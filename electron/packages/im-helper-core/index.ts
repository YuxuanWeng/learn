import { ResponseError } from '@fepkg/request/types';
import { BdsProductType } from '@fepkg/services/types/algo-enum';
import { User } from '@fepkg/services/types/common';
import { IMHelperEventEnum, UtilEventEnum } from 'app/types/IPCEvents';
import { postMessageAllWindow } from 'app/windows/listeners/broadcast-listener';
import express, { Express } from 'express';
import { Server } from 'http';
import { userInitConfigStorage } from '../../windows/store/user-init-config-storage';
import { RequestClient } from '../request-client';
import { ConnectionInfo, IMConnection, IMHelperClientConfig, IMHelperQQMsgForSend } from './types';

const IM_HELPER_PORT = 4985;
const OMS_PORT = 4995;

const HEART_BEAT_TIMEOUT = 5000;

export class IMHelperClient {
  private expressClient: Express;

  private expressServer: Server | undefined;

  private requestClient: RequestClient;

  private authBaseURL: string;

  private bdsBaseURL: string;

  private inner_connection: ConnectionInfo = {
    imConnection: IMConnection.Lost,
    allowedUserIDs: []
  };

  get connection() {
    return this.inner_connection;
  }

  set connection(value) {
    this.inner_connection = value;
    postMessageAllWindow(IMHelperEventEnum.IMConnectionUpdate, value);
  }

  private heartbeatTimer: NodeJS.Timeout | undefined;

  private updateConnection(value: ConnectionInfo) {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }

    if (value.imConnection === IMConnection.Connected) {
      this.heartbeatTimer = setTimeout(() => {
        this.connection.imConnection = IMConnection.Lost;
        this.heartbeatTimer = undefined;
      }, HEART_BEAT_TIMEOUT * 1.2);
    }
    this.connection = value;
  }

  userInfo?: User;

  async sendMessageToIMHelper(data: IMHelperQQMsgForSend[]) {
    return new Promise(resolve => {
      this.requestClient
        .request(
          '/send-to-qq',
          { msg_list: data.map(i => ({ ...i, send_qq: i.send_qq ?? this.userInfo?.QQ })) },
          {
            baseURL: `http://127.0.0.1:${IM_HELPER_PORT}`
          }
        )
        .then(res => {
          resolve(res.base_response);
        })
        .catch(e => {
          if (e?.code === 'ECONNREFUSED' || e?.code === 'ERR_BAD_RESPONSE') {
            resolve({ error: { code: 10001, msg: 'IM不在线或未开启授权状态' } });
          } else {
            resolve({ error: e?.data?.base_response ?? e?.toString() });
          }
        });
    });
  }

  private async updateUserInfo() {
    const res = await this.requestClient.fetchUserInfo({ baseURL: this.authBaseURL });

    this.userInfo = res.user;

    postMessageAllWindow(UtilEventEnum.UpdateUserInfo, res.user);
  }

  constructor(config: IMHelperClientConfig) {
    this.requestClient = new RequestClient({
      productType: config.productType,
      baseURL: config.algoBaseURL,
      token: config.token,
      version: config.version,
      platform: config.platform,
      deviceId: config.deviceId
    });

    this.userInfo = config.userInfo;
    this.authBaseURL = config.authBaseURL;
    this.bdsBaseURL = config.requestBaseURL;

    this.expressClient = express();

    this.expressClient.use(express.json());
    this.expressClient.use(express.urlencoded({ extended: true }));

    this.expressClient.post('/heart-beat', async (req, res) => {
      await this.updateUserInfo();

      if (req.body.qqID.toString() === this.userInfo?.QQ) {
        res.status(200).send({ code: 0 });
        this.updateConnection({
          imConnection: req.body.imConnection,
          allowedUserIDs: req.body.allowedUserIDs.map((i: number) => i.toString())
        });
      } else {
        res.status(200).send({ code: 10001, msg: 'qq绑定关系错误' });
        this.updateConnection({
          imConnection: IMConnection.BindWrong,
          allowedUserIDs: req.body.allowedUserIDs.map((i: number) => i.toString())
        });
      }
    });

    this.expressClient.post('/send-msg', async (req, res) => {
      await this.updateUserInfo();
      if (req.body.qqID.toString() === this.userInfo?.QQ) {
        const { msg_event } = req.body;

        if (typeof msg_event === 'string') {
          try {
            const envConfig = userInitConfigStorage.getUserInitConfig();

            const rawMessage = JSON.parse(msg_event);

            if (rawMessage.message_type === 'private') {
              this.requestClient.updateQQPrivateChat({
                msg_event: req.body.msg_event,
                product_type: envConfig?.productType as unknown as BdsProductType
              });
            } else if (rawMessage.message_type === 'group') {
              this.requestClient.updateQQGroupChat(
                {
                  msg_event: req.body.msg_event,
                  product_type: envConfig!.productType
                },
                {
                  baseURL: this.bdsBaseURL
                }
              );
            }

            res.status(200).send({ code: 0 });
          } catch (e) {
            const responseError = (e as ResponseError)?.data?.base_response;
            if (responseError != null) {
              res.status(200).send({ code: responseError.code, msg: responseError.msg });
              this.updateConnection({
                imConnection: IMConnection.Connected,
                allowedUserIDs: this.connection.allowedUserIDs
              });
            } else {
              res.status(200).send({ code: 10002, msg: '上传QQ消息失败', error: (e as any)?.toString() });
              this.updateConnection({
                imConnection: IMConnection.Lost,
                allowedUserIDs: this.connection.allowedUserIDs
              });
            }
          }
        }
      } else {
        res.status(200).send({ code: 10001, msg: 'qq绑定关系错误' });
        this.updateConnection({
          imConnection: IMConnection.BindWrong,
          allowedUserIDs: this.connection.allowedUserIDs
        });
      }
    });
  }

  start() {
    this.expressServer = this.expressClient.listen(OMS_PORT);
  }

  update(config: IMHelperClientConfig) {
    this.requestClient = new RequestClient({
      baseURL: config.algoBaseURL,
      token: config.token,
      version: config.version,
      platform: config.platform,
      deviceId: config.deviceId
    });

    this.userInfo = config.userInfo;
    this.authBaseURL = config.authBaseURL;
  }

  destroy() {
    this.expressServer?.close();
  }
}
