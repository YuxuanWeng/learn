import { AlgoBondQuoteType, BdsProductType } from '@fepkg/services/types/algo-enum';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { BondQuoteType } from '@fepkg/services/types/bds-enum';

/** 最小窗口高 */
export const MIN_WINDOW_HEIGHT = 720;

/** 窗口宽 */
export const WINDOW_WIDTH = 464;
/** 窗口高 */
export const WINDOW_HEIGHT = 720;

export const CHAT_ROOM_DOM_ID = 'chat_room_dom_id';

export const QuoteTypeMap = {
  [AlgoBondQuoteType.TypeNone]: BondQuoteType.TypeNone,
  [AlgoBondQuoteType.CleanPrice]: BondQuoteType.CleanPrice,
  [AlgoBondQuoteType.FullPrice]: BondQuoteType.FullPrice,
  [AlgoBondQuoteType.Yield]: BondQuoteType.Yield,
  [AlgoBondQuoteType.Spread]: BondQuoteType.Spread
};

export const ProductTypeMap = {
  [BdsProductType.ABS]: ProductType.ABS,
  [BdsProductType.BCO]: ProductType.BCO,
  [BdsProductType.BNC]: ProductType.BNC,
  [BdsProductType.FXO]: ProductType.FXO,
  [BdsProductType.IRS]: ProductType.IRS,
  [BdsProductType.NCD]: ProductType.NCD,
  [BdsProductType.SLD]: ProductType.SLD
};

export const BdsProductTypeMap = {
  [ProductType.ABS]: BdsProductType.ABS,
  [ProductType.BCO]: BdsProductType.BCO,
  [ProductType.BNC]: BdsProductType.BNC,
  [ProductType.FXO]: BdsProductType.FXO,
  [ProductType.IRS]: BdsProductType.IRS,
  [ProductType.NCD]: BdsProductType.NCD,
  [ProductType.SLD]: BdsProductType.SLD
};
