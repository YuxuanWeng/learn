import { useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Tips } from '@fepkg/business/components/Tips';
import { BaseOption } from '@fepkg/components/BaseOptionsRender/BaseOption';
import { Button } from '@fepkg/components/Button';
import { Caption } from '@fepkg/components/Caption';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Search } from '@fepkg/components/Search';
import { Switch } from '@fepkg/components/Switch';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconChange, IconDelete, IconInfo, IconPrecise } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import { UserAccessGrantType } from '@fepkg/services/types/bds-enum';
import { UserList } from '@fepkg/services/types/user/list';
import { useDebounce } from 'usehooks-ts';
import { useFuzzySearchQuery } from '@/common/services/hooks/useFuzzySearchQuery';
import { SearchUsers } from '@/components/business/SearchUsers';
import { miscStorage } from '@/localdb/miscStorage';
import { useSystemSettingPanel } from '../../providers/PanelProvider';
import CommonSwitch from '../CommonSwitch';
import { AddModalType, useGrant } from './useGrant';

const TABLE_HEADER_LIST = ['经纪人', '成交单', '成交记录', '明细/过桥', '操作'];
const UserAccessGrantTypeList = [
  UserAccessGrantType.UserAccessGrantTypeReceiptDeal,
  UserAccessGrantType.UserAccessGrantTypeDealInfo,
  UserAccessGrantType.UserAccessGrantTypeDealDetailBridge
];

export const TradeSettings = () => {
  const { accessCache, productType } = useSystemSettingPanel();
  const [isTradeBoardSimple, setIsTradeBoardSimple] = useState(miscStorage.isTradeBoardSimple);

  const {
    modalType,
    grantees,
    accessGrants,
    granters,
    selectedValid,
    searchUsers,
    selectedGrantee,
    isIndeterminate,
    selectedUsers,
    save,
    deleteUser,
    isSelectAll,
    selectAll,
    selectUser,
    updateSearchUsers,
    closeAddModal,
    openAddGranteeModal,
    openAddGranterModal,
    updateGranter,
    deleteGranter,
    deleteGrantee,
    setSelectedGrantee
  } = useGrant(!accessCache.assign);

  /** 添加指定人时，过滤掉当前的用户 */
  const usersFilter = (data: UserList.Response) => {
    if (modalType === AddModalType.Grantee) return data;
    const filterData = data.list?.filter(user => user.user_id !== selectedGrantee?.user_id);
    return { ...data, list: filterData };
  };

  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebounce(keyword, 300);

  const { data } = useFuzzySearchQuery<UserList.Response, UserList.Request>({
    api: APIs.user.list,
    keyword: keyword ? debouncedKeyword || keyword : keyword,
    searchParams: { product_type: productType, count: 200 }
  });

  const hasKeyword = keyword !== '';

  const searchedGrantees = useMemo(() => {
    const getGrantee = () => {
      if (data?.list == null || !hasKeyword) return [];

      return grantees.filter(g => data.list?.some(user => user.user_id === g.user_id));
    };

    return getGrantee().map(g => ({
      label: g.name_cn,
      value: g.user_id,
      original: g
    }));
  }, [hasKeyword, data, grantees]);

  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <header className="flex flex-col pt-6 mt-6 border-0 border-t border-gray-600 border-solid">
        <span className="flex-shrink-0 select-none text-md font-bold">成交设置</span>
      </header>

      {accessCache.spotPricing && (
        <>
          <div className="flex items-center mt-6">
            <Caption>
              <span className="text-sm select-none font-bold">精简模式</span>
            </Caption>
            <Tooltip
              placement="right"
              content="精简/完整模式切换后，将会在下次打开点价板后生效"
            >
              <IconInfo className="text-gray-100 hover:text-primary-000 ml-2" />
            </Tooltip>
          </div>
          <CommonSwitch
            classNames="ml-6 mt-6"
            value={isTradeBoardSimple}
            onChange={() => {
              miscStorage.isTradeBoardSimple = !miscStorage.isTradeBoardSimple;
              setIsTradeBoardSimple(miscStorage.isTradeBoardSimple);
            }}
            label="点价精简模式"
          />
        </>
      )}

      {accessCache.assign && (
        <>
          <div className="flex items-center mt-6">
            <Caption type="orange">
              <span className="text-sm select-none font-bold">授权设置</span>
            </Caption>
          </div>
          <div className="ml-6 mt-6 h-[312px] w-[642px] rounded-lg border border-solid border-gray-600 bg-gray-700 flex flex-col">
            {grantees.length === 0 ? (
              <div className="flex items-center flex-col py-[44px] flex-1">
                <Placeholder
                  type="no-data"
                  size="xs"
                  label="暂无用户"
                />
                <Button
                  ghost
                  onClick={openAddGranteeModal}
                >
                  添加用户
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden">
                <div className="w-[200px] flex-shrink-0 border-0 border-r border-solid border-gray-600 h-full px-3 flex flex-col">
                  <div className="flex h-[38px] border-0 border-b border-dashed border-gray-600 items-center mb-2">
                    <Caption className="flex-1">
                      <span className="text-sm select-none font-semibold">用户</span>
                    </Caption>
                    <Button
                      plain
                      className="w-6 h-6 !px-0"
                      icon={<IconChange />}
                      tooltip={{ content: '变更用户' }}
                      onClick={() => {
                        openAddGranteeModal();
                      }}
                    />
                  </div>

                  <Search
                    className="bg-gray-800 h-7"
                    placeholder="搜索用户"
                    inputValue={keyword}
                    onInputChange={setKeyword}
                    options={searchedGrantees}
                    suffixIcon={<IconPrecise />}
                    limitWidth
                    // 这里的搜索框仅作为定位所用，不需要展示已选项的label
                    inputValueRender={() => ''}
                    destroyOnClose
                    onChange={val => {
                      if (val != null) {
                        setSelectedGrantee(val?.original);

                        const index = grantees.findIndex(g => g.user_id === val.original.user_id);

                        if (index !== -1 && scrollerRef.current != null) {
                          // 未使用scrollIntoView，因为会导致设置页面点总体滚动出问题
                          scrollerRef.current.scrollTop = index * 40 - 8;
                        }
                      }
                    }}
                  />
                  <div
                    className="overflow-y-overlay flex-1 -mx-3 my-2"
                    ref={scrollerRef}
                  >
                    {accessGrants.map((item, index) => {
                      const g = item.grantee;
                      const selected = g.user_id === selectedGrantee?.user_id;

                      return (
                        <BaseOption
                          key={g.user_id}
                          className={cx('flex', index !== 0 && 'mt-2', 'mx-3', index === grantees.length - 1 && 'mb-2')}
                          hoverActive
                          onClick={() => setSelectedGrantee(g)}
                          selected={selected}
                          hoverShowSuffix
                          suffixNode={
                            <IconDelete
                              className="ml-auto text-gray-100 hover:text-primary-100"
                              onClick={e => {
                                e.stopPropagation();
                                deleteGrantee(g.user_id);
                              }}
                            />
                          }
                        >
                          {g.name_cn}

                          <Tips
                            show={!item.flag_valid_grantee}
                            tipsContent="用户失效"
                          />
                        </BaseOption>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 h-full px-3 flex flex-col">
                  <div className="flex h-[38px] border-0 border-b border-dashed border-gray-600 items-center flex-shrink-0">
                    <Caption
                      className="flex-1"
                      type="orange"
                    >
                      <span className="text-sm select-none font-semibold">可见经纪人数据权限</span>
                    </Caption>
                    <Button
                      plain
                      className="w-6 h-6 !px-0"
                      // 当前所选用户无效的话就禁用
                      disabled={selectedGrantee == null || !selectedValid}
                      tooltip={{ content: '变更可见经纪人' }}
                      icon={<IconChange />}
                      onClick={() => {
                        openAddGranterModal();
                      }}
                    />
                  </div>

                  {granters.length === 0 ? (
                    <Placeholder
                      type="no-data"
                      size="xs"
                      label="暂无可见经纪人"
                    />
                  ) : (
                    <div className="flex-1 overflow-y-overlay text-sm relative border border-solid border-gray-600 rounded-lg mt-2 mb-3 bg-gray-800">
                      <div className="h-8 border-0 border-b border-dashed border-gray-600 flex items-center text-center text-gray-200">
                        {TABLE_HEADER_LIST.map(i => {
                          return (
                            <div
                              key={i}
                              className={cx(i === '经纪人' ? 'w-[96px]' : 'w-20')}
                            >
                              {i}
                            </div>
                          );
                        })}
                      </div>
                      {granters.map((g, gIndex) => {
                        const granterUserId = g?.granter?.user_id;
                        const granterUserName = g?.granter?.name_cn;
                        const accessGrantList = g?.access_grant_list ?? [];
                        const isLast = gIndex === granters.length - 1;

                        return (
                          <div
                            className={cx(
                              'h-7 leading-7 flex text-gray-200 border-0',
                              !isLast && 'border-b border-solid border-gray-700'
                            )}
                            key={granterUserId}
                          >
                            <div className="w-[96px] px-3 flex-center text-center">
                              <Tooltip
                                truncate
                                content={granterUserName}
                              >
                                <div className="truncate text-gray-100">{granterUserName}</div>
                              </Tooltip>
                              <Tips
                                show={!g.flag_valid_granter}
                                tipsContent="经纪人失效，数据权限无效。"
                              />
                            </div>

                            {UserAccessGrantTypeList.map(grantType => (
                              <div
                                key={grantType}
                                className="w-20 flex flex-center"
                              >
                                <Switch
                                  checked={accessGrantList.includes(grantType)}
                                  // 当前经纪人无效或者对应的用户无效就禁用修改
                                  disabled={!selectedValid || !g.flag_valid_granter}
                                  onChange={async val => {
                                    await updateGranter(granterUserId, grantType, val);
                                  }}
                                />
                              </div>
                            ))}
                            <div className={cx('w-20 text-center')}>
                              <IconDelete
                                className="hover:text-primary-100 cursor-pointer"
                                onClick={e => {
                                  e.stopPropagation();
                                  deleteGranter(granterUserId);
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <SearchUsers
            keyboard
            title={modalType === AddModalType.Granter ? '变更可见经纪人' : '变更用户'}
            visible={modalType !== AddModalType.None}
            onCancel={closeAddModal}
            productType={productType}
            onSearchedUsersChange={updateSearchUsers}
            onFilter={usersFilter}
            searchUsers={searchUsers}
            isSelectAll={isSelectAll}
            isIndeterminate={isIndeterminate}
            onSelectAll={selectAll}
            onSelectedUsersChange={selectUser}
            selectedUsers={selectedUsers}
            onDeleteUser={deleteUser}
            onConfirm={save}
          />
        </>
      )}
    </div>
  );
};
