import { CSSProperties, useState } from 'react';
import cx from 'classnames';
import { DropDownProps, Dropdown } from 'antd';
import { getCP } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { ModalUtils } from '@fepkg/components/Modal';
import { Tooltip } from '@fepkg/components/Tooltip';
import type { BondQuoteMulRef } from '@fepkg/services/types/bond-quote/mul-ref';
import { DealQuote, QuoteLite } from '@fepkg/services/types/common';
import { OperationSource, OperationType, RefType } from '@fepkg/services/types/enum';
import { mulRefBondQuote } from '@/common/services/api/bond-quote/mul-ref';
import { isNumberNil } from '@/common/utils/quote';
import { SideCellPrice, getSideFontCls } from '@/components/QuoteTableCell';
import { useHead } from './HeadProvider';

type IProps = Omit<DropDownProps, 'overlay'> & {
  disabled?: boolean;
  quoteList?: DealQuote[];
  onQuoteRefered?: (quote: QuoteLite | DealQuote) => void;
  simplifyMode?: boolean;
  isDetail?: boolean;
};

const referQuote = async (quote: QuoteLite | DealQuote) => {
  const params: BondQuoteMulRef.Request = {
    stc_force: true,
    quote_id_list: [quote.quote_id],
    refer_type: RefType.Manual,
    operation_info: {
      operation_type: OperationType.BondQuoteRefer,
      operation_source: OperationSource.OperationSourceBdsIdc
    }
  };
  const res: BondQuoteMulRef.Response = await mulRefBondQuote(params);
  return res;
};

export default function ReferDropdown({
  disabled,
  quoteList,
  onQuoteRefered,
  simplifyMode,
  isDetail,
  ...rest
}: IProps) {
  const { accessCache } = useHead();
  const [open, setOpen] = useState(false);
  const hide = () => setOpen(false);

  const referDisabled = !accessCache.refer || disabled || !quoteList?.length;

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    rest?.onVisibleChange?.(newOpen);
  };

  const doRefer = async (quote: QuoteLite | DealQuote) => {
    await referQuote(quote);
    onQuoteRefered?.(quote);
    hide();
  };

  const onQuoteClick = (quote: QuoteLite | DealQuote) => {
    if (quote.flag_stc) {
      ModalUtils.confirm({
        content: (
          <label className="flex justify-center items-center text-white">
            <i
              className="bgicon-state_3 w-[14px] h-[14px] pointer-events-none mr-2"
              style={{ '--color': 'var(--color-auxiliary-200)' } as CSSProperties}
            />
            确认撤销此挂单吗！
          </label>
        ),
        onOk: () => {
          doRefer(quote);
        },
        autoFocusButton: null,
        mask: false,
        maskClosable: true,
        wrapClassName: 'idc-stc-refer-confirm',
        zIndex: 2000,
        bodyStyle: {
          textAlign: 'center',
          borderRadius: 2
        }
      });
      return;
    }
    doRefer(quote);
  };

  const price = (quote: Partial<DealQuote>) => {
    const { side, quote_type, quote_price, return_point, flag_rebate, flag_intention } = quote;
    const fontCls = getSideFontCls(side);

    return (
      <SideCellPrice
        className={fontCls}
        quote={quote}
        quoteType={quote_type}
        side={side}
        price={quote_price}
        returnPoint={return_point}
        rebate={flag_rebate}
        intention={flag_intention}
      />
    );
  };

  return (
    <Dropdown
      {...rest}
      trigger={['click']}
      placement="bottomLeft"
      visible={!referDisabled && open}
      disabled={referDisabled}
      onVisibleChange={onOpenChange}
      overlay={
        <div
          className={cx(
            'w-[392px] max-h-[192px] border border-solid border-gray-500 overflow-y-overlay bg-gray-600 rounded-lg p-2',
            'flex flex-col gap-[2px]'
          )}
        >
          {quoteList?.map(quote => {
            const cp = getCP({
              productType: quote.product_type,
              inst: quote.inst_info,
              trader: quote.trader_info
            });

            return (
              <div
                key={quote.quote_id}
                className={cx('w-full flex items-center hover:bg-gray-500 h-7 rounded-lg px-4')}
                onClick={() => onQuoteClick(quote)}
              >
                {/* 机构(交易员) */}
                <Tooltip
                  truncate
                  content={cp}
                >
                  <span className="w-[180px] text-orange-050 text-sm font-bold truncate">{cp}</span>
                </Tooltip>

                <Tooltip
                  truncate
                  content={price(quote)}
                >
                  <span className="!w-[100px] flex justify-end pr-4">{price(quote)}</span>
                </Tooltip>

                <Tooltip
                  truncate
                  content={quote.volume}
                >
                  <div className="!w-[96px] flex justify-end">
                    <span
                      className={cx(
                        'text-sm font-bold truncate ',
                        quote.flag_internal ? 'text-primary-200' : 'text-orange-050'
                      )}
                    >
                      {!isNumberNil(quote.volume) ? quote.volume : '--'}
                    </span>
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      }
    >
      {simplifyMode ? (
        <Button
          plain
          type="gray"
          className="w-[42px] h-6 !text-xs"
          disabled={referDisabled}
        >
          REF
        </Button>
      ) : (
        <Button
          ghost
          type="gray"
          className={cx('w-16', isDetail && 'h-7')}
          disabled={referDisabled}
        >
          Refer
        </Button>
      )}
    </Dropdown>
  );
}
