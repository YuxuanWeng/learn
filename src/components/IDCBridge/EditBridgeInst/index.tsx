import { useEffect, useState } from 'react';
import cx from 'classnames';
import { BridgeChannelOptions } from '@fepkg/business/constants/options';
import { Button } from '@fepkg/components/Button';
import { CheckboxOption } from '@fepkg/components/Checkbox';
import { Dialog } from '@fepkg/components/Dialog';
import { TextArea, TextAreaProps } from '@fepkg/components/Input';
import { Modal } from '@fepkg/components/Modal';
import { BridgeInstInfo } from '@fepkg/services/types/common';
import { BridgeChannel } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash-es';
import { useImmer } from 'use-immer';
import { BridgeFormData } from '@/pages/Deal/Bridge/types';
import { convertToCounterParty } from '@/pages/Deal/Bridge/utils';
import { DealInstTraderSearch } from './DealInstTraderSearch';

type EditBridgeInstModalProps = {
  /** 弹窗开关 */
  visible: boolean;
  /** 弹窗类型 */
  isModify?: boolean;
  /** 表单默认值 */
  bridge?: BridgeInstInfo;
  /** 确认提交 */
  onSubmit: (val: BridgeFormData) => void;
  /** 取消 */
  onCancel: () => void;
};

// const channels: CheckboxOption[] = [
//   { label: '对话', value: BridgeChannel.Talk },
//   { label: '请求', value: BridgeChannel.Request }
// ];

const channels: CheckboxOption[] = BridgeChannelOptions.filter(i =>
  [BridgeChannel.Talk, BridgeChannel.Request].includes(i.value)
);

const textareaProps: TextAreaProps = {
  labelWidth: 96,
  placeholder: '请输入',
  autoSize: { minRows: 1, maxRows: 3 },
  maxLength: 100
};

const defaultValues: BridgeFormData = {
  /** 桥id */
  bridge_inst_id: '',
  /** 联系人机构 */
  contact_id: '',
  contact_inst_id: '',
  contact_tag: undefined,
  /** 计费人机构 */
  biller_id: '',
  biller_inst_id: '',
  biller_tag: undefined,
  /** 联系方式 */
  contact: '',
  /**  备注 */
  comment: '',
  /** 发给 */
  send_msg: '',
  /**  渠道 */
  channel: BridgeChannel.Request
};

export const EditBridgeInstModal = ({
  visible,
  isModify = false,
  bridge,
  onSubmit,
  onCancel
}: EditBridgeInstModalProps) => {
  const [isBillError, setBillIsError] = useState(false);
  const [isContactError, setContactIsError] = useState(false);
  const [formData, setFormData] = useImmer({ ...defaultValues });
  const [startCheck, setStartCheck] = useState(false);

  const resetData = useMemoizedFn(() => {
    setFormData(cloneDeep(defaultValues));
    setContactIsError(false);
    setBillIsError(false);
    setStartCheck(false);
  });

  useEffect(() => {
    if (bridge && !visible) {
      const {
        bridge_inst_id,
        contact_inst,
        contact_trader,
        bill_inst,
        bill_trader,
        send_msg,
        channel,
        contact,
        comment
      } = bridge;
      setFormData({
        bridge_inst_id,
        contact_id: contact_trader?.trader_id || '',
        contact_inst_id: contact_inst?.inst_id || '',
        contact_tag: contact_trader?.trader_tag || '',
        biller_id: bill_trader?.trader_id || '',
        biller_inst_id: bill_inst?.inst_id || '',
        biller_tag: bill_trader?.trader_tag || '',
        send_msg,
        channel,
        comment,
        contact
      });
      setBillIsError(false);
      setContactIsError(false);
    }
    if (!isModify && visible) {
      resetData();
    }
  }, [visible, isModify, bridge, setFormData, resetData]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      width={368}
      title={isModify ? '编辑桥机构' : '添加桥机构'}
      footerProps={{ centered: true }}
      onConfirm={() => {
        if (!startCheck) {
          setStartCheck(true);
        }
        const billRequire = formData.biller_id.length > 0;
        const contactRequire = formData.contact_id.length > 0;
        setBillIsError(!billRequire);
        setContactIsError(!contactRequire);
        if (billRequire && contactRequire) {
          onSubmit(formData);
        }
      }}
      onCancel={onCancel}
      keyboard
    >
      <Dialog.Body className="flex flex-col gap-3 text-gray-000">
        <DealInstTraderSearch
          label="机构(联系人)"
          disabled={isModify}
          autoFocus
          instTrader={isModify ? convertToCounterParty(bridge?.contact_inst, bridge?.contact_trader) : undefined}
          error={isContactError}
          onChange={val => {
            if (val) {
              const [contact_inst_id, contact_id, contact_tag] = val.split('|');
              setFormData(draft => {
                draft.contact_id = contact_id;
                draft.contact_inst_id = contact_inst_id;
                draft.contact_tag = contact_tag;
              });
            } else {
              setFormData(draft => {
                draft.contact_id = '';
                draft.contact_inst_id = '';
                draft.contact_tag = '';
              });
            }
            if (startCheck) {
              if (val) {
                setContactIsError(false);
              } else {
                setContactIsError(true);
              }
            }
          }}
        />
        <DealInstTraderSearch
          label="机构(计费人)"
          disabled={isModify}
          instTrader={isModify ? convertToCounterParty(bridge?.bill_inst, bridge?.bill_trader) : undefined}
          error={isBillError}
          onChange={val => {
            if (val) {
              const [biller_inst_id, biller_id, biller_tag] = val.split('|');
              setFormData(draft => {
                draft.biller_id = biller_id;
                draft.biller_inst_id = biller_inst_id;
                draft.biller_tag = biller_tag;
              });
            } else {
              setFormData(draft => {
                draft.biller_id = '';
                draft.biller_inst_id = '';
                draft.biller_tag = '';
              });
            }
            if (startCheck) {
              if (val) {
                setBillIsError(false);
              } else {
                setBillIsError(true);
              }
            }
          }}
        />

        <TextArea
          className="bg-gray-800"
          label="发给"
          {...textareaProps}
          value={formData.send_msg}
          onChange={val => {
            setFormData(draft => {
              draft.send_msg = val;
            });
          }}
        />

        <div className="flex items-center pl-3 pr-1 bg-gray-800 rounded-lg h-8">
          <div className="flex-shrink-0 w-24 text-gray-200">渠道</div>
          <div className="flex flex-wrap gap-1">
            {channels.map((v, idx) => {
              return (
                <Button
                  className={cx(
                    'max-w-[56px] min-w-[56px] w-14  h-6 !px-0 !border-0',
                    formData?.channel !== v.value
                      ? '!bg-gray-600 !text-gray-100 hover:!bg-gray-500 hover:!text-gray-000'
                      : 'hover:!bg-primary-500'
                  )}
                  text
                  plain={formData?.channel === v.value}
                  type={formData?.channel === v.value ? 'primary' : 'gray'}
                  key={idx}
                  onClick={() => {
                    setFormData(draft => {
                      draft.channel = v.value as BridgeChannel;
                    });
                  }}
                >
                  {v.label}
                </Button>
              );
            })}
          </div>
        </div>

        <TextArea
          className="bg-gray-800"
          label="备注"
          {...textareaProps}
          value={formData.comment}
          onChange={e =>
            setFormData(draft => {
              draft.comment = e;
            })
          }
        />

        <TextArea
          className="bg-gray-800"
          label="联系方式"
          {...textareaProps}
          value={formData.contact}
          onChange={e =>
            setFormData(draft => {
              draft.contact = e;
            })
          }
        />
      </Dialog.Body>
    </Modal>
  );
};
