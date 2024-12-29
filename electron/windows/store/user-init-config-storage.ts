import { LoggerMeta } from '@fepkg/logger';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { DataLocalizationInitConfig } from 'app/types/DataLocalization';
import { UserInitConfig } from 'app/types/user-init-config';

export type UserInitConfigStorageMeta = Omit<LoggerMeta, 'uploadUrl'> & { logUrl: string; metricsUrl: string };
const NCD_PRODUCT_TYPE_LIST = [ProductType.NCD, ProductType.NCDP]; // NCD一二级需同时同步

class UserInitConfigStorage {
  private data?: UserInitConfig;

  setUserInitConfig(params: UserInitConfig) {
    this.data = {
      ...this.data,
      ...params
    };
  }

  removeUserInitConfig() {
    delete this.data;
  }

  getUserInitConfig() {
    return this.data;
  }

  getDBInitConfig(): DataLocalizationInitConfig | undefined {
    if (!this.data) {
      return undefined;
    }

    const {
      env,
      token,
      userInfo,
      version,
      softLifecycleId,
      platform,
      deviceId,
      deviceType,
      dbFilePath,
      refreshData,
      websocketHost,
      productType
    } = this.data;

    return {
      envSource: env,
      requestBaseURL: this.data.baseURL,
      token,
      userId: userInfo.user_id,
      userPost: userInfo.post,
      account: userInfo.account,
      version,
      softLifecycleId,
      platform,
      deviceId,
      deviceType,
      userProductType: NCD_PRODUCT_TYPE_LIST.includes(productType) ? NCD_PRODUCT_TYPE_LIST : [productType],
      dbFilePath,
      refreshData,
      websocketHost
    };
  }

  getMeta(): UserInitConfigStorageMeta | undefined {
    if (!this.data) {
      return undefined;
    }

    const { env, userInfo, version, softLifecycleId, deviceId, deviceType, logUrl, metricsUrl } = this.data;

    return {
      userId: userInfo.user_id,
      userPost: userInfo.post,
      account: userInfo.account,
      version,
      softLifecycleId,
      deviceId,
      deviceType,
      apiEnv: env,
      logUrl,
      metricsUrl
    };
  }
}

export const userInitConfigStorage = new UserInitConfigStorage();
