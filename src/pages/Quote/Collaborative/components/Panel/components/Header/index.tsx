import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { ModalUtils } from '@fepkg/components/Modal';
import { Tabs } from '@fepkg/components/Tabs';
import { IconAttentionFilled, IconPreviewCloseFilled, IconReset } from '@fepkg/icon-park-react';
import { QuoteDraftIgnoreType, QuoteDraftMessageStatus } from '@fepkg/services/types/enum';
import { mulIgnoreBondQuoteDraft } from '@/common/services/api/bond-quote-draft/mul-ignore';
import { DialogLayout } from '@/layouts/Dialog';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { GroupSelector } from '../GroupSelector';

const tableTabs = [
  { key: QuoteDraftMessageStatus.QuoteDraftMessageStatusPending, label: '待处理', className: 'w-30' },
  { key: QuoteDraftMessageStatus.QuoteDraftMessageStatusProcessed, label: '已处理', className: 'w-30' }
];

export const Header = () => {
  const { activeTableKey, updateActiveTableKey, updateKeepingTimestamp, followingBrokerIds, tableTotal, hasMore } =
    useTableState();

  const showIgnoreAll = tableTotal || hasMore;

  const ignoreAll = () => {
    mulIgnoreBondQuoteDraft({
      ignore_type: QuoteDraftIgnoreType.QuoteDraftIgnoreTypeAll,
      creator_id_list: followingBrokerIds,
      request_time: Date.now().toString()
    });
  };

  const handleIgnore = () => {
    ModalUtils.error({
      title: '全部忽略',
      content: '忽略后将不能恢复，请谨慎操作',
      icon: <IconPreviewCloseFilled className="text-danger-100" />,
      okText: '忽略 ',
      onOk: ignoreAll
    });
  };

  const handleRefetch = () => {
    updateKeepingTimestamp({ reset: true });
  };

  return (
    <>
      <DialogLayout.Header
        controllers={['min', 'max', 'close']}
        keyboard={false}
      >
        <Dialog.Header>协同报价</Dialog.Header>
      </DialogLayout.Header>

      <header className="flex justify-between py-3 px-3 bg-gray-700">
        <div className="flex items-center gap-4">
          <Tabs
            className="bg-gray-800 rounded-lg"
            activeKey={activeTableKey}
            defaultActiveKey={tableTabs[0].key}
            items={tableTabs}
            onChange={item => updateActiveTableKey(item.key)}
          />

          {hasMore && (
            <div className="flex items-center gap-2 h-8 px-3 bg-orange-700 rounded-lg">
              <IconAttentionFilled className="text-orange-100" />
              <span className="text-gray-100">有新消息，请向上滚动或点此刷新</span>
              <Button.Icon
                className="hover:!bg-orange-600 hover:!border-orange-600"
                text
                icon={<IconReset />}
                tooltip={{ content: '刷新数据' }}
                onClick={handleRefetch}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <GroupSelector />

          {activeTableKey === QuoteDraftMessageStatus.QuoteDraftMessageStatusPending && (
            <Button
              className="w-22"
              tabIndex={-1}
              type="gray"
              ghost
              disabled={!showIgnoreAll}
              onClick={handleIgnore}
            >
              全部忽略
            </Button>
          )}
        </div>
      </header>
    </>
  );
};
