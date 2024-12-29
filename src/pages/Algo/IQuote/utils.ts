import { QuickChatCardInfo, QuickChatChatScript, QuickChatHandicap } from '@fepkg/services/types/algo-common';
import {
  AlgoBondQuoteType,
  BdsProductType,
  QuickChatAlgoOperationType,
  QuickChatScriptAlgoOperationType,
  YieldType
} from '@fepkg/services/types/algo-enum';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { CreateDialogParams } from 'app/windows/models/base';
import { MIN_WINDOW_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH } from './constants';
import { OperationCardProp } from './types';

export const getIQuoteDialogConfig = (productType: ProductType): Omit<CreateDialogParams, 'category'> => ({
  name: WindowName.IQuote,
  options: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    maxWidth: WINDOW_WIDTH,
    maxHeight: 99999,
    minHeight: MIN_WINDOW_HEIGHT,
    minWidth: WINDOW_WIDTH,
    resizable: true
  },
  custom: {
    route: CommonRoute.IQuote,
    routePathParams: [productType.toString()]
  }
});

export const getCardOutOfDeviation = ({
  card,
  handicaps,
  deviation
}: {
  card: QuickChatCardInfo;
  handicaps?: QuickChatHandicap[];
  deviation?: number;
}) => {
  if (![QuickChatAlgoOperationType.QuickChatADD, QuickChatAlgoOperationType.QuickChatUPD].includes(card.operation_type))
    return false;

  const currentHandicap = handicaps?.find(h => h.bond_info.code_market === card.code_market);

  if ((currentHandicap?.bond_info.val_yield_mat ?? 0) === 0) return false;
  if (card.price == undefined) return false;

  const isYieldTypeNeedDeviation =
    (card.product_type === BdsProductType.BCO &&
      card.price_type === AlgoBondQuoteType.Yield &&
      card.yield_type === YieldType.Expiration) ||
    (card.product_type === BdsProductType.BNC && card.price_type === AlgoBondQuoteType.Yield);

  const isOutOfDeviation =
    isYieldTypeNeedDeviation &&
    deviation != null &&
    card.price != null &&
    Math.abs(card.price - (currentHandicap?.bond_info.val_yield_mat ?? 0)) > deviation / 100;

  return isOutOfDeviation;
};

export const getDefaultChatScript = (
  operationType: QuickChatAlgoOperationType,
  chatScriptList: {
    [key in QuickChatScriptAlgoOperationType]: QuickChatChatScript;
  }
) => {
  const target = chatScriptList[
    {
      [QuickChatAlgoOperationType.QuickChatADD]: QuickChatScriptAlgoOperationType.QuickChatScriptADD,
      [QuickChatAlgoOperationType.QuickChatGVN]: QuickChatScriptAlgoOperationType.QuickChatScriptGVN,
      [QuickChatAlgoOperationType.QuickChatTKN]: QuickChatScriptAlgoOperationType.QuickChatScriptTKN,
      [QuickChatAlgoOperationType.QuickChatUPD]: QuickChatScriptAlgoOperationType.QuickChatScriptUPD,
      [QuickChatAlgoOperationType.QuickChatREF]: QuickChatScriptAlgoOperationType.QuickChatScriptREF
    }[operationType]
  ] as QuickChatChatScript;

  return target.chat_script;
};

export const getCardForPayload = (card: OperationCardProp) => {
  const result: OperationCardProp = { ...card };

  delete result.sendError;
  delete result.loading;
  delete result.isUpdBondChanged;

  return result as QuickChatCardInfo;
};
