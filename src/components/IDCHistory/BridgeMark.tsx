import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { Popconfirm } from '@fepkg/components/Popconfirm';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconBridgeText } from '@fepkg/icon-park-react';
import { DealRecord, DefaultBridgeConfig } from '@fepkg/services/types/bds-common';
import { DealType } from '@fepkg/services/types/bds-enum';
import { getSubInternalCode } from '@/common/utils/internal-code';
import { useProductParams } from '@/layouts/Home/hooks';
import { useRecordContent } from '@/pages/Spot/Panel/DealRecord/providers/DealRecordContentProvider';
import { FindBridge } from '../business/FindBridge';

type Props = {
  /** 内码 */
  internalCode: string;
  /** 过桥按钮的状态 */
  isBridge?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击过桥按钮 */
  onChange?: VoidFunction;
  onFindBridgeChanged?: (val: DefaultBridgeConfig) => void;
  historyInfo?: DealRecord;
};

/** 第一行-内码+过桥按钮 */
export const BridgeMark = (props: Props) => {
  const { internalCode, onChange, isBridge, disabled = false, historyInfo } = props;

  const { showDeleteBridgeConfirm, setShowDeleteBridgeConfirm, onDeleteBridge } = useRecordContent();
  const { productType } = useProductParams();

  const displayTraders =
    historyInfo?.deal_type === DealType.TKN
      ? historyInfo.bridge_list ?? []
      : [...(historyInfo?.bridge_list ?? [])].reverse();

  const content =
    (historyInfo?.bridge_list?.length ?? 0) !== 0 ? (
      <div className="flex items-center gap-1 text-sm">
        {displayTraders.map((bridge, index) => (
          <div
            className="flex items-center gap-1"
            key={bridge.trader.trader_id}
          >
            {index !== 0 && <div className="w-[14px] text-center text-gray-300">|</div>}
            <div className="text-gray-100">
              {getInstName({ inst: bridge.inst, productType })}({bridge.trader.name_zh}
              {bridge.trader_tag})
            </div>
          </div>
        ))}
      </div>
    ) : undefined;

  const bidCp = historyInfo?.deal_type === DealType.TKN ? historyInfo.spot_pricinger : historyInfo?.spot_pricingee;
  const ofrCp = historyInfo?.deal_type === DealType.TKN ? historyInfo.spot_pricingee : historyInfo?.spot_pricinger;

  return (
    <div className="flex">
      <div className="mr-2 w-18 h-7 font-BondDealStatusNone min-w-[48px] border-gray-600 flex justify-center items-center text-primary-100 border border-solid rounded-lg text-sm font-bold">
        {getSubInternalCode(internalCode, historyInfo?.create_time)}
      </div>
      {historyInfo?.bridge_list?.length ? (
        <Popconfirm
          type="warning"
          trigger="manual"
          content="当前成交单已加桥，点灭将删桥，确认点灭？"
          floatingProps={{ className: '!w-[240px]' }}
          onConfirm={() => {
            if (
              props.historyInfo?.spot_pricingee?.trader == null ||
              props.historyInfo?.spot_pricinger?.trader == null
            ) {
              message.error('缺少机构信息，删桥失败！');
              return;
            }
            onDeleteBridge();
          }}
          open={showDeleteBridgeConfirm}
          onOpenChange={() => setShowDeleteBridgeConfirm(false)}
          confirmBtnProps={{ label: '确定' }}
        >
          <div>
            {/* 直接将tooltip放在popconfirm内会有定位问题 */}
            <Tooltip content={content}>
              {/* tooltip内元素disabled会导致tooltip失效，floating-ui问题 */}
              <div>
                <Button
                  disabled={disabled}
                  className={cx('w-7 h-7 px-0 font-semibold')}
                  type={isBridge ? 'orange' : 'gray'}
                  plain={!isBridge}
                  onClick={onChange}
                >
                  <IconBridgeText className="text-[20px]" />
                </Button>
              </div>
            </Tooltip>
          </div>
        </Popconfirm>
      ) : (
        <FindBridge
          parentDealId={historyInfo?.deal_id}
          findBridgeConfig={historyInfo?.default_bridge_config}
          needFindBridge={isBridge}
          bidInst={bidCp?.inst}
          bidTrader={bidCp?.trader}
          ofrInst={ofrCp?.inst}
          ofrTrader={ofrCp?.trader}
          onChangeSuccess={val => {
            props.onFindBridgeChanged?.(val);
          }}
          onPopupClick={onChange}
          renderChild={() => (
            <Button
              disabled={disabled}
              className={cx('w-7 h-7 px-0 font-semibold')}
              type={isBridge ? 'orange' : 'gray'}
              plain={!isBridge}
            >
              <IconBridgeText className="text-[20px]" />
            </Button>
          )}
        />
      )}
    </div>
  );
};
