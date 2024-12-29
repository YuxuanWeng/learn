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
import { SyncDataType } from '@fepkg/services/types/enum';
import { DatabaseClient } from '.';
import { BondDetailWritableDao } from './dao/writable/bond-detail';
import { DealInfoWritableDao } from './dao/writable/deal-info';
import { HolidayWritableDao } from './dao/writable/holiday';
import { InstWritableDao } from './dao/writable/inst';
import { QuoteWritableDao } from './dao/writable/quote';
import { QuoteDraftDetailWritableDao } from './dao/writable/quote-draft-detail';
import { QuoteDraftMessageWritableDao } from './dao/writable/quote-draft-message';
import { TableConfigWritableDao } from './dao/writable/table-config';
import { TraderWritableDao } from './dao/writable/trader';
import { UserWritableDao } from './dao/writable/user';

export class DataWriter {
  private databaseClient: DatabaseClient;

  private traderDao: TraderWritableDao | undefined;

  private userDao: UserWritableDao | undefined;

  private instDao: InstWritableDao | undefined;

  private quoteDao: QuoteWritableDao | undefined;

  private holidayDao: HolidayWritableDao | undefined;

  private quoteDraftMessageDao: QuoteDraftMessageWritableDao | undefined;

  private quoteDraftDetailDao: QuoteDraftDetailWritableDao | undefined;

  private tableConfigDao: TableConfigWritableDao | undefined;

  private dealInfoDao: DealInfoWritableDao | undefined;

  private bondDetailDao: BondDetailWritableDao | undefined;

  constructor(databaseClient: DatabaseClient) {
    this.databaseClient = databaseClient;
  }

  vacuum() {
    this.databaseClient.run('VACUUM');
  }

  resetTraderTable() {
    if (!this.traderDao) this.traderDao = new TraderWritableDao(this.databaseClient);
    this.traderDao.dropTable();
    this.traderDao.createTable();
  }

  upsertTraderList(list: TraderSync[]) {
    if (!this.traderDao) this.traderDao = new TraderWritableDao(this.databaseClient);
    this.traderDao.upsertList(list);
  }

  deleteTraderList(trader_list: TraderSync[]) {
    if (!this.traderDao) this.traderDao = new TraderWritableDao(this.databaseClient);
    return this.traderDao.deleteList(trader_list);
  }

  hardDeleteDisabledTrader() {
    if (!this.traderDao) this.traderDao = new TraderWritableDao(this.databaseClient);
    return this.traderDao.hardDeleteDisabled();
  }

  resetInstTable() {
    if (!this.instDao) this.instDao = new InstWritableDao(this.databaseClient);
    this.instDao.dropTable();
    this.instDao.createTable();
  }

  upsertInstList(list: InstSync[]) {
    if (!this.instDao) this.instDao = new InstWritableDao(this.databaseClient);
    this.instDao.upsertList(list);
  }

  deleteInstList(inst_list: InstSync[]) {
    if (!this.instDao) this.instDao = new InstWritableDao(this.databaseClient);
    return this.instDao.deleteList(inst_list);
  }

  hardDeleteDisabledInst() {
    if (!this.instDao) this.instDao = new InstWritableDao(this.databaseClient);
    return this.instDao.hardDeleteDisabled();
  }

  resetUserTable() {
    if (!this.userDao) this.userDao = new UserWritableDao(this.databaseClient);
    this.userDao.dropTable();
    this.userDao.createTable();
  }

  upsertUserList(list: UserSync[]) {
    if (!this.userDao) this.userDao = new UserWritableDao(this.databaseClient);
    this.userDao.upsertList(list);
  }

  deleteUserList(user_list: UserSync[]) {
    if (!this.userDao) this.userDao = new UserWritableDao(this.databaseClient);
    return this.userDao.deleteList(user_list);
  }

  hardDeleteDisabledUser() {
    if (!this.userDao) this.userDao = new UserWritableDao(this.databaseClient);
    return this.userDao.hardDeleteDisabled();
  }

  resetQuoteTable() {
    if (!this.quoteDao) this.quoteDao = new QuoteWritableDao(this.databaseClient);
    this.quoteDao.dropTable();
    this.quoteDao.createTable();
  }

  upsertQuoteList(list: QuoteSync[]) {
    if (!this.quoteDao) this.quoteDao = new QuoteWritableDao(this.databaseClient);
    this.quoteDao.upsertList(list);
  }

  deleteQuoteList(list: QuoteSync[]) {
    if (!this.quoteDao) this.quoteDao = new QuoteWritableDao(this.databaseClient);
    return this.quoteDao.deleteList(list);
  }

  hardDeleteDisabledQuote() {
    if (!this.quoteDao) this.quoteDao = new QuoteWritableDao(this.databaseClient);
    return this.quoteDao.hardDeleteDisabled();
  }

  resetHolidayTable() {
    if (!this.holidayDao) this.holidayDao = new HolidayWritableDao(this.databaseClient);
    this.holidayDao.dropTable();
    this.holidayDao.createTable();
  }

  upsertHolidayList(list: HolidaySync[]) {
    if (!this.holidayDao) this.holidayDao = new HolidayWritableDao(this.databaseClient);
    this.holidayDao.upsertList(list);
  }

  deleteHolidayList(list: HolidaySync[]) {
    if (!this.holidayDao) this.holidayDao = new HolidayWritableDao(this.databaseClient);
    return this.holidayDao.deleteList(list);
  }

  hardDeleteDisabledHoliday() {
    if (!this.holidayDao) this.holidayDao = new HolidayWritableDao(this.databaseClient);
    return this.holidayDao.hardDeleteDisabled();
  }

  resetQuoteDraftDetailTable() {
    if (!this.quoteDraftDetailDao) this.quoteDraftDetailDao = new QuoteDraftDetailWritableDao(this.databaseClient);
    this.quoteDraftDetailDao.dropTable();
    this.quoteDraftDetailDao.createTable();
  }

  upsertQuoteDraftDetailList(list: QuoteDraftDetailSync[]) {
    if (!this.quoteDraftDetailDao) this.quoteDraftDetailDao = new QuoteDraftDetailWritableDao(this.databaseClient);
    this.quoteDraftDetailDao.upsertList(list);
  }

  deleteQuoteDraftDetailList(list: QuoteDraftDetailSync[]) {
    if (!this.quoteDraftDetailDao) this.quoteDraftDetailDao = new QuoteDraftDetailWritableDao(this.databaseClient);
    return this.quoteDraftDetailDao.deleteList(list);
  }

  hardDeleteDisabledQuoteDraftDetail() {
    if (!this.quoteDraftDetailDao) this.quoteDraftDetailDao = new QuoteDraftDetailWritableDao(this.databaseClient);
    return this.quoteDraftDetailDao.hardDeleteDisabled();
  }

  resetQuoteDraftMessageTable() {
    if (!this.quoteDraftMessageDao) this.quoteDraftMessageDao = new QuoteDraftMessageWritableDao(this.databaseClient);
    this.quoteDraftMessageDao.dropTable();
    this.quoteDraftMessageDao.createTable();
  }

  upsertQuoteDraftMessageList(list: QuoteDraftMessageSync[]) {
    if (!this.quoteDraftMessageDao) this.quoteDraftMessageDao = new QuoteDraftMessageWritableDao(this.databaseClient);
    this.quoteDraftMessageDao.upsertList(list);
  }

  deleteQuoteDraftMessageList(list: QuoteDraftMessageSync[]) {
    if (!this.quoteDraftMessageDao) this.quoteDraftMessageDao = new QuoteDraftMessageWritableDao(this.databaseClient);
    return this.quoteDraftMessageDao.deleteList(list);
  }

  hardDeleteDisabledQuoteDraftMessage() {
    if (!this.quoteDraftMessageDao) this.quoteDraftMessageDao = new QuoteDraftMessageWritableDao(this.databaseClient);
    return this.quoteDraftMessageDao.hardDeleteDisabled();
  }

  setSyncVersion(syncDataType: SyncDataType, syncVersion: string) {
    if (!this.tableConfigDao) this.tableConfigDao = new TableConfigWritableDao(this.databaseClient);
    return this.tableConfigDao.setSyncVersion(syncDataType, syncVersion);
  }

  resetSyncVersion(syncDataType: SyncDataType) {
    if (!this.tableConfigDao) this.tableConfigDao = new TableConfigWritableDao(this.databaseClient);
    return this.tableConfigDao.deleteSyncVersion(syncDataType);
  }

  resetDealInfoTable() {
    if (!this.dealInfoDao) this.dealInfoDao = new DealInfoWritableDao(this.databaseClient);
    this.dealInfoDao.dropTable();
    this.dealInfoDao.createTable();
  }

  upsertDealInfoList(list: DealInfoSync[]) {
    if (!this.dealInfoDao) this.dealInfoDao = new DealInfoWritableDao(this.databaseClient);
    this.dealInfoDao.upsertList(list);
  }

  deleteDealInfoList(list: DealInfoSync[]) {
    if (!this.dealInfoDao) this.dealInfoDao = new DealInfoWritableDao(this.databaseClient);
    return this.dealInfoDao.deleteList(list);
  }

  hardDeleteDisabledDealInfo() {
    if (!this.dealInfoDao) this.dealInfoDao = new DealInfoWritableDao(this.databaseClient);
    this.dealInfoDao.hardDeleteDisabled();
  }

  resetBondDetailTable() {
    if (!this.bondDetailDao) this.bondDetailDao = new BondDetailWritableDao(this.databaseClient);
    this.bondDetailDao.dropTable();
    this.bondDetailDao.createTable();
  }

  upsertBondDetailList(list: BondDetailSync[]) {
    if (!this.bondDetailDao) this.bondDetailDao = new BondDetailWritableDao(this.databaseClient);
    this.bondDetailDao.upsertList(list);
  }

  deleteBondDetailList(list: BondDetailSync[]) {
    if (!this.bondDetailDao) this.bondDetailDao = new BondDetailWritableDao(this.databaseClient);
    return this.bondDetailDao.deleteList(list);
  }

  hardDeleteDisabledBondDetail() {
    if (!this.bondDetailDao) this.bondDetailDao = new BondDetailWritableDao(this.databaseClient);
    this.bondDetailDao.hardDeleteDisabled();
  }
}
