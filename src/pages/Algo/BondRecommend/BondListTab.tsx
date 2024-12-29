import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { Input } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Select } from '@fepkg/components/Select';
import { IconSearch } from '@fepkg/icon-park-react';
import { RecommendBondStatus } from '@fepkg/services/types/algo-enum';
import type { GetRecommendBond } from '@fepkg/services/types/algo/get-recommend-bond';
import { useDebounceFn } from 'ahooks';
import { pinyin } from 'pinyin-pro';
import { bondRecGetBaseConfig } from '@/common/services/api/algo/bond-recommend-api/get-base-config';
import { bcoGetRecommendBond } from '@/common/services/api/algo/bond-recommend-api/get-recommend-bond';
import { bondRecSetBaseConfig } from '@/common/services/api/algo/bond-recommend-api/set-base-config';
import { bcoUpdateRecommendBond } from '@/common/services/api/algo/bond-recommend-api/update-recommend-bond';
import { BCOBondRecommendStepTable, BCOBondRecommendStepTableIDSelection } from '@/components/BondRecommend/BCO/table';
import Switch from '@/components/IDCDealDetails/Switch';
import TextWithTooltip from '@/components/TextWithTooltip';
import { miscStorage } from '@/localdb/miscStorage';
import { bcoBondRecommendListColumns } from './columns';
import { BCORecommendTableProvider, useBCORecommendSchemaInput, useBCORecommendTraderConfigList } from './provider';
import { bcoSendRecommendBond, getSendMsgParam, parseListWithSchemaMap } from './utils';

const groupOptions = ['H', 'L', 'I', 'S', 'F'];

export const BCOBondRecommendBonds = ({
  onJumpToManagement,
  isIdle
}: {
  onJumpToManagement?: (id: string) => void;
  isIdle: boolean;
}) => {
  const [list, setList] = useState<GetRecommendBond.TraderRecommendBond[]>([]);

  // 推荐次数筛选框的内容
  const [sendCountFilterInput, setSendCountFilterInput] = useState('');

  useEffect(() => {
    bondRecGetBaseConfig({
      type: 1,
      broker_qm_id: miscStorage.userInfo!.user_id
    }).then(res => setSendCountFilterInput(res.value));
  }, []);

  // 推荐次数实际筛选
  const [sendCountFilter, setSendCountFilter] = useState('');

  // 分组筛选
  const [groupFilter, setGroupFilter] = useState<string[]>([]);

  // 交易员搜索
  const [traderFilter, setTraderFilter] = useState('');

  // 选中的交易员
  const [selectedTraderID, setSelectedTraderID] = useState('');

  // 是否折叠卡片
  const [isTableCollapse, setIsTableCollapse] = useState(false);

  // 已选中的id
  const [checkedIDs, setCheckedIDs] = useState<BCOBondRecommendStepTableIDSelection[]>([]);

  const [bondRecSearchingValue, setBondRecSearchingValue] = useState('');

  const deleteInactiveCheckedID = (newList: GetRecommendBond.TraderRecommendBond[]) => {
    setCheckedIDs(old =>
      old.filter(i => {
        const targetTrader = newList.find(t => t.trader_id === i.parentID);

        if (targetTrader == null) return true;
        return targetTrader.list?.some(item => item.recommend_bond_id === i.itemID);
      })
    );
  };

  // 话术默认输入框的内容map
  const { schemaInputMap, setSchemaInputMap } = useBCORecommendSchemaInput();

  useEffect(() => {
    bondRecGetBaseConfig({
      type: 2,
      broker_qm_id: miscStorage.userInfo?.user_id ?? '',
      trader_idb_key: 'fullMap'
    }).then(res => {
      try {
        setSchemaInputMap(JSON.parse(res.value || '{}'));
      } catch {
        bondRecSetBaseConfig({
          type: 2,
          broker_qm_id: miscStorage.userInfo?.user_id ?? '',
          trader_idb_key: 'fullMap',
          value: '{}'
        });

        setSchemaInputMap({});
      }
    });
  }, []);

  const { traderConfigs, refreshTraderConfig } = useBCORecommendTraderConfigList();

  const onCheckItem = (props: { value: boolean; traderID: string; bondID?: string }) => {
    const { value, traderID, bondID } = props;

    if (bondID != null) {
      const targetIndex = checkedIDs.findIndex(i => i.itemID === bondID && i.parentID === traderID);

      if (value) {
        if (targetIndex === -1) {
          checkedIDs.push({
            itemID: bondID,
            parentID: traderID
          });

          setCheckedIDs([...checkedIDs]);
        }
        return;
      }

      if (targetIndex === -1) return;

      checkedIDs.splice(targetIndex, 1);

      setCheckedIDs([...checkedIDs]);
    } else {
      const result = checkedIDs.filter(i => i.parentID !== traderID);

      if (value) {
        result.push(
          ...(list.find(i => i.trader_id === traderID)?.list ?? []).map(i => ({
            parentID: traderID,
            itemID: i.recommend_bond_id
          }))
        );
      }

      setCheckedIDs(result);
    }
  };

  const tableRefMap = useRef<Record<string, HTMLDivElement>>({});

  const pollingRef = useRef<NodeJS.Timeout>();

  const refreshList = useCallback(async () => {
    if (isIdle) return;

    const res = await bcoGetRecommendBond({ status: [1] });

    const newList =
      res.list
        ?.filter(i => traderConfigs.filter(t => t.f_enabled || t.h_enabled).some(t => t.trader_id === i.trader_id))
        ?.sort((a, b) => {
          const charAList = a.trader_name.split('');
          const charBList = b.trader_name.split('');

          let result = 0;
          charAList.forEach((charA, index) => {
            if (result !== 0) return;
            const charB = charBList[index];

            if (charB == null) {
              result = 1;
              return;
            }

            const isACN = /[\u4e00-\u9fa5]/.test(charA);
            const isBCN = /[\u4e00-\u9fa5]/.test(charB);

            if (isACN && !isBCN) {
              result = 1;
              return;
            }

            if (isBCN && !isACN) {
              result = -1;
              return;
            }

            const charAAlphabet = isACN
              ? pinyin(charA, { toneType: 'none', pattern: index === 0 ? 'first' : 'pinyin' })
              : charA.toLocaleLowerCase();

            const charBAlphabet = isBCN
              ? pinyin(charB, { toneType: 'none', pattern: index === 0 ? 'first' : 'pinyin' })
              : charB.toLocaleLowerCase();

            result = charAAlphabet.charCodeAt(0) - charBAlphabet.charCodeAt(0);
          });

          return result === 0 ? -1 : result;
        }) ?? [];

    setList(newList);

    deleteInactiveCheckedID(newList);
  }, [traderConfigs, isIdle]);

  useEffect(() => {
    refreshList();
    pollingRef.current = setInterval(refreshList, 1000);

    return () => {
      clearInterval(pollingRef.current);
      pollingRef.current = undefined;
    };
  }, [refreshList]);

  useEffect(() => {
    refreshTraderConfig();
  }, []);

  const displayList = useMemo(() => {
    const isItemMatchSendCount = (item: GetRecommendBond.RecommendedBond) =>
      sendCountFilter === '' || item.send_count <= Number(sendCountFilter);

    const isItemMatchGroup = (item: GetRecommendBond.RecommendedBond) =>
      groupFilter.length === 0 || item.pass_rule_group?.some(g => groupFilter.includes(g));

    const isItemMatchSearch = (item: GetRecommendBond.RecommendedBond) =>
      bondRecSearchingValue === '' ||
      item.bond.bond_info.bond_name.toLowerCase().includes(bondRecSearchingValue.toLowerCase()) ||
      item.bond.bond_info.bond_code.toLowerCase().includes(bondRecSearchingValue.toLowerCase());

    return list
      .map(i => ({
        ...i,
        list: (i.list ?? []).filter(si => isItemMatchSendCount(si) && isItemMatchGroup(si) && isItemMatchSearch(si))
      }))
      .filter(
        i =>
          i.list != null &&
          i.list?.length !== 0 &&
          i.list?.some(si => isItemMatchSendCount(si) && isItemMatchGroup(si) && isItemMatchSearch(si))
      );
  }, [list, sendCountFilter, groupFilter, bondRecSearchingValue]);

  const displayTraders = useMemo(() => {
    return traderConfigs
      .filter(t => t.f_enabled || t.h_enabled)
      .sort((a, b) => {
        const charAList = a.trader_name.split('');
        const charBList = b.trader_name.split('');

        let result = 0;
        charAList.forEach((charA, index) => {
          if (result !== 0) return;
          const charB = charBList[index];

          if (charB == null) {
            result = 1;
            return;
          }

          const isACN = /[\u4e00-\u9fa5]/.test(charA);
          const isBCN = /[\u4e00-\u9fa5]/.test(charB);

          if (isACN && !isBCN) {
            result = 1;
            return;
          }

          if (isBCN && !isACN) {
            result = -1;
            return;
          }

          const charAAlphabet = isACN
            ? pinyin(charA, { toneType: 'none', pattern: index === 0 ? 'first' : 'pinyin' })
            : charA.toLocaleLowerCase();

          const charBAlphabet = isBCN
            ? pinyin(charB, { toneType: 'none', pattern: index === 0 ? 'first' : 'pinyin' })
            : charB.toLocaleLowerCase();

          result = charAAlphabet.charCodeAt(0) - charBAlphabet.charCodeAt(0);
        });

        return result === 0 ? -1 : result;
      });
  }, [traderConfigs]);

  const deboucedUpdateRecTime = useDebounceFn(
    value => {
      bondRecSetBaseConfig({
        type: 1,
        broker_qm_id: miscStorage.userInfo?.user_id ?? '',
        value
      });
    },
    { wait: 300 }
  );

  const deboucedUpdateTraderSchema = useDebounceFn(
    value => {
      bondRecSetBaseConfig({
        type: 2,
        broker_qm_id: miscStorage.userInfo?.user_id ?? '',
        value,
        trader_idb_key: 'fullMap'
      });
    },
    { wait: 300 }
  );

  return (
    <div className={cx('flex-1 bg-gray-700 pl-6 overflow-hidden', isIdle && 'hidden')}>
      <div className="flex h-[calc(100%)]">
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="flex mt-3 justify-between mb-2">
            <div className="flex items-center">
              <Input
                value={sendCountFilterInput}
                label="推荐次数≤"
                placeholder="请输入"
                className="mr-4 !w-[200px]"
                onChange={val => {
                  if (/^[0-3]?$/.test(val)) {
                    setSendCountFilterInput(val);
                    deboucedUpdateRecTime.run(val);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setSendCountFilter(sendCountFilterInput);
                  }
                }}
                onBlur={() => {
                  setSendCountFilter(sendCountFilterInput);
                }}
              />
              <Select<string[]>
                label="来源"
                labelWidth={72}
                options={groupOptions.map(g => ({
                  label: g,
                  value: g
                }))}
                multiple
                className="w-[200px] text-sm"
                placeholder="不限"
                onChange={val => setGroupFilter(val)}
              />
            </div>
            <div className="flex">
              <div className="flex items-center px-3 w-[120px] h-8 justify-between bg-gray-750">
                折叠卡片
                <Switch
                  size="small"
                  checked={isTableCollapse}
                  onChange={val => setIsTableCollapse(val)}
                />
              </div>
              <Input
                className="ml-3 !w-[200px] h-8"
                placeholder="搜索债券简称/债券代码"
                suffixIcon={<IconSearch />}
                value={bondRecSearchingValue}
                onChange={setBondRecSearchingValue}
              />
              <Button
                type="primary"
                className="ml-3"
                onClick={async () => {
                  await bcoSendRecommendBond(
                    parseListWithSchemaMap(getSendMsgParam(list, checkedIDs), schemaInputMap),
                    traderConfigs
                  );

                  await refreshList();
                }}
                disabled={checkedIDs.length === 0}
              >
                批量发送
              </Button>
              <Button
                className="ml-3"
                onClick={async () => {
                  const checkedList = checkedIDs
                    .filter(i =>
                      list.some(
                        trader =>
                          trader.trader_id === i.parentID &&
                          trader.list?.some(bond => bond.recommend_bond_id === i.itemID)
                      )
                    )
                    .map(i => i.itemID);

                  const bondIDs =
                    checkedList.length === 0
                      ? list.reduce((prev, next) => {
                          return [...prev, ...(next.list?.map(i => i.recommend_bond_id) ?? [])];
                        }, [] as string[])
                      : checkedList;

                  await bcoUpdateRecommendBond({
                    recommend_bond_id_list: bondIDs,
                    status: RecommendBondStatus.Ignore
                  });

                  message.warn(`忽略${bondIDs.length}条`);

                  await refreshList();
                }}
                disabled={checkedIDs.length === 0}
              >
                批量忽略
              </Button>
            </div>
          </div>
          <div className="overflow-y-overlay flex-1">
            <BCORecommendTableProvider initialState={{ refresh: refreshList }}>
              {displayList.length === 0 ? (
                <div className="mt-[200px]">
                  <Placeholder type="no-data" />
                </div>
              ) : (
                <BCOBondRecommendStepTable
                  refMap={tableRefMap}
                  list={displayList}
                  checkedItemIds={checkedIDs}
                  onCheckItem={onCheckItem}
                  columns={bcoBondRecommendListColumns}
                  collapse={isTableCollapse}
                  renderHeader={({ user, isChecked, indeterminate, onCheck }) => (
                    <div className="h-9 flex pl-[18px] pr-3 items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="flex items-center"
                          onClick={e => e.stopPropagation()}
                          onDoubleClick={e => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isChecked}
                            indeterminate={indeterminate}
                            onChange={checked => {
                              onCheck(checked);
                            }}
                          />
                        </div>
                        <div className="ml-[26px] text-md text-white">{user.trader_name}</div>
                        <div className="ml-2 text-sm text-gray-300">{user.inst_name}</div>
                      </div>
                      <div className="flex items-center my-[6px]">
                        <Input
                          label="话术默认"
                          size="xs"
                          defaultValue={user.message_schema}
                          value={schemaInputMap[user.trader_id] ?? user.message_schema}
                          onChange={val => {
                            const newMap = {
                              ...schemaInputMap,
                              [user.trader_id]: val
                            };

                            setSchemaInputMap(newMap);
                            deboucedUpdateTraderSchema.run(JSON.stringify(newMap));
                          }}
                        />
                        <Button
                          className="ml-2"
                          onClick={async () => {
                            await bcoSendRecommendBond(
                              parseListWithSchemaMap(
                                getSendMsgParam(
                                  [user],
                                  checkedIDs.filter(
                                    checked =>
                                      user.list?.some(i => i.recommend_bond_id === checked.itemID) &&
                                      user.trader_id === checked.parentID
                                  )
                                ),
                                schemaInputMap
                              ),
                              traderConfigs
                            );

                            refreshList();
                          }}
                        >
                          发送
                        </Button>
                        <Button
                          className="ml-2"
                          onClick={async () => {
                            const ingoreList =
                              getSendMsgParam(
                                [user],
                                checkedIDs.filter(
                                  checked =>
                                    user.list?.some(i => i.recommend_bond_id === checked.itemID) &&
                                    user.trader_id === checked.parentID
                                )
                              )[0]?.recommend_bond_list ?? [];

                            if (ingoreList.length === 0) return;

                            await bcoUpdateRecommendBond({
                              recommend_bond_id_list: ingoreList.map(i => i.id),
                              status: RecommendBondStatus.Ignore
                            });

                            message.warn(`忽略${ingoreList.length}条`);
                          }}
                        >
                          忽略
                        </Button>
                      </div>
                    </div>
                  )}
                />
              )}
            </BCORecommendTableProvider>
          </div>
        </div>
        <div className="ml-4 flex flex-col px-2 py-3 bg-gray-750">
          <Input
            placeholder="搜索交易员"
            suffixIcon={<IconSearch />}
            value={traderFilter}
            onChange={setTraderFilter}
          />
          <div className="overflow-y-overlay flex-1 mt-2">
            {displayTraders.length === 0 ? (
              <div className="mt-[200px]">
                <Placeholder type="no-data" />
              </div>
            ) : (
              displayTraders
                .filter(user => {
                  return (
                    traderFilter === '' ||
                    user.inst_name.toLowerCase().includes(traderFilter.toLowerCase()) ||
                    user.trader_name.toLowerCase().includes(traderFilter.toLowerCase())
                  );
                })
                .map(user => (
                  <div
                    key={user.trader_id}
                    className={`h-7 flex items-center cursor-pointer ${
                      selectedTraderID === user.trader_id ? 'bg-primary-600' : ''
                    }`}
                    onClick={() => {
                      tableRefMap.current[user.trader_id]?.scrollIntoView();
                      setSelectedTraderID(user.trader_id);
                    }}
                    onDoubleClick={() => {
                      onJumpToManagement?.(user.trader_id);
                    }}
                  >
                    <TextWithTooltip
                      text={user.trader_name}
                      width={40}
                      maxWidth={40}
                      className="mx-3 !w-10 text-auxiliary-000"
                    />
                    <div className="mx-3 text-gray-300">{user.inst_name}</div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
