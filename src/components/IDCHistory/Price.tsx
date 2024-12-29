import { useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { NEW_SERVER_NIL } from '@fepkg/business/constants';
import { SERVER_NIL } from '@fepkg/common/constants';
import { numberLimitedRegexp } from '@fepkg/common/utils';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { BondQuoteType } from '@fepkg/services/types/enum';
import { isNaN } from 'lodash-es';
import { useDoubleClick } from '@/common/hooks/useDoubleClick';

type PriceProps = {
  /** 是否可编辑的 */
  editable?: boolean;
  /** 收益率？净价？全价？ */
  price: string;
  /** 价格类型 Yield:收益率 CleanPrice:净价 FullPrice:全价 Spread:利差 */
  price_type?: BondQuoteType;
  /** 返点 */
  rebate: string;
  /** 请求修改价格 */
  onChangePrice?: ({ val, type, onError }: { val: number; type: BondQuoteType; onError: VoidFunction }) => void;
  /** 请求修改返点 */
  onChangeRebate?: (val: string, onError: VoidFunction) => void;
};

const PRICE_REG = numberLimitedRegexp(3, 4, { allowBlankInteger: true });
const REBATE_REG = numberLimitedRegexp(3, 4, { allowBlankInteger: true });
const NO_REBATE = new Set([0, SERVER_NIL, NEW_SERVER_NIL]);

// 四舍五入取几位小数，不够用0补到第二位
const roundItOff = (num: number) =>
  num
    // 四舍五入取4位小数
    .toFixed(4)
    // 将最后两位位的0去掉
    .replace(/0{1,2}$/, '');

// 返点内容渲染
const RebateRender = ({ text, editable }: { text: string; editable?: boolean }) => {
  const className = 'font-bold text-sm h-6 leading-6 text-orange-050 mt-1';
  // text是空的时候展示F图标
  if (NO_REBATE.has(+text))
    return (
      <Button
        className="h-6 w-6 px-0"
        type="gray"
        plain
        disabled={!editable}
      >
        F
      </Button>
    );

  // text转换number的时候，如果是NaN表示当前需要展示汉字
  if (isNaN(+text)) return <div className={className}>{text}</div>;

  // 正常展示返点值
  return <div className={className}>F{text}</div>;
};

/**
 * 第二行-价格、报价、返点
 * 1. 清空价格，回到原来的价格
 * 2. 返点为空时展示F图标
 * 3. 价格大于30时，自动切换到净价
 * 4. 单击净价/全价进行互换
 * 5. 切换修改状态自动聚焦并选中
 * 6. TODO 第三、四位的0不展示
 */
export const Inner = ({
  editable,
  price: originPrice,
  price_type = BondQuoteType.Yield,
  rebate,
  onChangePrice,
  onChangeRebate
}: PriceProps) => {
  const soldPrice = roundItOff(+originPrice);
  const goodRebate = NO_REBATE.has(+rebate) ? '' : roundItOff(+rebate);

  const [priceModify, setPriceModify] = useState(false);
  const [rebateModify, setRebateModify] = useState(false);

  const [price, setPrice] = useState(soldPrice);
  const [rRebate, setRRebate] = useState(goodRebate);
  const [priceType, setPriceType] = useState(price_type);

  const reset = () => {
    setPrice(soldPrice);
    setRRebate(goodRebate);
    setPriceType(price_type);
  };

  const priceRef = useRef<HTMLInputElement>(null);
  const rebateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editable) {
      setPriceModify(false);
      setRebateModify(false);
    }
  }, [editable]);

  // 这里用内部状态而不是外部事实数据的原因是：让价格修改看起来更流畅
  const [intNum, floatNum] = roundItOff(+price).split('.');

  // 返点展示状态-净价、全价和返点为空时可以点击
  function onRebateClick() {
    if (!editable) return;

    switch (priceType) {
      case BondQuoteType.Yield:
        // 收益率时，没有返点才能执行单击
        if (NO_REBATE.has(+rebate))
          setRebateModify(() => {
            requestIdleCallback(() => {
              rebateRef.current?.focus();
              rebateRef.current?.select();
            });
            return true;
          });
        break;
      default:
        break;
    }
  }

  function onRebateDoubleClick() {
    // 待确认-净价/全价时不能通过双击切换input状态
    if (!editable || priceType === BondQuoteType.CleanPrice || priceType === BondQuoteType.FullPrice) return;
    setRebateModify(() => {
      requestIdleCallback(() => {
        rebateRef.current?.focus();
        rebateRef.current?.select();
      });
      return true;
    });
  }

  // 价格输入框change事件
  const handlePriceChange = (val: string) => {
    if (!PRICE_REG.test(val)) return;
    // 价格大于30时，自动切换到净价，反之切换回收益率
    if (Number(val) > 30) {
      setPriceType(BondQuoteType.CleanPrice);
      setRRebate('');
    } else if (val !== '') {
      setPriceType(BondQuoteType.Yield);
    }
    // 赋值
    setPrice(val);
  };

  const { handleClick } = useDoubleClick({ onClick: onRebateClick, onDoubleClick: onRebateDoubleClick });

  // 触发价格修改
  const triggerPriceModify = () => {
    // 清空价格和价格未变动的时候，不触发价格修改
    if (price.trim() === '' || soldPrice == price || Number(price) === 0) {
      setPriceType(price_type);
      setPrice(soldPrice);
    } else onChangePrice?.({ val: +price, type: priceType, onError: reset });
    setPriceModify(false);
  };

  const triggerRebateModify = () => {
    // 如果当前没有返点，用户输入0后不触发修改返点
    const isZero = !goodRebate && NO_REBATE.has(+rRebate);
    // 当前修改的状态和传入的状态不同，且不为0才出发修改
    if (goodRebate != roundItOff(+rRebate) && !isZero) {
      onChangeRebate?.(rRebate, reset);
    }
    setRebateModify(false);
    setRRebate(prev => {
      if (isZero) return goodRebate;
      return prev;
    });
  };

  const returnPoint = useMemo(() => {
    switch (priceType) {
      case BondQuoteType.CleanPrice:
        return '净价';
      case BondQuoteType.FullPrice:
        return '全价';
      default:
        return roundItOff(+rRebate);
    }
  }, [priceType, rRebate]);

  return (
    <div className="flex flex-1 min-w-[172px] overflow-hidden items-center">
      {priceModify ? (
        <Input
          ref={priceRef}
          className="flex-shrink-0 !w-[92px] h-8 text-sm font-medium mr-1"
          padding={[0, 7]}
          defaultValue={soldPrice}
          value={price}
          onChange={handlePriceChange}
          onBlur={triggerPriceModify}
          onEnterPress={triggerPriceModify}
        />
      ) : (
        <>
          <span className="inline-flex flex-shrink-0 justify-center items-center w-6 h-6 rounded border border-solid border-gray-600 text-primary-100 font-medium text-xs mr-1">
            Px
          </span>
          <Tooltip
            truncate
            content={price}
          >
            <div
              onDoubleClick={() =>
                editable &&
                setPriceModify(() => {
                  requestIdleCallback(() => {
                    priceRef.current?.focus();
                    priceRef.current?.select();
                  });
                  return true;
                })
              }
              className="h-6 pr-1 text-orange-050 font-extrabold truncate"
            >
              <span className={cx({ 'text-sm': floatNum, 'text-md': !floatNum || +intNum > 30 })}>{intNum}</span>
              <span className="text-md">{floatNum && `.${floatNum}`}</span>
            </div>
          </Tooltip>
        </>
      )}

      {/* 返点 */}
      {rebateModify && editable ? (
        <Input
          ref={rebateRef}
          className="!w-[92px] h-8 text-sm font-medium flex-shrink-0"
          defaultValue={NO_REBATE.has(+rebate) ? '' : rebate}
          value={rRebate}
          // 这个onChange是有必要的，用于限制用户输入
          onChange={val => {
            if (REBATE_REG.test(val)) setRRebate(val);
          }}
          onBlur={triggerRebateModify}
          onEnterPress={triggerRebateModify}
        />
      ) : (
        <div onClick={handleClick}>
          <RebateRender
            editable={editable}
            text={returnPoint}
          />
        </div>
      )}
    </div>
  );
};

export const PriceRender = (props: PriceProps) => {
  const key = `${props.price}-${props.price_type}-${props.rebate}`;
  return (
    <Inner
      key={key}
      {...props}
    />
  );
};
