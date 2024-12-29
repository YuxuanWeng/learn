import { RequestConfig } from '@fepkg/request/types';
import type { BondQuoteMulCreate } from '@fepkg/services/types/bond-quote/mul-create';
import type { BondQuoteMulRef } from '@fepkg/services/types/bond-quote/mul-ref';
import type { BondQuoteMulUpdate } from '@fepkg/services/types/bond-quote/mul-update';
import { QuoteLite, QuoteUpdate } from '@fepkg/services/types/common';
import { Enable, ProductType, OperationType as ServiceOperationType } from '@fepkg/services/types/enum';
import { context } from '@opentelemetry/api';
import { cloneDeep, uniq } from 'lodash-es';
import { mulCreateBondQuote } from '@/common/services/api/bond-quote/mul-create';
import { mulRefBondQuote } from '@/common/services/api/bond-quote/mul-ref';
import { mulUpdateBondQuote } from '@/common/services/api/bond-quote/mul-update';
import { logger } from '@/common/utils/logger';
import { trackSpecialSlow } from '@/common/utils/logger/special';
import { updateQuoteUndoSnapshot } from '@/common/utils/undo';
import { OperationType } from './types';

export type QuoteUndoRequestConfig = RequestConfig & {
  isUndo?: boolean;
  type?: OperationType;
  origin?: QuoteLite[];
  productType?: ProductType;
  tag?: string;
};

const getConflict = (response: BondQuoteMulUpdate.Response) => {
  // 判断编辑报价是否是删除了原来的报价而新增报价(eg: 换边操作)
  const data: QuoteUpdate[] =
    response.covered_quote_id_list
      ?.concat(response.created_quote_id_list || [])
      .map(v => ({ quote_id: v, enable: Enable.DataDisable })) || [];
  const isAdd = !!data?.length;
  const referred = response.refered_quote_id_list;
  const hasReferred = !!referred?.length;

  let referredList: QuoteUpdate[] = [];
  if (hasReferred) {
    referredList = referred.map(v => ({
      quote_id: v,
      refer_type: 0,
      // 业务需求: 当refer时，取消有效报价的almost_done状态，unrefer时不恢复almost_done状态
      almost_done: false,
      operation_type: ServiceOperationType.BondQuoteUndoUnRefer
    }));
  }
  return {
    isConflict: isAdd || hasReferred,
    data: [...data, ...referredList]
  };
};

/** 批量创建报价 */
export const mulCreateBondQuoteWithUndo = async (
  params: BondQuoteMulCreate.Request,
  config?: QuoteUndoRequestConfig
) => {
  const response = await mulCreateBondQuote(params, { ...config, preventExecWithFailed: true });
  const ctx = config?.traceCtx ?? context.active();
  try {
    if (config?.productType) {
      const ids = uniq([...(response.created_quote_id_list || []), ...(response.covered_quote_id_list || [])]);
      const data = ids.map(v => ({
        quote_id: v,
        enable: Enable.DataDisable
      }));
      const tag = data.length === 1 ? response.bond_short_name || config.tag : void 0;

      await updateQuoteUndoSnapshot(data, config?.type || OperationType.Add, config?.productType, tag);

      logger.ctxInfo(ctx, `[mulCreateBondQuoteWithUndo] update undo snapshot done, data=${JSON.stringify(data)}`);
    }
  } catch (ex) {
    logger.ctxError(ctx, `[mulCreateBondQuoteWithUndo] failed update undo snapshot with create quote, exception=${ex}`);
    trackSpecialSlow('undo-update-error-with-create-quote', ex);
  }
  return response;
};

/** 批量ref报价 */
export const mulRefBondQuoteWithUndo = async (params: BondQuoteMulRef.Request, config?: QuoteUndoRequestConfig) => {
  await mulRefBondQuote(params, config);
  const ctx = config?.traceCtx ?? context.active();
  if (!config?.origin || !config.productType) return;
  try {
    const tag = config.origin.length === 1 ? config.origin[0].bond_basic_info?.short_name : undefined;
    const referData = config.origin.map(v => Object.assign(cloneDeep(v), { almost_done: false }));

    await updateQuoteUndoSnapshot(referData, config.type || OperationType.Refer, config.productType, tag);

    logger.ctxInfo(ctx, `[mulRefBondQuoteWithUndo] update undo snapshot done, referData=${JSON.stringify(referData)}`);
  } catch (ex) {
    logger.ctxError(ctx, `[mulRefBondQuoteWithUndo] failed update undo snapshot with create quote, exception=${ex}`);
    trackSpecialSlow('undo-update-error-with-mul-ref', ex);
  }
};

/** unref 报价 */
export const mulUnrefBondQuoteWithUndo = async (
  params: BondQuoteMulUpdate.Request,
  config?: QuoteUndoRequestConfig
) => {
  const res = await mulUpdateBondQuote(params, { ...config, preventExecWithFailed: true });
  const ctx = config?.traceCtx ?? context.active();
  const successQuoteIds = res.success_quote_id_list ?? [];
  try {
    if (config?.origin && config.productType) {
      const tag = config.origin.length === 1 ? config.origin[0].bond_basic_info?.short_name : undefined;
      const data = config.origin.filter(v => successQuoteIds.includes(v.quote_id));

      await updateQuoteUndoSnapshot(data, config.type || OperationType.Unref, config.productType, tag);

      // 如果是单条 unrefer
      if (params.operation_info?.operation_type === ServiceOperationType.BondQuoteEditReferredQuote) {
        // 判断编辑报价是否是删除了原来的报价而新增报价(eg: 换边操作)
        const resData = res.covered_quote_id_list
          ?.concat(res.created_quote_id_list || [])
          .map(v => ({ quote_id: v, enable: Enable.DataDisable }));

        const isAdd = resData?.length;

        logger.ctxInfo(
          ctx,
          `[unrefBondQuoteWithUndo] update undo snapshot with isAdd, isAdd=${isAdd}, data=${JSON.stringify(data)}`
        );

        await updateQuoteUndoSnapshot(
          isAdd ? data : config.origin,
          config.type || OperationType.Unref,
          config.productType,
          tag
        );
      } else {
        logger.ctxInfo(ctx, `[mulUnrefBondQuoteWithUndo] update undo snapshot done, data=${JSON.stringify(data)}`);
      }
    }
  } catch (ex) {
    if (params.operation_info?.operation_type === ServiceOperationType.BondQuoteEditReferredQuote) {
      logger.ctxError(ctx, `[unrefBondQuoteWithUndo] failed update undo snapshot with unref quote, exception=${ex}`);
      trackSpecialSlow('undo-update-error-with-unref', ex);
    } else {
      logger.ctxError(
        ctx,
        `[mulUnrefBondQuoteWithUndo] failed update undo snapshot with mulUnref quote, exception=${ex}`
      );
      trackSpecialSlow('undo-update-error-with-mul-unref', ex);
    }
  }

  return res;
};

/** 批量更新报价 */
export const mulUpdateBondQuoteWithUndo = async (
  params: BondQuoteMulUpdate.Request,
  config?: QuoteUndoRequestConfig
) => {
  const response = await mulUpdateBondQuote(params, { ...config, preventExecWithFailed: true });
  const ctx = config?.traceCtx ?? context.active();
  const successQuoteIds = response.success_quote_id_list ?? [];

  logger.ctxInfo(
    ctx,
    `[mulUpdateBondQuoteWithUndo] start update undo snapshot, successQuoteIds=${JSON.stringify(successQuoteIds)}`
  );
  try {
    if (config?.origin && config.productType) {
      if (config.isUndo !== false) {
        // 当前操作在后端被忽略的报价条目
        const ignores = response.ignored_quote_id_list || [];

        logger.ctxInfo(
          ctx,
          `[mulUpdateBondQuoteWithUndo] update undo snapshot with ignores, ignores=${JSON.stringify(ignores)}`
        );

        const { isConflict, data } = getConflict(response);

        logger.ctxInfo(
          ctx,
          `[mulUpdateBondQuoteWithUndo] update undo snapshot with conflict, isConflict=${isConflict}, data=${JSON.stringify(
            data
          )}`
        );

        // 过滤掉被忽略的数据 和 失败的报价
        const paramsDataOmitIgnores = config.origin
          .filter(quote => !ignores.includes(quote.quote_id))
          .filter(v => successQuoteIds.includes(v.quote_id));

        // 取过滤后的tag
        const tag =
          paramsDataOmitIgnores.length === 1 ? paramsDataOmitIgnores[0].bond_basic_info?.short_name : undefined;

        // 若发生冲突，则补全冲突数据
        const paramsData = isConflict ? [...paramsDataOmitIgnores, ...data] : paramsDataOmitIgnores;

        await updateQuoteUndoSnapshot(
          /**
           * 如果本次更新产生一个新的报价(比如换边) 或者 本次更新导致原有报价被refer(比如本次更新后的报价 与 原有报价同券同方向同交易员同明暗)，
           * 那么本次操作会产生两次更新记录
           */
          paramsData,
          config.type || OperationType.Edit,
          config.productType,
          tag
        );
      }
    }
  } catch (ex) {
    logger.ctxError(ctx, `[unrefBondQuoteWithUndo] failed update undo snapshot with update quote, exception=${ex}`);
    trackSpecialSlow('undo-update-error-with-mul-update', ex);
  }

  return response;
};
