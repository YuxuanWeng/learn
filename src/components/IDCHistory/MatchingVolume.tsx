import { useEffect, useRef, useState } from 'react';
import { numberLimitedRegexp } from '@fepkg/common/utils';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { receiptDealUnreferQuote } from '@fepkg/services/api/receipt-deal/unrefer-quote';
import { DealRecord } from '@fepkg/services/types/bds-common';
import { idcSpotToastRequestError } from '@/pages/Spot/types';

type MatchingVolumeProps = {
  /** 是否可编辑的 */
  editable?: boolean;
  /** 是否暗盘 */
  internal?: boolean;
  /** 匹配量 */
  volume: number;
  /** 匹配量变更回调 */
  onChange?: (val: number, onError: VoidFunction) => void;
  historyInfo?: DealRecord;
  isSpottedSelf?: boolean;
  isHistory?: boolean;
};

const VolumeReg = numberLimitedRegexp(3, 5, { allowBlankInteger: true });

// 处理浮点数问题
const getVolumeText = (volume: number) => {
  return Number((volume / 1000).toFixed(5)).toString();
};

const getVolumeFromText = (inputVal: string) => {
  return Number((Number(inputVal) * 1000).toFixed(2));
};

/**
 * 第二行-匹配量
 * 1. 匹配量展示的单位时万，修改状态的单位是千万，触发修改传给后端的单位是万
 * 2. 清空内容后回车，退回到上一保存值
 * 3. 切换修改状态自动聚焦并选中
 *  */
export const Inner = ({
  editable,
  internal,
  volume,
  onChange,
  historyInfo,
  isSpottedSelf,
  isHistory
}: MatchingVolumeProps) => {
  const [isModify, setIsModify] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(getVolumeText(volume));

  const volRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setInputValue(getVolumeText(volume));
  };

  // 触发成交量修改
  const triggerPriceModify = () => {
    if (inputValue.trim() === '' || Number(inputValue) === 0) {
      setInputValue(getVolumeText(volume));
      onChange?.(volume, reset);
    } else onChange?.(getVolumeFromText(inputValue), reset);
    setIsModify(false);
  };

  useEffect(() => {
    if (!editable) {
      setIsModify(false);
    }
  }, [editable]);

  return (
    <div className="flex-1 min-w-[108px] flex">
      {isModify ? (
        <Input
          className="h-8 !w-[108px]"
          ref={volRef}
          value={inputValue}
          defaultValue={getVolumeText(volume)}
          onChange={val => {
            if (VolumeReg.test(val)) setInputValue(val);
          }}
          onBlur={triggerPriceModify}
          onEnterPress={triggerPriceModify}
        />
      ) : (
        <div
          className="flex items-center gap-1 h-8 w-full"
          onDoubleClick={() =>
            editable &&
            setIsModify(() => {
              requestIdleCallback(() => {
                volRef.current?.focus();
                volRef.current?.select();
              });
              return true;
            })
          }
        >
          <span className="inline-flex justify-center items-center w-6 h-6 rounded border border-solid border-gray-600 text-primary-100 font-medium text-xs mr-1">
            Vol
          </span>
          <div className="flex-1 overflow-hidden">
            <div className={`text-sm ${internal ? 'text-primary-200' : 'text-orange-050'} font-semibold`}>
              {getVolumeFromText(inputValue)}
            </div>
            {historyInfo?.flag_unrefer_quote && isSpottedSelf && !isHistory && (
              <div className="text-gray-200 text-xs flex items-center">
                <Tooltip
                  truncate
                  content={historyInfo.remain_volume?.toString()}
                >
                  <div className="truncate">Ref {historyInfo.remain_volume}</div>
                </Tooltip>
                <Tooltip content="点击反挂">
                  <Button
                    className="!p-0 w-4 h-4 !rounded-sm ml-1 !text-xs inline-flex justify-center items-center"
                    plain
                    onClick={() => {
                      receiptDealUnreferQuote({ parent_deal_id: historyInfo.deal_id }).catch(error => {
                        idcSpotToastRequestError(error);
                      });
                    }}
                  >
                    挂
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MatchingVolume = (props: MatchingVolumeProps) => {
  const key = `${props.volume}-${props.internal}`;
  return (
    <Inner
      key={key}
      {...props}
    />
  );
};
