import { MouseEvent, useMemo } from 'react';
import cx from 'classnames';
import { DEFAULT_KEY_DOWN_THROTTLE_WAIT } from '@fepkg/components/Button/types';
import { TextArea } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconAttentionFilled, IconCloseCircleFilled } from '@fepkg/icon-park-react';
import { BondQuoteType } from '@fepkg/services/types/bds-enum';
import { debounce } from 'lodash-es';
import { getLGBType } from '@/common/utils/copy';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { queryClient } from '@/common/utils/query-client';
import { BrokerName } from '@/components/DealDetailList/item';
import { formatPrice } from '@/components/IDCBoard/utils';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getParsingDealInfoQueryKey, parsingDealInfoQueryFn } from '../../hooks/useParsingDealInfo';
import { useSubmit } from '../../hooks/useSubmit';
import { useReceiptDealBatchForm } from '../../providers/FormProvider';
import { useTextAreaHighlight } from '../../providers/TextAreaHighlightProvider';
import { getCPBidContent, getCPOfrContent } from '../../utils';

const hintText = [
  '200205/12国开24',
  '2.85/85/2.85F0.04/2.85返4毛/98.99',
  '2000/2k/2kw/2千万/0.2e/0.2亿',
  '明天+0',
  'Broker(bid)',
  'Trader(ofr)',
  'Trader(bid)'
];

const lineHeightCls = 'inline-block leading-[14px]';

const CellPrice = ({
  price,
  returnPoint,
  priceType,
  volume
}: {
  price?: number;
  returnPoint?: number;
  priceType?: BondQuoteType;
  volume?: number;
}) => {
  return (
    <div className="h-10 py-1 text-xs">
      <div className="h-[14px] text-orange-100">
        <span className={cx('mr-1 text-sm font-heavy', lineHeightCls)}>{price ? formatPrice(price) : '--'}</span>

        {priceType === BondQuoteType.CleanPrice && <span className={cx('font-medium', lineHeightCls)}>净价</span>}
        {!!returnPoint && <span className={cx('font-medium', lineHeightCls)}>F{formatPrice(returnPoint)}</span>}
      </div>
      <div className="mt-0.5 font-bold text-orange-050 leading-[14px]">{volume ?? '--'}</div>
    </div>
  );
};

const ParsingList = ({ onClick }: { onClick?: (index: number, e: MouseEvent<HTMLDivElement>) => void }) => {
  const { parsingResult, warningStatus, listRefs } = useReceiptDealBatchForm();
  const username = miscStorage.userInfo?.name_cn;

  return parsingResult?.map((item, index) => {
    const { line_id = index, bond_basic } = item;

    const displayCode = bond_basic?.display_code ?? '--';
    const shortName = bond_basic?.short_name ?? '--';
    const category = bond_basic ? getLGBType(bond_basic) : '--';
    const bondField = [displayCode, shortName, category].join(' ');

    return (
      <div
        key={line_id}
        ref={el => {
          listRefs.current[index] = el;
        }}
        className="h-10 relative"
        onClick={e => {
          onClick?.(line_id, e);
        }}
      >
        <div className="h-10 flex items-center px-2 gap-x-2 cursor-pointer text-sm font-bold">
          <div className="h-6">
            <BrokerName
              bidName={item.bid_broker?.name_zh ?? '--'}
              ofrName={username ?? '--'}
            />
          </div>
          <Tooltip
            content={bondField}
            truncate
          >
            <div className="truncate w-[200px] text-gray-000">{bondField ?? '--'}</div>
          </Tooltip>
          <div className="truncate w-30 ">
            <CellPrice
              price={item.price}
              returnPoint={item.return_point}
              priceType={item.price_type}
              volume={item.volume}
            />
          </div>

          <div className="truncate w-[92px]">
            {formatLiquidationSpeedListToString(item.liquidation_speed_list ?? [], 'MM.DD') || '--'}
          </div>
          <Tooltip
            content={getCPOfrContent(item)}
            truncate
          >
            <div className="truncate w-40 text-gray-000">{getCPOfrContent(item)}</div>
          </Tooltip>
          <div className="truncate w-9 text-gray-000">出给</div>
          <Tooltip
            content={getCPBidContent(item)}
            truncate
          >
            <div className="truncate w-40 text-gray-000">{getCPBidContent(item)}</div>
          </Tooltip>
        </div>
        {warningStatus?.[index]?.warningText && (
          <Tooltip
            content={warningStatus[index].warningText}
            placement="bottom-end"
          >
            <IconAttentionFilled className="absolute text-orange-100 right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
          </Tooltip>
        )}
      </div>
    );
  });
};

export const DealBatchForm = () => {
  const { productType } = useProductParams();

  const { text, setText, setErrorInfo } = useReceiptDealBatchForm();
  const { textareaRef, highlightLineByRow } = useTextAreaHighlight();

  const { handleSubmit } = useSubmit();

  const debounceSubmit = useMemo(() => {
    return debounce(handleSubmit, DEFAULT_KEY_DOWN_THROTTLE_WAIT, {
      leading: true,
      trailing: false
    });
  }, [handleSubmit]);

  return (
    <div>
      <div className="group relative">
        <TextArea
          autoFocus
          ref={textareaRef}
          placeholder="请录入/粘贴文本进行识别"
          textareaCls="peer"
          className="bg-gray-800"
          value={text}
          onChange={str => {
            setText(str);
            setErrorInfo({});
          }}
          composition
          autoSize={{ minRows: 5, maxRows: 5 }}
          clearIcon={<IconCloseCircleFilled />}
          onEnterPress={async (val, evt, composing) => {
            // 如果按下 shift 键，仅换行，不进行其他操作
            if (evt.shiftKey) return;

            // 如果不是同时按下 shift 键，阻止默认事件
            evt.preventDefault();
            // 如果不是正在输入中文，进行录入
            if (!composing) {
              const res = await queryClient.ensureQueryData({
                queryKey: getParsingDealInfoQueryKey(val, productType),
                queryFn: parsingDealInfoQueryFn
              });

              debounceSubmit(res?.deal_list);
            }
          }}
        />
      </div>
      <div className="flex items-center mt-3 h-8 bg-orange-700 rounded-lg gap-2 pl-3">
        <span className="text-gray-200">格式:</span>
        {hintText.map(i => (
          <span
            className="text-gray-100"
            key={i}
          >
            {i}
          </span>
        ))}
      </div>
      <div className="mt-3 h-40 bg-gray-800 rounded-lg overflow-overlay">
        <ParsingList onClick={highlightLineByRow} />
      </div>
    </div>
  );
};
