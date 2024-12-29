import { findDifferentValues } from '@fepkg/common/utils';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { FiccBondInfoLevelV2, SyncDataType } from '@fepkg/services/types/enum';
import { isEqual, omit } from 'lodash-es';
import { DatabaseClient } from '.';
import { RequestClient } from '../request-client';
import { BondDetailReadableDao } from './dao/readable/bond-detail';
import { DealInfoReadableDao } from './dao/readable/deal-info';
import { HolidayReadableDao } from './dao/readable/holiday';
import { InstReadableDao } from './dao/readable/inst';
import { QuoteReadableDao } from './dao/readable/quote';
import { QuoteDraftDetailReadableDao } from './dao/readable/quote-draft-detail';
import { QuoteDraftMessageReadableDao } from './dao/readable/quote-draft-message';
import { TableConfigReadableDao } from './dao/readable/table-config';
import { TraderReadableDao } from './dao/readable/trader';
import { UserReadableDao } from './dao/readable/user';
import { formatBondDetailDefaultValue } from './dao/writable/utils';
import { BondDetailDb } from './types';

type BondBasic = BondDetailDb | FiccBondBasic;
const sortByKeyMarket = (a: BondBasic, b: BondBasic) => (a.key_market < b.key_market ? 1 : -1);

export class DataReader {
  private databaseClient: DatabaseClient;

  private requestClient: RequestClient;

  private quoteDao: QuoteReadableDao | undefined;

  private dealDao: DealInfoReadableDao | undefined;

  private traderDao: TraderReadableDao | undefined;

  private userDao: UserReadableDao | undefined;

  private instDao: InstReadableDao | undefined;

  private bondDetailDao: BondDetailReadableDao | undefined;

  private quoteDraftDao: QuoteDraftDetailReadableDao | undefined;

  private holidayDao: HolidayReadableDao | undefined;

  private tableConfigDao: TableConfigReadableDao | undefined;

  private quoteDraftMessageDao: QuoteDraftMessageReadableDao | undefined;

  constructor(databaseClient: DatabaseClient, requestClient: RequestClient) {
    this.databaseClient = databaseClient;
    this.requestClient = requestClient;
  }

  getLastVersion(syncDataType: SyncDataType) {
    let result: string | undefined;
    switch (syncDataType) {
      case SyncDataType.SyncDataTypeQuote: {
        if (!this.quoteDao) this.quoteDao = new QuoteReadableDao(this.databaseClient);
        result = this.quoteDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeDeal: {
        if (!this.dealDao) this.dealDao = new DealInfoReadableDao(this.databaseClient);
        result = this.dealDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeTrader: {
        if (!this.traderDao) this.traderDao = new TraderReadableDao(this.databaseClient);
        result = this.traderDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeInst: {
        if (!this.instDao) this.instDao = new InstReadableDao(this.databaseClient);
        result = this.instDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeUser: {
        if (!this.userDao) this.userDao = new UserReadableDao(this.databaseClient);
        result = this.userDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeBondDetail: {
        if (!this.bondDetailDao) this.bondDetailDao = new BondDetailReadableDao(this.databaseClient);
        result = this.bondDetailDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeQuoteDraft: {
        if (!this.quoteDraftDao) this.quoteDraftDao = new QuoteDraftDetailReadableDao(this.databaseClient);
        result = this.quoteDraftDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeHoliday: {
        if (!this.holidayDao) this.holidayDao = new HolidayReadableDao(this.databaseClient);
        result = this.holidayDao.getLastVersion();
        break;
      }
      case SyncDataType.SyncDataTypeQuoteDraftMessage: {
        if (!this.quoteDraftMessageDao)
          this.quoteDraftMessageDao = new QuoteDraftMessageReadableDao(this.databaseClient);
        result = this.quoteDraftMessageDao.getLastVersion();
        break;
      }
      default:
        break;
    }

    return result;
  }

  getLastSuccessVersion(syncDataType: SyncDataType) {
    if (!this.tableConfigDao) this.tableConfigDao = new TableConfigReadableDao(this.databaseClient);
    return this.tableConfigDao.getLastSuccessVersion(syncDataType);
  }

  async checkLocalData(syncDataType: SyncDataType) {
    switch (syncDataType) {
      //    {
      //   if (!this.traderDao) this.traderDao = new TraderReadableDao(this.databaseClient);
      //   return [this.traderDao.getTotalNum(), this.traderDao.getTraderByRandom()] as const;
      // }
      case SyncDataType.SyncDataTypeTrader:
      case SyncDataType.SyncDataTypeInst:
      case SyncDataType.SyncDataTypeUser:
      case SyncDataType.SyncDataTypeHoliday:
      case SyncDataType.SyncDataTypeBondAppendix:
        return undefined;

      case SyncDataType.SyncDataTypeBondDetail: {
        if (!this.bondDetailDao) this.bondDetailDao = new BondDetailReadableDao(this.databaseClient);
        // TODO: 添加过滤syncVersion太近的, 远端接口暂无syncVersion
        const { localEnableTotal } = this.bondDetailDao.getTotalNum();
        // TODO: 接口获取远端数据库总数，enable总数
        const [remoteEnableTotal] = [localEnableTotal];

        const localData =
          this.bondDetailDao.getBondDetailByRandom()?.sort(sortByKeyMarket).map(formatBondDetailDefaultValue) ?? [];

        const result = await this.requestClient.fetchBondByKeyMarket({
          key_market_list: localData.map(item => item.key_market),
          info_level: FiccBondInfoLevelV2.InfoLevelBasic
        });
        const remoteData = result.bond_basic_list?.sort(sortByKeyMarket).map(formatBondDetailDefaultValue) ?? [];

        // TODO: 要求后端接口与ws推送的保持一致, 否则需要变成map
        // 排除本地化独有字段
        const omitFieldList = [
          'ficc_id',
          'enable',
          'pinyin',
          'pinyin_full',
          'sync_version',
          'full_name',
          'val_convexity',
          'first_maturity_date',
          'time_to_maturity' // FIXME: 这个字段变更不会实时推送，待修改为本地自己计算
        ];
        let diffCount = 0;
        const diffSample: Record<string, unknown>[] = [];

        for (const [index, item] of localData.entries()) {
          const oldData = omit(item, omitFieldList);
          const newData = omit(remoteData[index], omitFieldList);
          if (oldData.key_market === newData.key_market && !isEqual(oldData, newData)) {
            diffCount++;
            // 只上传前三个错误的样本
            if (diffCount < 3) {
              const differences = findDifferentValues(oldData, newData, 'key_market');
              // console.log(differences, 'differences', newData.key_market);
              diffSample.push(differences);
            }
          }
        }
        // console.log('diffIdList.length', diffIdList.length);
        return {
          diffCount,
          diffSample,
          localEnableTotal,
          remoteEnableTotal,
          syncDataType
        };
      }

      default:
        return undefined;
    }
  }

  getTotal(syncDataType: SyncDataType) {
    let total = 0;
    switch (syncDataType) {
      case SyncDataType.SyncDataTypeQuote: {
        if (!this.quoteDao) this.quoteDao = new QuoteReadableDao(this.databaseClient);
        total = this.quoteDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeDeal: {
        if (!this.dealDao) this.dealDao = new DealInfoReadableDao(this.databaseClient);
        total = this.dealDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeTrader: {
        if (!this.traderDao) this.traderDao = new TraderReadableDao(this.databaseClient);
        total = this.traderDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeInst: {
        if (!this.instDao) this.instDao = new InstReadableDao(this.databaseClient);
        total = this.instDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeUser: {
        if (!this.userDao) this.userDao = new UserReadableDao(this.databaseClient);
        total = this.userDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeBondDetail: {
        if (!this.bondDetailDao) this.bondDetailDao = new BondDetailReadableDao(this.databaseClient);
        total = this.bondDetailDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeQuoteDraft: {
        if (!this.quoteDraftDao) this.quoteDraftDao = new QuoteDraftDetailReadableDao(this.databaseClient);
        total = this.quoteDraftDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeHoliday: {
        if (!this.holidayDao) this.holidayDao = new HolidayReadableDao(this.databaseClient);
        total = this.holidayDao.getTotal();
        break;
      }
      case SyncDataType.SyncDataTypeQuoteDraftMessage: {
        if (!this.quoteDraftMessageDao)
          this.quoteDraftMessageDao = new QuoteDraftMessageReadableDao(this.databaseClient);
        total = this.quoteDraftMessageDao.getTotal();
        break;
      }
      default:
        break;
    }
    return total;
  }
}
