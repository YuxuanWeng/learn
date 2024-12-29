import { errorToString } from '@fepkg/common/utils';
import { LogLevel } from '@fepkg/logger';
import { StatusCode } from '@fepkg/request/types';
import { handleRequestError } from '@fepkg/request/utils';
import type { BaseDataBaseSyncDataScan } from '@fepkg/services/types/base-data/base-sync-data-scan';
import type { BaseDataSyncDataScan } from '@fepkg/services/types/base-data/sync-data-scan';
import {
  BondDetailSync,
  DealInfoSync,
  HolidaySync,
  InstSync,
  QuoteDraftDetailSync,
  QuoteDraftMessageSync,
  QuoteSync,
  TraderSync,
  UserSync
} from '@fepkg/services/types/common';
import { ProductType, SyncDataType } from '@fepkg/services/types/enum';
import { DataLocalizationDashBoardEnum } from 'app/types/DataLocalization';
import { trackPoint } from 'app/utility-process/data-localization/utils';
import moment from 'moment';
import { syncDataTypeMapInitEventChannel } from '../common/constant';
import { DataReader } from '../database-client/data-reader';
import { DataWriter } from '../database-client/data-writer';
import { EventClient } from '../event-client';
import { DataInitSyncEventMessage, EventClientChannel } from '../event-client/types';
import { RequestClient } from '../request-client';
import { DataInitClientConfig, InitState } from './types';
import { splitUpdateList, transformInit2LogData } from './utils';

export const FETCH_COUNT_BASE = 2500;
export const FETCH_COUNT = 500;
export const FETCH_INTERVAL = 10;
const BASIC_DATA_TYPE = new Set([
  SyncDataType.SyncDataTypeTrader,
  SyncDataType.SyncDataTypeInst,
  SyncDataType.SyncDataTypeUser,
  SyncDataType.SyncDataTypeBondDetail
]);

// 控制传输协议是否为Protobuf
const USE_PROTO_BUF = true;

export class DataInitManager {
  protected syncDataType: SyncDataType;

  protected eventClientChannel: EventClientChannel;

  protected requestClient: RequestClient;

  protected eventClient: EventClient;

  protected dataWriter: DataWriter;

  protected dataReader: DataReader;

  protected initState: InitState;

  protected localVersion: string | undefined;

  protected isBasic: boolean;

  private userProductType: ProductType[];

  constructor(params: DataInitClientConfig) {
    const { syncDataType, requestClient, eventClient, databaseClient, userProductType } = params;
    this.syncDataType = syncDataType;
    this.requestClient = requestClient;
    this.eventClient = eventClient;
    this.userProductType = userProductType;
    this.dataWriter = new DataWriter(databaseClient);
    this.dataReader = new DataReader(databaseClient, requestClient);
    this.initState = {
      received: 0,
      status: 'idle',
      isFetching: false,
      fetchFailedCount: 0,
      startId: '',
      search_after: undefined,
      endId: '',
      timer: undefined,
      startFetchDataTime: undefined,
      isFirstFetch: false
    };
    this.eventClientChannel = syncDataTypeMapInitEventChannel.get(syncDataType) ?? EventClientChannel.NoneInit;
    switch (syncDataType) {
      case SyncDataType.SyncDataTypeTrader:
        this.isBasic = true;
        break;
      case SyncDataType.SyncDataTypeInst:
        this.isBasic = true;
        break;
      case SyncDataType.SyncDataTypeUser:
        this.isBasic = true;
        break;
      case SyncDataType.SyncDataTypeHoliday:
        this.isBasic = true;
        break;
      case SyncDataType.SyncDataTypeBondDetail:
        this.isBasic = true;
        break;
      default:
        this.isBasic = false;
        break;
    }
  }

  /** emit init sync 回调中的事件（该类事件无法直接抛出） */
  protected emitInitSyncEvent(message: DataInitSyncEventMessage) {
    // 刷新service状态
    this.eventClient.emit(this.eventClientChannel, { syncDataType: this.syncDataType, ...message });
    // 向渲染进程发消息
    this.eventClient.emit(EventClientChannel.DataInitSyncStateChange, { syncDataType: this.syncDataType, ...message });

    // error上报日志大盘
    if (message?.status === 'error') {
      trackPoint({
        keyword: DataLocalizationDashBoardEnum.InitDataError,
        syncDataType: this.syncDataType,
        message: message?.message ?? 'init unknown error',
        ...(message?.error ? { error: errorToString(message.error) } : undefined)
      });
    }
  }

  getInitState() {
    return {
      received: this.initState.received,
      status: this.initState.status,
      isFetching: this.initState.isFetching,
      fetchFailedCount: this.initState.fetchFailedCount,
      startId: this.initState.startId,
      search_after: this.initState.search_after,
      endId: this.initState.endId,
      startFetchDataTime: this.initState.startFetchDataTime
    };
  }

  protected resetInitState() {
    this.initState = {
      received: 0,
      status: 'idle',
      isFetching: false,
      fetchFailedCount: 0,
      startId: '',
      search_after: undefined,
      endId: '',
      timer: undefined,
      isFirstFetch: false
    };
  }

  endInit() {
    clearInterval(this.initState.timer);
    this.initState.timer = undefined;
  }

  endSync() {
    this.endInit();
  }

  isInitializing() {
    return !!this.initState.timer;
  }

  isInitializeFinished() {
    return this.initState.status === 'success';
  }

  resetTable() {
    switch (this.syncDataType) {
      case SyncDataType.SyncDataTypeQuote:
        this.dataWriter.resetQuoteTable();
        break;
      case SyncDataType.SyncDataTypeDeal:
        this.dataWriter.resetDealInfoTable();
        break;
      case SyncDataType.SyncDataTypeTrader:
        this.dataWriter.resetTraderTable();
        break;
      case SyncDataType.SyncDataTypeInst:
        this.dataWriter.resetInstTable();
        break;
      case SyncDataType.SyncDataTypeUser:
        this.dataWriter.resetUserTable();
        break;
      case SyncDataType.SyncDataTypeBondAppendix:
        break;
      case SyncDataType.SyncDataTypeQuoteDraft:
        this.dataWriter.resetQuoteDraftDetailTable();
        break;
      case SyncDataType.SyncDataTypeQuoteDraftMessage:
        this.dataWriter.resetQuoteDraftMessageTable();
        break;
      case SyncDataType.SyncDataTypeHoliday:
        this.dataWriter.resetHolidayTable();
        break;
      case SyncDataType.SyncDataTypeBondDetail:
        this.dataWriter.resetBondDetailTable();
        break;
      default:
        break;
    }
  }

  /** 初始化成功后清除无效数据，防止数据库内无效数据积累 */
  hardDeleteDisabledData() {
    switch (this.syncDataType) {
      case SyncDataType.SyncDataTypeQuote:
        this.dataWriter.hardDeleteDisabledQuote();
        break;
      case SyncDataType.SyncDataTypeDeal:
        this.dataWriter.hardDeleteDisabledDealInfo();
        break;
      case SyncDataType.SyncDataTypeTrader:
        this.dataWriter.hardDeleteDisabledTrader();
        break;
      case SyncDataType.SyncDataTypeInst:
        this.dataWriter.hardDeleteDisabledInst();
        break;
      case SyncDataType.SyncDataTypeUser:
        this.dataWriter.hardDeleteDisabledUser();
        break;
      case SyncDataType.SyncDataTypeBondAppendix:
        break;
      case SyncDataType.SyncDataTypeQuoteDraft:
        this.dataWriter.hardDeleteDisabledQuoteDraftDetail();
        break;
      case SyncDataType.SyncDataTypeQuoteDraftMessage:
        this.dataWriter.hardDeleteDisabledQuoteDraftMessage();
        break;
      case SyncDataType.SyncDataTypeHoliday:
        this.dataWriter.hardDeleteDisabledHoliday();
        break;
      case SyncDataType.SyncDataTypeBondDetail:
        this.dataWriter.hardDeleteDisabledBondDetail();
        break;
      default:
        break;
    }
  }

  protected startFetchData(needReset: boolean) {
    this.initState.startFetchDataTime = performance.now();

    try {
      if (needReset || !this.isBasic) {
        this.dataWriter.resetSyncVersion(this.syncDataType);
        this.resetTable();
      }
      // 仅基础数据支持增量更新
      if (this.isBasic) {
        this.localVersion = needReset ? undefined : this.dataReader.getLastSuccessVersion(this.syncDataType);
      }
      this.initState.isFirstFetch = true;
      this.initState.timer = setInterval(this.fetchData, FETCH_INTERVAL);
      trackPoint({
        keyword: 'start_fetch_data',
        syncDataType: this.syncDataType,
        needReset,
        localVersion: this.localVersion
      });
    } catch (error) {
      this.initState.status = 'error';
      this.endInit();
      this.emitInitSyncEvent({
        status: 'error',
        message: '本地数据库错误',
        error,
        logContext: {
          level: LogLevel.ERROR,
          data: this.getInitState()
        }
      });
    }
  }

  /**
   * @override 注意，此处的重载方法要实现初始化的全部功能
   */
  startInit(needReset: boolean) {
    if (!this.isInitializing()) {
      this.resetInitState();
      this.startFetchData(needReset);
    }
  }

  protected fetchData = async () => {
    try {
      if (!this.initState.isFetching) {
        this.initState.isFetching = true;

        const fetchParams = {
          sync_data_type: this.syncDataType,
          search_after: this.initState.search_after,
          // NCDP无债券数据，带上这个参数会让后端接口变慢
          product_type_list:
            this.syncDataType === SyncDataType.SyncDataTypeBondDetail
              ? this.userProductType.filter(i => i !== ProductType.NCDP)
              : this.userProductType,
          count: FETCH_COUNT,
          local_version: this.localVersion,
          // DealInfo使用，最多同步两周之前的数据
          start_time:
            this.syncDataType === SyncDataType.SyncDataTypeDeal
              ? moment().startOf('day').subtract(2, 'week').valueOf().toString()
              : void 0
        };
        let result: BaseDataBaseSyncDataScan.Response & BaseDataSyncDataScan.Response;
        if (this.isBasic) {
          // product_type_list 仅在拉取quote与bond时过滤
          result = await this.requestClient.fetchBasicData({ ...fetchParams, count: FETCH_COUNT_BASE }, USE_PROTO_BUF);
        } else {
          result = await this.requestClient.fetchBusinessData({ ...fetchParams, count: FETCH_COUNT }, USE_PROTO_BUF);
        }

        if (this.initState.isFirstFetch) {
          this.initState.isFirstFetch = false;
          trackPoint({
            keyword: 'init_first_fetchData',
            syncDataType: this.syncDataType,
            fetchParams,
            response: transformInit2LogData(result, this.syncDataType)
          });
        }
        this.initDataHandler(result);
        this.initState.isFetching = false;
      }
    } catch (error) {
      // this.initState.fetchFailedCount += 1;
      // if (this.initState.fetchFailedCount > 2) {
      this.initState.status = 'error';
      this.endInit();

      let errorMsg = '数据初始化拉取失败！';
      // 如果是请求错误则优化报错信息
      handleRequestError({
        error,
        onLogout: code => {
          if (code === StatusCode.UserTokenIsReplaced) {
            errorMsg = '当前账号已在其他设备登录，当前设备已退出';
          }
        }
      });

      this.emitInitSyncEvent({
        status: 'error',
        message: errorMsg,
        error,
        logContext: {
          level: LogLevel.ERROR,
          data: this.getInitState()
        }
      });
      // }
      this.initState.isFetching = false;
    }
  };

  private initDataHandler = (message: BaseDataBaseSyncDataScan.Response & BaseDataSyncDataScan.Response) => {
    try {
      const {
        search_after,
        trader_list,
        inst_list,
        user_list,
        quote_list,
        holiday_list,
        quote_draft_detail_list,
        quote_draft_message_list,
        deal_info_list,
        bond_detail_list
      } = message;
      this.initState.status = 'loading';

      switch (this.syncDataType) {
        case SyncDataType.SyncDataTypeQuote: {
          if (!quote_list?.length) break;
          this.initState.received += quote_list.length;
          if (!this.initState.startId) {
            this.initState.startId = quote_list[0].quote_id;
          }
          this.initState.endId = quote_list.at(-1)?.quote_id;

          const { enableList, disableList } = splitUpdateList<QuoteSync>(quote_list);
          this.dataWriter.upsertQuoteList(enableList);
          this.dataWriter.deleteQuoteList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeDeal: {
          if (!deal_info_list?.length) break;
          this.initState.received += deal_info_list.length;
          if (!this.initState.startId) {
            this.initState.startId = deal_info_list[0].deal_id;
          }
          this.initState.endId = deal_info_list.at(-1)?.deal_id;

          const { enableList, disableList } = splitUpdateList<DealInfoSync>(deal_info_list);
          this.dataWriter.upsertDealInfoList(enableList);
          this.dataWriter.deleteDealInfoList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeTrader: {
          if (!trader_list?.length) break;
          this.initState.received += trader_list.length;
          if (!this.initState.startId) {
            this.initState.startId = trader_list[0].trader_id;
          }
          this.initState.endId = trader_list.at(-1)?.trader_id;

          const { enableList, disableList } = splitUpdateList<TraderSync>(trader_list);
          this.dataWriter.upsertTraderList(enableList);
          this.dataWriter.deleteTraderList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeInst: {
          if (!inst_list?.length) break;
          this.initState.received += inst_list.length;
          if (!this.initState.startId) {
            this.initState.startId = inst_list[0].inst_id;
          }
          this.initState.endId = inst_list.at(-1)?.inst_id;

          const { enableList, disableList } = splitUpdateList<InstSync>(inst_list);
          this.dataWriter.upsertInstList(enableList);
          this.dataWriter.deleteInstList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeUser: {
          if (!user_list?.length) break;
          this.initState.received += user_list.length;
          if (!this.initState.startId) {
            this.initState.startId = user_list[0].user_id;
          }
          this.initState.endId = user_list.at(-1)?.user_id;

          const { enableList, disableList } = splitUpdateList<UserSync>(user_list);
          this.dataWriter.upsertUserList(enableList);
          this.dataWriter.deleteUserList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeQuoteDraft: {
          if (!quote_draft_detail_list?.length) break;
          this.initState.received += quote_draft_detail_list.length;
          if (!this.initState.startId) {
            this.initState.startId = quote_draft_detail_list[0].detail_id;
          }
          this.initState.endId = quote_draft_detail_list.at(-1)?.detail_id;

          const { enableList, disableList } = splitUpdateList<QuoteDraftDetailSync>(quote_draft_detail_list);
          this.dataWriter.upsertQuoteDraftDetailList(enableList);
          this.dataWriter.deleteQuoteDraftDetailList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeQuoteDraftMessage: {
          if (!quote_draft_message_list?.length) break;
          this.initState.received += quote_draft_message_list.length;
          if (!this.initState.startId) {
            this.initState.startId = quote_draft_message_list[0].message_id;
          }
          this.initState.endId = quote_draft_message_list.at(-1)?.message_id;

          const { enableList: messageEnableList, disableList: messageDisableList } =
            splitUpdateList<QuoteDraftMessageSync>(quote_draft_message_list);
          this.dataWriter.upsertQuoteDraftMessageList(messageEnableList);
          this.dataWriter.deleteQuoteDraftMessageList(messageDisableList);
          break;
        }
        case SyncDataType.SyncDataTypeHoliday: {
          if (!holiday_list?.length) break;
          this.initState.received += holiday_list.length;
          if (!this.initState.startId) {
            this.initState.startId = holiday_list[0].holiday_id;
          }
          this.initState.endId = holiday_list.at(-1)?.holiday_id;
          const { enableList, disableList } = splitUpdateList<HolidaySync>(holiday_list);
          this.dataWriter.upsertHolidayList(enableList);
          this.dataWriter.deleteHolidayList(disableList);
          break;
        }
        case SyncDataType.SyncDataTypeBondDetail: {
          if (!bond_detail_list?.length) break;
          this.initState.received += bond_detail_list.length;
          if (!this.initState.startId) {
            this.initState.startId = bond_detail_list[0].ficc_id;
          }
          this.initState.endId = bond_detail_list.at(-1)?.ficc_id;
          const { enableList, disableList } = splitUpdateList<BondDetailSync>(bond_detail_list);
          this.dataWriter.upsertBondDetailList(enableList);
          this.dataWriter.deleteBondDetailList(disableList);
          break;
        }
        default:
          break;
      }

      // 如果没有返回search_after，则初始化结束
      if (!search_after) {
        // 如果查到最大的lastVersion则记录在table_config中
        const lastVersion = this.dataReader.getLastVersion(this.syncDataType);
        if (lastVersion !== undefined) {
          this.dataWriter.setSyncVersion(this.syncDataType, lastVersion);
        }

        const duration = this.initState?.startFetchDataTime
          ? performance.now() - this.initState.startFetchDataTime
          : -1;

        const total = this.dataReader.getTotal(this.syncDataType);
        trackPoint({
          keyword: DataLocalizationDashBoardEnum.InitDataSuccess,
          duration,
          syncDataType: this.syncDataType,
          lastVersion,
          total,
          response: transformInit2LogData(message, this.syncDataType)
        });

        // 若基础数据同步后为空则报错, 日志中出现过该情况
        if (BASIC_DATA_TYPE.has(this.syncDataType) && total === 0) {
          throw new Error('Insufficient Initialization Data Error.');
        }

        this.initState.status = 'success';
        this.endInit();
        this.emitInitSyncEvent({
          status: 'success'
        });
        this.hardDeleteDisabledData();
        this.dataWriter.vacuum();
      }

      // 为下一次拉取赋值
      this.initState.search_after = search_after;
      // 正常插入结束后错误数量归零
      this.initState.fetchFailedCount = 0;
    } catch (error) {
      console.log(error);
      this.initState.status = 'error';
      this.endInit();
      this.emitInitSyncEvent({
        status: 'error',
        message: '数据更新入库失败',
        error,
        logContext: {
          level: LogLevel.ERROR,
          data: this.getInitState()
        }
      });
    }
  };
}
