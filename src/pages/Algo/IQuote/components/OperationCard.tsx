import { useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { getDefaultExerciseType } from '@fepkg/business/utils/bond';
import { usePrevious } from '@fepkg/common/hooks';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import {
  IconAttentionFilled,
  IconDelete,
  IconDown,
  IconEdit,
  IconInfoFilled,
  IconSubmit,
  IconUp
} from '@fepkg/icon-park-react';
import {
  AlgoBondQuoteType,
  AlgoDirection,
  BdsProductType,
  QuickChatAlgoOperationType,
  QuickChatTrustDegree,
  YieldType
} from '@fepkg/services/types/algo-enum';
import { FiccBondBasic } from '@fepkg/services/types/bds-common';
import { BondSearchType, ExerciseType, ProductType, Side, UserSettingFunction } from '@fepkg/services/types/enum';
import { useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { formatComment } from '@/common/services/api/bond-quote/search';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { formatPrice } from '@/common/utils/copy';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { SideSwitch } from '@/components/SideSwitch';
import { ExerciseProvider, useExercise } from '@/components/business/ExerciseGroup/provider';
import {
  BondSearch,
  BondSearchProvider,
  transform2BondOpt,
  useBondSearch
} from '@/components/business/Search/BondSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { OperationCardLiquidation } from '@/pages/Algo/IQuote/components/OperationCardLiquidation';
import { FlagIcon, FlagIconType } from '@/pages/Quote/SingleQuote/QuoteOper/FlagIcon';
import { ProductTypeMap, QuoteTypeMap } from '../constants';
import { OperationCardProp } from '../types';
import styles from './index.module.less';

type IProp = {
  innerCard: OperationCardProp;
  setInnerCard: (card: OperationCardProp) => void;
  onConfirm: (card: OperationCardProp) => Promise<void>;
  onDelete: () => void;
  sendError?: string;
};

const getDefaultExercise = (product_type: BdsProductType, quoteType: AlgoBondQuoteType) => {
  const res = getDefaultExerciseType(ProductTypeMap[product_type], QuoteTypeMap[quoteType]);
  return res as unknown as YieldType;
};

// 处理浮点数问题
const getVolumeText = (volume: number) => {
  return Number((volume / 1000).toFixed(5)).toString();
};

const getTypeText = (type: QuickChatAlgoOperationType) => {
  return ({
    [QuickChatAlgoOperationType.QuickChatADD]: 'ADD',
    [QuickChatAlgoOperationType.QuickChatUPD]: 'UPD',
    [QuickChatAlgoOperationType.QuickChatGVN]: 'GVN',
    [QuickChatAlgoOperationType.QuickChatREF]: 'REF',
    [QuickChatAlgoOperationType.QuickChatTKN]: 'TKN'
  }[type] ?? '') as string;
};

const getTypeBGClass = (type: QuickChatAlgoOperationType, canEdit: boolean) => {
  return ({
    [QuickChatAlgoOperationType.QuickChatADD]: cx('bg-green-700 text-green-100', canEdit && 'hover:bg-green-600'),
    [QuickChatAlgoOperationType.QuickChatUPD]: 'bg-purple-700 text-purple-100',
    [QuickChatAlgoOperationType.QuickChatGVN]: 'bg-orange-700 text-orange-100 hover:bg-orange-600',
    [QuickChatAlgoOperationType.QuickChatTKN]: 'bg-secondary-700 text-secondary-100 hover:bg-secondary-600',
    [QuickChatAlgoOperationType.QuickChatREF]: 'bg-danger-700 text-danger-100'
  }[type] ?? '') as string;
};

const getCanTypeSwitch = (type: QuickChatAlgoOperationType) => {
  return ![QuickChatAlgoOperationType.QuickChatREF, QuickChatAlgoOperationType.QuickChatUPD].includes(type);
};

const OperationRender = (bond: FiccBondBasic, keyword: string) => {
  const { productType } = useProductParams();

  return (
    <div className="flex items-center text-gray-100">
      <HighlightOption
        className="w-[120px] truncate"
        keyword={keyword}
        label={bond.display_code}
      />
      <HighlightOption
        className="w-[120px] pl-4 truncate"
        keyword={keyword}
        label={bond.short_name}
      />
      {productType !== ProductType.BNC && (
        <HighlightOption
          className="w-[64px] pl-4 truncate"
          keyword={keyword}
          label={bond.issuer_rating ?? ''}
        />
      )}
      <HighlightOption
        className="w-[100px] pl-4 truncate"
        keyword={keyword}
        label={bond.time_to_maturity ?? ''}
      />
    </div>
  );
};

export const Wrapper = (props: IProp) => {
  const { innerCard, setInnerCard, onConfirm, onDelete, sendError } = props;
  const { product_type, price_type } = innerCard;

  const prevCard = usePrevious(innerCard);

  const [showSettlementModal, setShowSettlementModal] = useState(false);

  const [isSwitchTypeOpen, setIsSwitchTypeOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [isBondEditing, setIsBondEditing] = useState(false);
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [isReturnPointEditing, setIsReturnPointEditing] = useState(false);
  const [isVolumeEditing, setIsVolumeEditing] = useState(false);

  const { bondSearchRef, updateBondSearchState } = useBondSearch();

  /** 价格输入框 */
  const priceInputRef = useRef<HTMLInputElement | null>(null);

  /** 卡片 */
  const containerRef = useRef<HTMLDivElement | null>(null);

  const returnPointInputRef = useRef<HTMLInputElement | null>(null);

  const isRef = innerCard.operation_type === QuickChatAlgoOperationType.QuickChatREF;

  const isAddUpdate = [QuickChatAlgoOperationType.QuickChatADD, QuickChatAlgoOperationType.QuickChatUPD].includes(
    innerCard.operation_type
  );

  const isGVNTKN = [QuickChatAlgoOperationType.QuickChatGVN, QuickChatAlgoOperationType.QuickChatTKN].includes(
    innerCard.operation_type
  );

  const settings = useUserSetting([UserSettingFunction.UserSettingValuationDecimalDigit]);

  const decimal: number | undefined = settings.getSetting(UserSettingFunction.UserSettingValuationDecimalDigit);

  const operationOptions = [
    {
      value: QuickChatAlgoOperationType.QuickChatADD,
      label: 'ADD'
    },
    {
      value: QuickChatAlgoOperationType.QuickChatGVN,
      label: 'GVN'
    },
    {
      value: QuickChatAlgoOperationType.QuickChatTKN,
      label: 'TKN'
    }
  ].filter(o => o.value !== innerCard.operation_type);

  const { refs, floatingStyles, context } = useFloating({
    open: isSwitchTypeOpen,
    onOpenChange: setIsSwitchTypeOpen
  });

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const emptyPriceText = useMemo(() => {
    if (innerCard.flag_rebate) return '--';

    if (isGVNTKN) {
      return innerCard.operation_type === QuickChatAlgoOperationType.QuickChatTKN ? 'BID' : 'OFR';
    }

    return innerCard.direction === AlgoDirection.AlgoDirectionBID ? 'BID' : 'OFR';
  }, [innerCard.flag_rebate, innerCard.direction, isGVNTKN, innerCard.operation_type]);

  const formattedPrice = innerCard.price
    ? formatPrice(Number(innerCard.price.toFixed(innerCard.flag_deviate ? decimal ?? 4 : 4)), 4)
    : '';

  const priceText = innerCard.price ? formattedPrice : emptyPriceText;

  const [priceInput, setPriceInput] = useState(formattedPrice);
  const [volumeInput, setVolumeInput] = useState(() =>
    innerCard.amount == null ? '' : getVolumeText(innerCard.amount)
  );

  const [returnPointInput, setReturnPointInput] = useState(
    innerCard.return_point == null || innerCard.return_point === 0 ? '' : innerCard.return_point.toString()
  );

  /** 含权/非含权的默认都是到期收益率 */
  const defaultYieldType = getDefaultExercise(product_type, price_type ?? AlgoBondQuoteType.Yield);

  const onInputPrice = (price: string) => {
    if (/^(?!0\d)\d{0,3}(\.\d{0,4})?$/.test(price)) {
      const priceNum = Number(price);

      if (price === '') {
        setPriceInput(price);
        setInnerCard({ ...innerCard, price: undefined, flag_deviate: false });
      } else if (!Number.isNaN(priceNum)) {
        setPriceInput(price);

        const targetYieldType =
          innerCard.price_type !== AlgoBondQuoteType.CleanPrice ? innerCard.yield_type : defaultYieldType;

        const targetPriceType = priceNum > 30 ? AlgoBondQuoteType.CleanPrice : AlgoBondQuoteType.Yield;
        if (priceNum > 30) {
          setReturnPointInput('');
        }
        setInnerCard({
          ...innerCard,
          price: priceNum,
          price_type: targetPriceType,
          yield_type: priceNum > 30 ? defaultYieldType : targetYieldType,
          flag_rebate: priceNum > 30 ? false : innerCard.flag_rebate,
          return_point: priceNum > 30 ? 0 : innerCard.return_point,
          exercise_manual: targetPriceType === AlgoBondQuoteType.CleanPrice ? false : innerCard.exercise_manual,
          flag_deviate: false
        });
      }
    }
  };

  const onInputVolume = (volume: string) => {
    if (/^(?!0\d)\d{0,3}(\.\d{0,5})?$/.test(volume)) {
      setVolumeInput(volume);
      const volumeNum = Number(volume) * 1000;
      if (!volume) {
        setInnerCard({ ...innerCard, amount: undefined });
      } else if (!Number.isNaN(volumeNum)) {
        setVolumeInput(volume);
        setInnerCard({ ...innerCard, amount: volumeNum });
      }
    }
  };

  const updateReturnPoint = (val: string) => {
    if (/^(?!0\d)\d{0,3}(\.\d{0,4})?$/.test(val)) {
      const returnPoint = Number(val);

      setReturnPointInput(val);

      if (val === '') {
        setInnerCard({ ...innerCard, return_point: undefined });
      } else if (!Number.isNaN(returnPoint)) {
        setInnerCard({ ...innerCard, return_point: returnPoint });
      }
    }
  };

  useEffect(() => {
    if (prevCard != null && innerCard.operation_type !== prevCard?.operation_type) {
      setShowSettlementModal(false);
      setIsSwitchTypeOpen(false);
      setPriceInput(formattedPrice);
      setReturnPointInput(
        innerCard.return_point == null || innerCard.return_point === 0 ? '' : innerCard.return_point.toString()
      );
    }
  }, [prevCard, innerCard]);

  useEffect(() => {
    if (innerCard.flag_deviate) {
      setPriceInput(formatPrice(innerCard.price, decimal ?? 4).replace(/0+$/, ''));
    }
  }, [decimal, innerCard.flag_deviate]);

  const canEditType = getCanTypeSwitch(innerCard.operation_type) && !innerCard.isUpdBondChanged;

  const isTextBid = isGVNTKN
    ? innerCard.operation_type === QuickChatAlgoOperationType.QuickChatTKN
    : innerCard.direction === AlgoDirection.AlgoDirectionBID;

  const renderPrice = () => {
    return (
      <div
        className={cx(
          isTextBid ? 'text-orange-100' : 'text-secondary-100',
          'font-bold whitespace-nowrap overflow-hidden flex items-end',
          !isRef && 'cursor-pointer'
        )}
      >
        <Tooltip
          truncate
          content={priceText}
        >
          <span
            className="text-lg min-w-[16px] truncate"
            onClick={() => {
              if (isRef) return;
              setIsPriceEditing(true);
            }}
          >
            {priceText}
          </span>
        </Tooltip>
        {innerCard.flag_rebate && !isReturnPointEditing && (
          <Tooltip
            truncate
            content={`F${formatPrice(innerCard.return_point, 4) || '--'}`}
          >
            <span
              className="text-sm inline-block ml-1 min-w-[16px] truncate"
              onClick={() => {
                if (isRef) return;
                setIsReturnPointEditing(true);
              }}
            >
              F{formatPrice(innerCard.return_point, 4) || '--'}
            </span>
          </Tooltip>
        )}
      </div>
    );
  };

  const displayBondMessage = [
    innerCard.time_to_maturity ?? '',
    innerCard.code_market,
    innerCard.bond_short_name,
    product_type !== BdsProductType.BNC && innerCard.rating
  ]
    .filter(Boolean)
    .join('  ');

  const renderInternalButton = () => {
    return (
      <FlagIcon
        className="!min-w-[28px] !h-7"
        size={20}
        side={Side.SideNone}
        active={!!innerCard.flag_internal}
        disabled={isRef}
        type={FlagIconType.Inner}
        onClick={() => {
          setInnerCard({
            ...innerCard,
            flag_internal: !innerCard.flag_internal
          });
        }}
      />
    );
  };

  const renderSubmitButtons = () => {
    return (
      <div className="flex ml-auto gap-x-2">
        <Button.Icon
          plain
          type="danger"
          icon={<IconDelete />}
          className="!w-7 !h-7 !p-0"
          onClick={() => {
            onDelete();
          }}
        />
        <Tooltip content={sendError}>
          <div className="relative">
            {sendError && <IconAttentionFilled className="text-danger-100 absolute -right-[7px] -top-[6px]" />}
            <Button.Icon
              className="!w-7 !h-7 !p-0"
              plain
              type="primary"
              disabled={submitting}
              onClick={async () => {
                try {
                  setSubmitting(true);
                  await onConfirm(innerCard.price ? { ...innerCard, price: Number(formattedPrice) } : innerCard);
                  setSubmitting(false);
                } catch (error) {
                  setSubmitting(false);
                }
              }}
              icon={<IconSubmit />}
            />
          </div>
        </Tooltip>
      </div>
    );
  };

  const SideMap = {
    [AlgoDirection.AlgoDirectionBID]: Side.SideBid,
    [AlgoDirection.AlgoDirectionOFR]: Side.SideOfr,
    [AlgoDirection.AlgoDirectionNone]: Side.SideNone
  };

  const renderBidOfrSwitch = () => {
    return (
      <SideSwitch
        className="w-[124px] !bg-gray-600"
        value={SideMap[innerCard.direction ?? AlgoDirection.AlgoDirectionBID]}
        onChange={val => {
          if (val === Side.SideBid) setInnerCard({ ...innerCard, direction: AlgoDirection.AlgoDirectionBID });
          else setInnerCard({ ...innerCard, direction: AlgoDirection.AlgoDirectionOFR });
        }}
      />
    );
  };

  const renderTime = () => (
    <div className="text-gray-200 text-sm ml-2">{innerCard.recognition_time?.split(' ')[1]}</div>
  );
  const { setInnerValue } = useExercise();

  const updQuoteText = useMemo(() => {
    if (innerCard.quote == null) return undefined;

    const quotePrice = innerCard.quote.quote_price ?? 0;

    const returnPointValue = (innerCard.quote.return_point ?? 0) > 0 ? innerCard.quote.return_point.toString() : '--';

    const returnPointText = innerCard.quote.flag_rebate ? `F${returnPointValue}` : '';

    const bidOfrPriceText = innerCard.quote.side === AlgoDirection.AlgoDirectionBID ? 'BID' : 'OFR';

    const emptyText = returnPointText ? '--' : bidOfrPriceText;

    const quotePriceText = quotePrice > 0 ? quotePrice.toString() : emptyText;

    const fullPriceText = `${quotePriceText}${returnPointText}`;

    const volumeText = innerCard.quote.volume > 0 ? innerCard.quote.volume.toString() : '';

    const liquidation = formatLiquidationSpeedListToString(innerCard.quote.liquidation_speed_list ?? [], 'MM.DD');

    const comment = formatComment({ ...innerCard.quote, has_option: innerCard.has_option });

    const fullComment = [
      innerCard.quote.flag_star === 1 && '*',
      innerCard.quote.flag_star === 2 && '**',
      innerCard.quote.flag_oco && 'oco',
      innerCard.quote.flag_package && '打包',
      innerCard.quote.flag_exchange && '换券',
      liquidation,
      comment
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="max-w-[calc(100vw_-_80px)] whitespace-pre-wrap">
        <span
          className={innerCard.quote.side === AlgoDirection.AlgoDirectionBID ? 'text-orange-100' : 'text-secondary-100'}
        >
          {fullPriceText}{' '}
        </span>
        {volumeText}
        {fullComment ? `(${fullComment})` : ''}
      </div>
    );
  }, [innerCard.quote, innerCard.has_option]);

  return (
    <div
      ref={containerRef}
      className={cx(
        'rounded-lg border border-solid border-transparent select-none py-2 px-[7px] outline-none focus:border-primary-100 bg-[#26272C] mt-2 overflow-hidden'
      )}
      // 需要能够被聚焦
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onKeyDown={evt => {
        if (evt.key === KeyboardKeys.Enter) {
          if (isPriceEditing || isVolumeEditing || isReturnPointEditing) {
            setIsPriceEditing(false);
            setIsVolumeEditing(false);
            setIsReturnPointEditing(false);
            containerRef.current?.focus();
            return;
          }
          evt.stopPropagation();
          onConfirm(innerCard.price ? { ...innerCard, price: Number(formattedPrice) } : innerCard);
        }

        if (evt.key === KeyboardKeys.Tab) {
          // 优先跳转到价格
          if (document.activeElement === containerRef.current) {
            evt.preventDefault();
            setIsPriceEditing(true);
            setIsVolumeEditing(false);
            setIsReturnPointEditing(false);
          }

          if (document.activeElement === priceInputRef.current) {
            evt.preventDefault();
            setIsPriceEditing(false);
            setIsVolumeEditing(!innerCard.flag_rebate);
            setIsReturnPointEditing(innerCard.flag_rebate ?? false);
          }

          // 量输入框不做特别处理，因为下一个原生的就是备注输入框
        }
      }}
    >
      {/* 第一行都渲染 */}
      <div className="flex items-center">
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={cx(
            'w-18 h-7 rounded-lg flex items-center justify-center gap-x-1 pt-[1px] flex-shrink-0 font-bold',
            getTypeBGClass(innerCard.operation_type, canEditType),
            canEditType && 'cursor-pointer'
          )}
          onClick={() => {
            if (!canEditType) return;
            setIsSwitchTypeOpen(val => !val);
          }}
        >
          {getTypeText(innerCard.operation_type)}
          {canEditType && (isSwitchTypeOpen ? <IconUp /> : <IconDown />)}
        </div>
        {isSwitchTypeOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="w-18 border p-2 rounded-lg border-solid border-gray-500 mt-1 bg-gray-600 z-50"
            {...getFloatingProps()}
          >
            {operationOptions.map(o => (
              <div
                key={o.value}
                className="flex-center cursor-pointer h-8 rounded-lg text-sm text-gray-100 hover:text-gray-000 hover:bg-gray-500"
                onClick={() => {
                  setIsSwitchTypeOpen(val => !val);
                  setInnerCard({ ...innerCard, operation_type: o.value });
                }}
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
        {!isBondEditing ? (
          <div
            className="flex items-center min-w-[160px] flex-1 h-7 overflow-hidden mx-2 font-bold"
            onClick={() => {
              if (isRef) return;
              setIsBondEditing(true);
            }}
          >
            <Tooltip
              truncate
              content={displayBondMessage}
            >
              <div className="leading-6 h-6 truncate text-sm text-orange-050 whitespace-pre">{displayBondMessage}</div>
            </Tooltip>
          </div>
        ) : (
          <BondSearch
            strategy="fixed"
            label=""
            className="!h-7 mx-2 flex-1 w-auto"
            autoFocus
            dropdownCls={styles.card_bond_search}
            optionRender={OperationRender}
            searchParams={{ search_type: BondSearchType.SearchAllField }}
            onBlur={() => {
              requestIdleCallback(() => {
                setIsBondEditing(false);

                updateBondSearchState(draft => {
                  if (!draft.selected)
                    draft.selected = transform2BondOpt({
                      key_market: innerCard.key_market,
                      code_market: innerCard.code_market,
                      short_name: innerCard.bond_short_name,
                      time_to_maturity: innerCard.time_to_maturity
                    } as FiccBondBasic);
                });
              });
            }}
            onEnterPress={(_, evt) => evt.stopPropagation()}
            onChange={opt => {
              updateBondSearchState(draft => {
                draft.selected = opt ?? null;
              });

              if (opt == null) {
                return;
              }

              const switchDefaultYieldType = opt.original.has_option ? YieldType.Exercise : YieldType.Expiration;

              const newYieldType =
                innerCard.has_option === opt.original.has_option ? innerCard.yield_type : switchDefaultYieldType;

              setInnerCard({
                ...innerCard,
                code_market: opt.original.code_market,
                key_market: opt.original.key_market,
                bond_short_name: opt.original.short_name,
                delisted_date: opt.original.delisted_date,
                time_to_maturity: opt.original.time_to_maturity,
                has_option: opt.original.has_option,
                rating: opt.original.issuer_rating,
                yield_type: newYieldType,
                exercise_manual: innerCard.has_option === opt.original.has_option ? innerCard.exercise_manual : false
              });

              if (opt.original.has_option) {
                setInnerValue(
                  innerCard.exercise_manual ? (newYieldType as unknown as ExerciseType) : ExerciseType.ExerciseTypeNone
                );
              } else {
                setInnerValue(ExerciseType.Expiration);
              }

              bondSearchRef.current?.blur();
            }}
          />
        )}

        {!isAddUpdate && renderInternalButton()}

        {renderTime()}
      </div>

      {/* 第二行渲染 */}
      <div className="pt-2 flex items-center">
        <div
          className={cx(
            'flex items-center min-w-[160px] flex-[2] flex-shrink-0 h-7 border-transparent border border-solid rounded-lg hover:border-gray-600 px-1 gap-2'
          )}
        >
          {isPriceEditing ? (
            <Input
              ref={priceInputRef}
              autoFocus
              className="!min-w-[70px] h-[26px] flex-shrink-0 flex-1"
              clearIcon={null}
              placeholder="价格"
              value={priceInput}
              onBlur={() => {
                setIsPriceEditing(false);
              }}
              onChange={onInputPrice}
            />
          ) : (
            renderPrice()
          )}
          {isReturnPointEditing && (
            <Input
              ref={returnPointInputRef}
              className="!min-w-[70px] h-[26px] bg-gray-600 flex-1 flex-shrink-0"
              value={returnPointInput}
              autoFocus
              onBlur={() => {
                setIsReturnPointEditing(false);
              }}
              onChange={updateReturnPoint}
            />
          )}
          {innerCard.price_type === AlgoBondQuoteType.Yield && (
            <Button.Icon
              className="w-6 h-6 flex-shrink-0"
              type="orange"
              bright
              checked={innerCard.flag_rebate}
              disabled={isRef}
              onClick={() => {
                if (innerCard.flag_rebate) {
                  setIsReturnPointEditing(false);
                  setInnerCard({
                    ...innerCard,
                    return_point: undefined,
                    flag_rebate: false
                  });
                  setReturnPointInput('');
                } else {
                  setIsReturnPointEditing(true);
                  requestIdleCallback(() => {
                    returnPointInputRef.current?.focus();
                  });
                  setInnerCard({
                    ...innerCard,
                    flag_rebate: true
                  });
                }
              }}
            >
              F
            </Button.Icon>
          )}
          {!innerCard.flag_rebate && innerCard.price != null && innerCard.price !== 0 && (
            <Button.Icon
              className="w-6 h-6 ml-auto"
              type="green"
              bright
              checked={innerCard.price_type === AlgoBondQuoteType.CleanPrice}
              onClick={() => {
                if (innerCard.price_type !== AlgoBondQuoteType.CleanPrice) {
                  setInnerCard({
                    ...innerCard,
                    /** 如果报价类型为净价，则视为到期收益率 */
                    yield_type: defaultYieldType,
                    price_type: AlgoBondQuoteType.CleanPrice,
                    exercise_manual: false
                  });
                  return;
                }
                setInnerCard({
                  ...innerCard,
                  price_type: AlgoBondQuoteType.Yield
                });
              }}
              disabled={isRef}
            >
              净
            </Button.Icon>
          )}
        </div>

        {!isVolumeEditing ? (
          <div
            className="flex flex-1 items-center !min-w-[92px] border-transparent border border-solid rounded-lg hover:border-gray-600 px-1 h-7 overflow-hidden"
            onClick={() => {
              if (isRef) return;
              setIsVolumeEditing(true);
            }}
          >
            <div className="text-xs text-gray-200">Vol</div>
            <div className="ml-1 text-orange-050 text-sm font-bold">{innerCard.amount}</div>
          </div>
        ) : (
          <div className="flex-1">
            <Input
              autoFocus
              className="!min-w-[92px] h-[26px] bg-gray-700"
              placeholder="量(kw)"
              clearIcon={null}
              onBlur={() => {
                setIsVolumeEditing(false);
              }}
              value={volumeInput}
              onChange={val => {
                onInputVolume(val);
              }}
            />
          </div>
        )}

        <div
          className={cx(
            '!h-7 flex-1 min-w-[92px] rounded-lg flex justify-center items-center truncate border-transparent border border-solid hover:border-gray-600 px-1 relative overflow-hidden',
            styles['card-liquidation']
          )}
        >
          <Tooltip
            truncate
            content={formatLiquidationSpeedListToString(innerCard.liquidation_speed_list ?? [], 'MM.DD') || '默认'}
          >
            <span className={cx('text-sm text-orange-050 truncate')}>
              {formatLiquidationSpeedListToString(innerCard.liquidation_speed_list ?? [], 'MM.DD') || '默认'}
            </span>
          </Tooltip>

          <Button.Icon
            text
            className="w-[26px] h-[26px] absolute right-1 hidden"
            icon={<IconEdit />}
            onClick={() => {
              setShowSettlementModal(true);
            }}
          />
        </div>

        <div className="w-16 flex items-center flex-shrink-0">
          {innerCard.operation_type === QuickChatAlgoOperationType.QuickChatUPD && innerCard.quote && (
            <Tooltip content={updQuoteText}>
              <IconInfoFilled className="w-4 h-4 mx-[6px] mr-auto text-orange-100" />
            </Tooltip>
          )}
          {!isAddUpdate && renderSubmitButtons()}
        </div>
      </div>
      {isAddUpdate && (
        <div className="pt-2 flex gap-x-2 items-center">
          {/* 第三行渲染 */}

          {isAddUpdate && renderBidOfrSwitch()}
          <FlagIcon
            className="!min-w-[28px] !h-7"
            size={20}
            side={Side.SideNone}
            active={innerCard.trust_degree === QuickChatTrustDegree.QuickChatTrustDegreeOne}
            type={FlagIconType.SingleStar}
            onClick={() => {
              setInnerCard({
                ...innerCard,
                trust_degree:
                  innerCard.trust_degree === QuickChatTrustDegree.QuickChatTrustDegreeOne
                    ? undefined
                    : QuickChatTrustDegree.QuickChatTrustDegreeOne
              });
            }}
          />
          <FlagIcon
            className="!min-w-[28px] !h-7"
            size={20}
            side={Side.SideNone}
            active={innerCard.trust_degree === QuickChatTrustDegree.QuickChatTrustDegreeTwo}
            type={FlagIconType.DoubleStar}
            onClick={() => {
              setInnerCard({
                ...innerCard,
                trust_degree:
                  innerCard.trust_degree === QuickChatTrustDegree.QuickChatTrustDegreeTwo
                    ? undefined
                    : QuickChatTrustDegree.QuickChatTrustDegreeTwo
              });
            }}
          />

          <FlagIcon
            className="!min-w-[28px] !h-7"
            size={20}
            side={Side.SideNone}
            active={!!innerCard.flag_oco}
            type={FlagIconType.Oco}
            onClick={() => {
              setInnerCard({
                ...innerCard,
                flag_oco: !innerCard.flag_oco
              });
            }}
          />

          {renderInternalButton()}

          {renderSubmitButtons()}
        </div>
      )}

      {showSettlementModal && (
        <OperationCardLiquidation
          card={innerCard}
          productType={innerCard.product_type as unknown as ProductType}
          show={showSettlementModal}
          onCancel={() => {
            setShowSettlementModal(false);
          }}
          delistedDate={innerCard.delisted_date}
          onConfirm={val => {
            setInnerCard({
              ...val
            });
            setShowSettlementModal(false);
          }}
          value={(innerCard.liquidation_speed_list ?? []).map(l => ({ ...l, offset: l.offset ?? 0 }))}
        />
      )}
    </div>
  );
};

export const OperationCard = (props: IProp) => {
  const { innerCard } = props;
  const { has_option, product_type, yield_type, exercise_manual, price_type } = innerCard;
  const quoteType = QuoteTypeMap[price_type ?? AlgoBondQuoteType.Yield];
  const defaultValue = exercise_manual ? (yield_type as unknown as ExerciseType) : ExerciseType.ExerciseTypeNone;

  const { productType } = useProductParams();

  return (
    <BondSearchProvider
      initialState={{
        productType,
        defaultValue: {
          key_market: innerCard.key_market,
          code_market: innerCard.code_market,
          display_code: innerCard.code_market,
          short_name: innerCard.bond_short_name
        } as FiccBondBasic
      }}
    >
      <ExerciseProvider
        {...{
          hasBond: !!innerCard.code_market,
          productType: product_type as unknown as ProductType,
          defaultValue,
          isHasOption: has_option,
          quoteType
        }}
      >
        <Wrapper {...props} />
      </ExerciseProvider>
    </BondSearchProvider>
  );
};
