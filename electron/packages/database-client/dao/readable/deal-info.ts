import { BondDealStatus, ProductType } from '@fepkg/services/types/enum';
import moment from 'moment';
import squel from 'squel';
import { dealInfoSql } from '../../sql/deal_info';
import { DealInfoDb } from '../../types';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { formatDealInfoDb2DealInfoSync } from './utils';

export class DealInfoReadableDao extends BaseDao implements Readable {
  getAccessGrantDealInfoByDealTime(product_type: ProductType, broker_list: string[], deal_time?: string) {
    const queryList = squel
      .select()
      .from('deal_info')
      .field('deal_info.*')
      .where(`deal_info.product_type = ${product_type}`)
      .where('deal_info.enable = 1')
      .where(
        squel
          .expr()
          .or('deal_info.bid_broker_id in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.bid_broker_id_b in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.bid_broker_id_c in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.bid_broker_id_d in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id_b in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id_c in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id_d in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
      )
      .where(`deal_info.deal_status != ${BondDealStatus.DealDelete}`)
      .order('deal_info.create_time', false);

    const queryConfirmTotal = squel
      .select()
      .from('deal_info')
      .field('count(*)', 'total')
      .where(`deal_info.product_type = ${product_type}`)
      .where('deal_info.enable = 1')
      .where(
        squel
          .expr()
          .or('deal_info.bid_broker_id in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.bid_broker_id_b in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.bid_broker_id_c in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.bid_broker_id_d in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id_b in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id_c in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
          .or('deal_info.ofr_broker_id_d in '.concat('(', broker_list.map(id => `'${id}'`).join(','), ')'))
      )
      .where(`deal_info.deal_status != ${BondDealStatus.DealDelete}`)
      .where(`deal_info.deal_status in (${BondDealStatus.DealConfirmed},${BondDealStatus.DealPartConfirmed})`);

    const today = moment().startOf('day');
    if (deal_time) {
      const dealDay = moment(deal_time).startOf('day');
      const timeRange = `deal_info.create_time between ${dealDay.valueOf()} and ${dealDay
        .clone()
        .add(1, 'day')
        .valueOf()}`;
      const filter = squel
        .expr()
        .and(
          squel
            .expr()
            .or(`deal_info.bid_traded_date >= ${today.valueOf()}`)
            .or(`deal_info.ofr_traded_date >= ${today.valueOf()}`)
        );
      if (dealDay.valueOf() < today.valueOf()) {
        filter.and(`deal_info.deal_status in (${BondDealStatus.DealConfirmed},${BondDealStatus.DealPartConfirmed})`);
      }
      queryList.where(timeRange).where(filter);
      queryConfirmTotal.where(timeRange).where(filter);
    } else {
      queryList.where(
        squel
          .expr()
          .or(`deal_info.create_time >= ${today.valueOf()}`)
          .or(
            squel
              .expr()
              .and(
                squel
                  .expr()
                  .or(`deal_info.bid_traded_date >= ${today.valueOf()}`)
                  .or(`deal_info.ofr_traded_date >= ${today.valueOf()}`)
              )
              .and(`deal_info.deal_status in (${BondDealStatus.DealConfirmed},${BondDealStatus.DealPartConfirmed})`)
          )
      );
      queryConfirmTotal.where(`deal_info.create_time between ${today.valueOf()} and ${today.add(1, 'day').valueOf()}`);
    }

    const resultList = this.databaseClient.all<DealInfoDb[]>(queryList.toString());
    const resultConfirmTotal = this.databaseClient.get<{ total: number }>(queryConfirmTotal.toString());

    return {
      deal_info_list: resultList?.map(formatDealInfoDb2DealInfoSync) ?? [],
      confirm_total: resultConfirmTotal.total
    };
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(dealInfoSql.getLastVersion);
    return result?.sync_version;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(dealInfoSql.getTotal);
    return result.total;
  }
}
