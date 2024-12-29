import { CentrifugeClient } from '@fepkg/centrifuge-client';
import { errorToString } from '@fepkg/common/utils';
import { StatusCode } from '@fepkg/request/types';
import { FiccBondBasic, Trader } from '@fepkg/services/types/common';
import type { LocalServicesStatus } from '@fepkg/services/types/data-localization-manual/available-service';
import type { LocalBondGetByKeyMarketList } from '@fepkg/services/types/data-localization-manual/bond/get-by-key-market-list';
import type { LocalBondSearch } from '@fepkg/services/types/data-localization-manual/bond/search';
import type { DataLocalizationStatus } from '@fepkg/services/types/data-localization-manual/data-localization-status';
import { LocalDealRecordList } from '@fepkg/services/types/data-localization-manual/deal-info/record-list';
import type { LocalFuzzySearch } from '@fepkg/services/types/data-localization-manual/fuzzy-search';
import type { LocalInstSearch } from '@fepkg/services/types/data-localization-manual/inst/search';
import type { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { LocalQuoteSearchById } from '@fepkg/services/types/data-localization-manual/quote/search-by-id';
import type { LocalQuoteSearchByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-by-key-market';
import type { LocalQuoteSearchOptimalByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-optimal-by-key-market';
import type { LocalRestartLocalServices } from '@fepkg/services/types/data-localization-manual/restart-local-services';
import type { LocalTraderGetByIdList } from '@fepkg/services/types/data-localization-manual/trader/get-by-id-list';
import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import type { LocalUserSearch } from '@fepkg/services/types/data-localization-manual/user/search';
import { BondSearchType, FiccBondInfoLevel, Post, ProductType, SyncDataType } from '@fepkg/services/types/enum';
import { DataLocalizationDashBoardEnum, DataLocalizationInitConfig } from 'app/types/DataLocalization';
import { QuoteDraftDetail } from 'app/types/DataLocalization/local-common';
import { logError, logger } from 'app/utility-process/data-localization/utils';
import { State } from 'centrifuge';
import WebSocket from 'ws';
import { DatabaseClient } from '../database-client';
import { EventClient } from '../event-client';
import { EventClientChannel } from '../event-client/types';
import { RequestClient } from '../request-client';
import { Service2SyncDataTypeMap, SyncDataType2ServiceMap } from '../services/common';
import { HolidayService } from '../services/initialize/holiday';
import { TableConfigService } from '../services/initialize/table-config';
import { BondService } from '../services/realtime/bond';
import { DealService } from '../services/realtime/deal';
import { InstService } from '../services/realtime/inst';
import { QuoteService } from '../services/realtime/quote';
import { QuoteDraftService } from '../services/realtime/quote-draft';
import { TraderService } from '../services/realtime/trader';
import { UserService } from '../services/realtime/user';

// 数据库版本
const TABLE_VERSION = 27;
const base_response = { code: StatusCode.Success, msg: 'success' };
const notAvailableReason = '数据未初始化完成';

export class DataController {
  private isClosed = true;

  private eventClient: EventClient;

  private centrifugeClient: CentrifugeClient;

  private requestClient: RequestClient;

  private databaseClient: DatabaseClient;

  private tableConfigService: TableConfigService;

  private service: {
    traderService: TraderService;
    userService: UserService;
    instService: InstService;
    bondService: BondService;
    quoteService: QuoteService;
    holidayService: HolidayService;
    quoteDraftService: QuoteDraftService;
    dealService: DealService;
  };

  private userId = '';

  private userProductType: ProductType[] = [];

  private refreshData = false;

  constructor(config: DataLocalizationInitConfig, eventClient: EventClient) {
    const { requestBaseURL, token, platform, version, userId, deviceId, dbFilePath, userProductType, refreshData } =
      config;
    this.refreshData = refreshData;
    if (!dbFilePath) throw new Error('DbFilePath is undefined.');
    if (!eventClient) throw new Error('EventClient is undefined.');
    this.eventClient = eventClient;
    this.centrifugeClient = new CentrifugeClient({
      token,
      env: config.envSource,
      websocket: WebSocket,
      websocketHost: config.websocketHost,
      minReconnectDelay: 1000,
      maxReconnectDelay: 5000,
      maxServerPingDelay: 3000,
      timeout: 1000
    });
    this.requestClient = new RequestClient({
      baseURL: requestBaseURL,
      token,
      version,
      platform,
      deviceId
    });
    this.databaseClient = new DatabaseClient(dbFilePath);
    this.userId = userId;
    this.userProductType = userProductType;
    const serviceConfig = {
      eventClient: this.eventClient,
      requestClient: this.requestClient,
      databaseClient: this.databaseClient,
      centrifugeClient: this.centrifugeClient,
      userProductType
    };
    this.tableConfigService = new TableConfigService(serviceConfig);
    this.service = {
      quoteService: new QuoteService(serviceConfig),
      quoteDraftService: new QuoteDraftService(serviceConfig),
      traderService: new TraderService(serviceConfig),
      userService: new UserService(serviceConfig),
      instService: new InstService(serviceConfig),
      bondService: new BondService(serviceConfig),
      holidayService: new HolidayService(serviceConfig),
      dealService: new DealService(serviceConfig)
    };
    this.isClosed = false;
  }

  async init() {
    try {
      await this.centrifugeClient.connect();
      await this.updateData();
    } catch (error) {
      this.eventClient.emit(EventClientChannel.DataInitSyncStateChange, {
        message: '数据本地化初始化失败，请联系管理员！',
        error
      });
      logError(error, DataLocalizationDashBoardEnum.InitDataError);
    }
  }

  close() {
    if (!this.isClosed) {
      Object.values(this.service).forEach(service => service.endSync());
      this.centrifugeClient.disconnect();
      this.databaseClient.close();
      this.isClosed = true;
    }
  }

  restart() {
    if (!this.isClosed) {
      Object.values(this.service).forEach(service => service.endSync());
      this.centrifugeClient.disconnect();
      this.isClosed = true;
    }
    this.init().catch(err => {
      logError(err, 'restart_services_error');
    });
  }

  dropAllTable() {
    const tableNameList = this.databaseClient.all<{ name: string }[]>(
      "select name from sqlite_master where type='table'"
    );
    console.log('tableNameList', tableNameList);
    tableNameList.forEach(v => {
      this.databaseClient.run(`drop table if exists ${v.name}`);
    });
  }

  async updateData() {
    // 判断数据版本是否发生变化，是否需要重新建表
    this.tableConfigService.createTable();

    const isForceReset = this.tableConfigService.needReset(
      this.refreshData,
      TABLE_VERSION,
      this.userId,
      this.userProductType
    );
    if (isForceReset) {
      this.dropAllTable();
      // 向渲染进程发消息
      this.eventClient.emit(EventClientChannel.DataInitSyncStateChange, {
        syncDataType: SyncDataType.SyncDataTypeNone,
        status: 'warning',
        message: '本次初始化预计时间较长，请耐心等待'
      });
    }

    this.tableConfigService.createTable();
    // 重置本地配置消息
    this.tableConfigService.setTableConfig({
      version: TABLE_VERSION,
      userId: this.userId,
      userProductType: this.userProductType
    });
    // 优先同步无兜底接口的quote数据
    await this.service.quoteDraftService.startSync(isForceReset);
    await this.service.quoteService.startSync(isForceReset);
    await this.service.dealService.startSync(isForceReset);

    await this.service.instService.startSync(isForceReset);
    await this.service.userService.startSync(isForceReset);
    await this.service.traderService.startSync(isForceReset);
    await this.service.bondService.startSync(isForceReset);
    this.service.holidayService.startSync(isForceReset);
  }

  getLocalDataStatus(): DataLocalizationStatus.Response {
    try {
      const tableNameList = this.databaseClient.all<{ name: string }[]>(
        "select name from sqlite_master where type='table'"
      );
      const table_info: DataLocalizationStatus.Response['table_info'] = {};
      tableNameList.forEach(v => {
        const tableCount = this.databaseClient.get<{ total: number }>(`SELECT COUNT(*) as total FROM ${v.name}`);
        table_info[v.name] = tableCount?.total || 0;
      });
      return {
        pid: process.pid,
        table_info
      };
    } catch {
      return {
        pid: process.pid
      };
    }
  }

  getLocalServicesStatus(): LocalServicesStatus.Response {
    try {
      if (this.centrifugeClient.getConnectionState() !== State.Connected) {
        return { base_response: { code: StatusCode.InternalError, msg: this.centrifugeClient.getConnectionState() } };
      }

      const available_service_list = Object.entries(this.service)
        .map(([key, service]) => {
          if (!service.isServiceAvailable()) {
            return '';
          }
          return key;
        })
        .filter(Boolean);

      const available_sync_data_type = available_service_list.flatMap(item => Service2SyncDataTypeMap[item]);

      const error_service_list = Object.entries(this.service)
        .map(([key, service]) => {
          if (service.isServiceAvailable() || service.isServiceInitializing()) {
            return '';
          }
          return key;
        })
        .filter(Boolean);

      const error_sync_data_type = error_service_list.flatMap(item => Service2SyncDataTypeMap[item]);

      return {
        base_response,
        available_service_list,
        available_sync_data_type,
        error_service_list,
        error_sync_data_type
      };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  restartServices(params: LocalRestartLocalServices.Request): LocalRestartLocalServices.Response {
    try {
      if (this.centrifugeClient.getConnectionState() !== State.Connected) {
        this.restart();
        return { base_response };
      }
      const { syncDataTypeList, service_list } = params;
      const service_set = new Set(service_list);
      syncDataTypeList?.forEach(i => {
        const service = SyncDataType2ServiceMap.get(i);
        if (service) {
          service_set.add(service);
        }
      });

      service_set.forEach(item => {
        this.service[item]?.restart(true);
      });
      return { base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  traderSearch(params: LocalTraderSearch.Request): LocalTraderSearch.Response {
    try {
      if (
        !this.service.traderService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.traderService.search(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  quoteSearchOptimalByKeyMarket(
    params: LocalQuoteSearchOptimalByKeyMarket.Request
  ): LocalQuoteSearchOptimalByKeyMarket.Response {
    try {
      if (
        !this.service.quoteService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.traderService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.quoteService.searchOptimalByKeyMarket(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  quoteSearchByKeyMarket(params: LocalQuoteSearchByKeyMarket.Request): LocalQuoteSearchByKeyMarket.Response {
    try {
      if (
        !this.service.quoteService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.traderService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.quoteService.searchByKeyMarket(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  quoteSearchById(params: LocalQuoteSearchById.Request): LocalQuoteSearchById.Response {
    try {
      if (
        !this.service.quoteService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.traderService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.quoteService.searchById(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  instSearch(params: LocalInstSearch.Request): LocalInstSearch.Response {
    try {
      if (!this.service.instService.isServiceAvailable()) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.instService.search(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  userSearch(params: LocalUserSearch.Request): LocalUserSearch.Response {
    try {
      if (!this.service.userService.isServiceAvailable()) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.userService.search(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  bondSearch(params: LocalBondSearch.Request): LocalBondSearch.Response {
    try {
      if (!this.service.bondService.isServiceAvailable() || !this.service.holidayService.isServiceAvailable()) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.bondService.search(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  instTraderList(params: LocalInstTraderList.Request): LocalInstTraderList.Response {
    try {
      if (!this.service.traderService.isServiceAvailable() || !this.service.userService.isServiceAvailable()) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.traderService.getInstTraderList(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  fuzzySearch(params: LocalFuzzySearch.Request): LocalFuzzySearch.Response {
    const searchParams = {
      keyword: params.keyword,
      product_type: params.product_type,
      need_invalid: params.need_invalid,
      count: 20
    };
    try {
      if (
        !this.service.bondService.isServiceAvailable() ||
        !this.service.holidayService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.traderService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      let trader_list: Trader[] = [];
      let bond_info_list: FiccBondBasic[] = [];

      const { list: inst_list = [] } = this.service.instService.search(searchParams);
      if (searchParams.product_type !== ProductType.NCDP) {
        const { list } = this.service.traderService.search(searchParams);
        trader_list = list ?? [];
      }
      const { list: user_list = [] } = this.service.userService.search({
        ...searchParams,
        product_type: searchParams.product_type ?? ProductType.BCO,
        post_list: [Post.Post_Broker, Post.Post_BrokerAssistant, Post.Post_BrokerTrainee]
      });
      if (searchParams.product_type !== ProductType.NCDP) {
        const { bond_basic_list } = this.service.bondService.search({
          ...searchParams,
          search_type: BondSearchType.SearchAllField,
          info_level: FiccBondInfoLevel.BasicInfo,
          count: `${searchParams.count}`
        });
        bond_info_list = bond_basic_list ?? [];
      }

      // 过滤全局搜索数量，详见：
      // https://shihetech.feishu.cn/docx/S5ggd5PDRo3rioxyrKwccaFun3f#part-HW3qdVAvDoH0czxdLTDcFmOAn8e
      let listCount = 0;
      if (inst_list.length > 0) listCount += 1;
      if (trader_list.length > 0) listCount += 1;
      if (user_list.length > 0) listCount += 1;
      if (bond_info_list.length > 0) listCount += 1;

      const multi = listCount > 1;

      return {
        inst_list: multi ? inst_list.slice(0, 5) : inst_list,
        trader_list: multi ? trader_list.slice(0, 5) : trader_list,
        user_list: multi ? user_list.slice(0, 3) : user_list,
        bond_info_list: multi ? bond_info_list.slice(0, 10) : bond_info_list,
        base_response
      };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  quoteDraftMessageList(params: LocalQuoteDraftMessageList.Request): LocalQuoteDraftMessageList.Response {
    try {
      if (
        !this.service.quoteDraftService.isServiceAvailable() ||
        !this.service.bondService.isServiceAvailable() ||
        !this.service.holidayService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.traderService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.quoteDraftService.getMessageList(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  detailList(idList: string[]): QuoteDraftDetail[] {
    if (
      !this.service.quoteDraftService.isServiceAvailable() ||
      !this.service.bondService.isServiceAvailable() ||
      !this.service.holidayService.isServiceAvailable()
    ) {
      return [];
    }
    try {
      return this.service.quoteDraftService.getDetailByIdList(idList);
    } catch (error) {
      return [];
    }
  }

  tokenUpdate(token: string) {
    this.requestClient?.tokenUpdate(token);
  }

  bondGetByKeyMarketList(params: LocalBondGetByKeyMarketList.Request): LocalBondGetByKeyMarketList.Response {
    try {
      logger.e(
        {
          keyword: 'bondGetByKeyMarketList处理函数step1',
          ...params
        },
        { immediate: true }
      );
      if (!this.service.bondService.isServiceAvailable() || !this.service.holidayService.isServiceAvailable()) {
        logger.e(
          {
            keyword: 'bondGetByKeyMarketList处理函数 throw了'
          },
          { immediate: true }
        );
        throw new Error(notAvailableReason);
      }
      const result = this.service.bondService.getByKeyMarketList(params);
      logger.e(
        {
          keyword: 'bondGetByKeyMarketList处理函数step2',
          result
        },
        { immediate: true }
      );
      return { ...result, base_response };
    } catch (error) {
      logger.e(
        {
          keyword: 'bondGetByKeyMarketList处理函数有error',
          error
        },
        { immediate: true }
      );
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }

  dealRecordList(params: LocalDealRecordList.Request): LocalDealRecordList.Response {
    try {
      if (
        !this.service.dealService.isServiceAvailable() ||
        !this.service.bondService.isServiceAvailable() ||
        !this.service.holidayService.isServiceAvailable() ||
        !this.service.instService.isServiceAvailable() ||
        !this.service.traderService.isServiceAvailable() ||
        !this.service.userService.isServiceAvailable()
      ) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.dealService.getRecordList(params);
      return { ...result, base_response };
    } catch (error) {
      return {
        base_response: { code: StatusCode.InternalError, msg: errorToString(error) }
      };
    }
  }

  traderGetByIdList(params: LocalTraderGetByIdList.Request): LocalTraderGetByIdList.Response {
    try {
      if (!this.service.traderService.isServiceAvailable()) {
        throw new Error(notAvailableReason);
      }
      const result = this.service.traderService.getByIdList(params);
      return { ...result, base_response };
    } catch (error) {
      return { base_response: { code: StatusCode.InternalError, msg: errorToString(error) } };
    }
  }
}
