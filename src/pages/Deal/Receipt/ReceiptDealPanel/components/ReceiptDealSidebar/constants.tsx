import { IconCopy, IconDelete, IconDeleteRidge, IconEdit, IconNoteRemove, IconUrgent } from '@fepkg/icon-park-react';

export enum ReceiptDealAction {
  Trade = 'Trade',
  Submit = 'Submit',
  Edit = 'Edit',
  Join = 'Join',
  Urgent = 'Urgent',
  Destroy = 'Destroy',
  Delete = 'Delete',
  DeleteBridge = 'DeleteBridge',
  Confirm = 'Confirm'
}

const btnClass =
  'w-16 h-16 flex flex-col gap-2 text-gray-100 text-xs font-medium justify-center [&_.s-btn-icon]:w-6 [&_.s-btn-icon]:h-6';
export const btnCommonProps = {
  type: 'gray',
  plain: true,
  throttleWait: 300,
  tabIndex: -1,
  className: btnClass
} as const;

export const DestroyOperator = { icon: <IconNoteRemove />, text: '毁单', key: ReceiptDealAction.Destroy };
export const DeleteOperator = { icon: <IconDelete />, text: '删除', key: ReceiptDealAction.Delete };

export const operatorList = [
  { icon: <IconEdit />, text: '编辑', key: ReceiptDealAction.Edit },
  { icon: <IconCopy />, text: 'Join', key: ReceiptDealAction.Join },
  { icon: <IconUrgent />, text: '紧急', key: ReceiptDealAction.Urgent },
  { icon: <IconDeleteRidge />, text: '删桥', key: ReceiptDealAction.DeleteBridge },
  { ...DeleteOperator },
  { ...DestroyOperator }
];
