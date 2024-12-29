import { FC, useRef, useState } from 'react';
import cx from 'classnames';
import { getInstName } from '@fepkg/business/utils/get-name';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconDelete, IconEdit } from '@fepkg/icon-park-react';
import { BridgeChannel } from '@fepkg/services/types/enum';
import { internalCodeReg } from '@/common/utils/internal-code';
import { useBridgeContext } from '@/pages/Deal/Bridge/providers/BridgeProvider';

type Props = {
  /** 编辑桥机构回调 */
  onModify: () => void;
  /** 删除桥机构回调 */
  onDel: () => void;
  /** 输入框输入的内码 */
  onAddRecord: (codeList: string[]) => void;
};

const FieldRender: FC<{ label: string; value?: string }> = ({ label, value }) => {
  return (
    <div className="flex-center h-8 min-w-[240px] flex-1">
      <div className="w-[96px] inline-block text-gray-200 text-sm font-medium">{label}</div>
      <Tooltip
        truncate
        content={value}
      >
        <span className={cx('flex-1 inline-block w-32 pr-3 font-semibold truncate text-gray-000 text-sm')}>
          {value}
        </span>
      </Tooltip>
    </div>
  );
};

export const BridgeDetail: FC<Props> = props => {
  const { onModify, onDel, onAddRecord } = props;

  const [internalCodeList, setInternalCodeList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [seqInputTailBlank, setSeqInputTailBlank] = useState(false);

  const { accessCache, bridge, productType } = useBridgeContext();

  if (!bridge) {
    return null;
  }
  const { contact_inst, contact_trader, bill_trader } = bridge;
  const seqDisplay: string = internalCodeList.join(' ');

  const inputEnterPress = () => {
    if (internalCodeList.length > 0) {
      onAddRecord(internalCodeList);
    }
  };

  const transactionTexts = bridge.channel === BridgeChannel.Talk ? ['对', '话'] : ['请', '求'];

  return (
    <div className="flex w-full overflow-hidden rounded-sm items-center border-0 border-b h-[88px] border-gray-500 border-solid bg-gray-600 gap-3 select-none">
      <div className={cx('w-4 gap-1 flex-center flex-col rounded-r', 'h-12 bg-primary-100')}>
        {transactionTexts?.map(i => (
          <span
            key={i}
            className="text-xs tracking-normal leading-none font-normal text-gray-700"
          >
            {i}
          </span>
        ))}
      </div>
      <div className="flex flex-1 justify-between items-center pr-3 h-full">
        <div className="flex flex-1 flex-col gap-2 py-2 h-full">
          <div className="flex-center">
            <FieldRender
              label="机构"
              value={getInstName({ inst: contact_inst, productType })}
            />
            <FieldRender
              label="联系人"
              value={contact_trader?.name_zh}
            />
            <FieldRender
              label="联系方式"
              value={bridge.contact}
            />
          </div>
          <div className="flex-center">
            <FieldRender
              label="计费人"
              value={bill_trader?.name_zh}
            />
            <FieldRender
              label="发给"
              value={bridge.send_msg}
            />
            <FieldRender
              label="备注"
              value={bridge.comment}
            />
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center">
          <Input
            className="!w-[178px] !bg-gray-800 ml-[54px] focus-within:!bg-primary-700"
            label="添加订单"
            placeholder="输入内码"
            disabled={!accessCache.bridgeRecordEdit}
            value={seqDisplay + (seqInputTailBlank ? ' ' : '')}
            onChange={(v: string) => {
              const arr: string[] = v.split(' ').filter(Boolean);

              if (!arr.every(val => internalCodeReg.test(val))) return;

              setInternalCodeList(arr);
              setSeqInputTailBlank(/\s$/.test(v));
            }}
            onEnterPress={() => {
              inputEnterPress();
              inputRef.current?.blur();
              setInternalCodeList([]);
              setSeqInputTailBlank(false);
            }}
            ref={inputRef}
          />
          <Button
            className="ml-3 w-8 h-8 !p-0 bg-gray-700 active:!bg-gray-800"
            type="gray"
            disabled={!accessCache.bridgeInstEdit}
            onClick={onModify}
            icon={<IconEdit />}
            plain
          />
          <Button
            className="ml-3 w-8 h-8 !p-0 bg-gray-700 active:!bg-gray-800"
            type="gray"
            disabled={!accessCache.bridgeInstEdit}
            onClick={onDel}
            icon={<IconDelete />}
            plain
          />
        </div>
      </div>
    </div>
  );
};
