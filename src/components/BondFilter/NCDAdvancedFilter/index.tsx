import cx from 'classnames';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Popover } from '@fepkg/components/Popover';
import { useAdvanceGroupQuery } from '@/common/services/hooks/useAdvanceGroupQuery';
import { useDistrictConfigQuery } from '@/common/services/hooks/useDistrictConfigQuery';
import { useIssuerInstConfigQuery } from '@/common/services/hooks/useIssuerInstQuery';
import { useMainGroupData } from '@/pages/ProductPanel/providers/MainGroupProvider';
import { NCDFilterDetail } from './NCDFilterDetail';
import { getDetailData } from './utils';

export const NCDAdvancedFilter = () => {
  const { data } = useAdvanceGroupQuery();
  const { activeGroupState, modifyLocalGroup } = useMainGroupData();
  const { data: issuerOptions } = useIssuerInstConfigQuery();
  const { data: provinceOptions } = useDistrictConfigQuery();

  if (!data?.length) {
    return (
      <div className="flex-center">
        <Placeholder
          type="no-setting"
          label="暂未配置行情分组"
          size="xs"
        />
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap max-h-[100px] overflow-y-overlay">
      {data.map(group => {
        const groupIdSet = new Set(activeGroupState.activeGroup?.advanceGroupIds);
        const selected = groupIdSet.has(group.groupId);
        const detailData = getDetailData({
          issuerOptions,
          provinceOptions,
          quickFilter: group.quicklyFilterValue,
          generalFilter: group.generalFilterValue,
          bondIssueInfoFilter: group.bondIssueInfoFilterValue
        });
        return (
          <Popover
            content={detailData.length === 0 ? null : <NCDFilterDetail list={detailData} />}
            trigger="hover"
            placement="bottom"
            key={group.groupId}
          >
            <div
              onClick={() => {
                if (selected) {
                  groupIdSet.delete(group.groupId);
                } else {
                  groupIdSet.add(group.groupId);
                }
                modifyLocalGroup?.({
                  ...activeGroupState.activeGroup,
                  groupId: activeGroupState.activeGroup?.groupId || '',
                  advanceGroupIds: [...groupIdSet]
                });
              }}
              className={cx(
                'h-7 rounded-lg px-2  text-sm bg-gray-700 leading-[26px] border-solid border-[1px] hover:cursor-pointer',
                selected
                  ? 'font-bold  border-primary-100 text-primary-100 '
                  : 'font-medium  border-transparent text-gray-200 hover:text-primary-000'
              )}
            >
              {group.groupName}
            </div>
          </Popover>
        );
      })}
    </div>
  );
};
