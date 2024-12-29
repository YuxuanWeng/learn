import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { BondRecommendConfig } from '@fepkg/services/types/algo-common';
import { RecommendRuleType } from '@fepkg/services/types/algo-enum';
import type { GetConfig } from '@fepkg/services/types/algo/get-config';
import type { GetInstByName } from '@fepkg/services/types/algo/get-inst-by-names';
import { bcoBondRecommendDeleteConfig } from '@/common/services/api/algo/bond-recommend-api/delete-config';
import { bcoBondRecommendEnableConfig } from '@/common/services/api/algo/bond-recommend-api/enable-config';
import { getInstByName } from '@/common/services/api/algo/bond-recommend-api/get-inst-by-name';
import { uploadIssureList } from '@/common/services/api/algo/bond-recommend-api/upload-issure-list';
import { BcoRecommendTable } from '@/components/BondRecommend/BCO/table';
import { ParsingModal } from '@/components/ParsingModal';
import TextWithTooltip from '@/components/TextWithTooltip';
import { TraderManagementConfig } from './TraderManagementConfig';
import { useTraderManegeMentSearchingValue } from './atoms';
import { bcoBondRecommendTraderManagementColumns } from './columns';
import { BCORecommendTableBondTraderManagementeProvider, useBCORecommendTraderConfigList } from './provider';
import { checkUnsaved, getIsUnsaved } from './useTraderEditingConfig';

type TabType = 'HRule' | 'FRule';

const compareBoolean = (boolA: boolean, boolB: boolean) => {
  if (boolA === boolB) {
    return 0;
  }
  if (boolA) return -1;
  return 1;
};

export const BCOBondRecommendTraderManagement = ({ initTraderID }: { initTraderID?: string }) => {
  const [activeTab, setActiveTab] = useState<TabType>('HRule');

  const { traderConfigs: traders, refreshTraderConfig: refreshTrader } = useBCORecommendTraderConfigList();

  const [selectedRowID, setSelectedRowID] = useState(initTraderID);

  const [selectedConfigID, setSelectedConfigID] = useState<string>();

  const [currentConfigList, setCurrentConfigList] = useState<BondRecommendConfig[]>([]);

  const [isEditingConfigNewConfig, setIsEditingConfigNewConfig] = useState(false);

  const [editingIssureTraderID, setEditingIssureTraderID] = useState<string>();

  const [traderSearch] = useTraderManegeMentSearchingValue();

  // const setModifyTabNameModalVisible = useSetAtom(modifyTabNameModalVisibleAtom);
  // const setModifyingTab = useSetAtom(modifyingTabAtom);

  const refMap = useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    if (initTraderID != null) {
      refMap.current?.[initTraderID]?.scrollIntoView();
    }
  }, [initTraderID]);

  useEffect(() => {
    if (selectedRowID == null) {
      setSelectedRowID(traders[0]?.trader_id);
    }
  }, [traders]);

  const selectedTrader = useMemo(() => traders.find(t => t.trader_id === selectedRowID), [selectedRowID, traders]);

  const displayConfigList = useMemo(() => {
    return currentConfigList.filter(
      c =>
        (c.rule_type === RecommendRuleType.H && activeTab === 'HRule') ||
        (c.rule_type === RecommendRuleType.F && activeTab === 'FRule')
    );
  }, [currentConfigList, activeTab]);

  const selectedConfig = useMemo(() => {
    return displayConfigList.find(i => i.id === selectedConfigID);
  }, [displayConfigList, selectedConfigID]);

  useEffect(() => {
    if (selectedConfig == null) {
      setSelectedConfigID(displayConfigList[0]?.id);
    }
  }, [displayConfigList]);

  useEffect(() => {
    refreshTrader();
  }, []);

  useEffect(() => {
    if (selectedTrader != null) {
      setActiveTab('HRule');
      setSelectedConfigID((selectedTrader.list ?? [])[0]?.id);
      setCurrentConfigList(selectedTrader.list ?? []);
    }
  }, [selectedTrader]);

  const onOpenParsingModal = useCallback((traderID: string) => {
    setEditingIssureTraderID(traderID);
  }, []);

  const onCheck = useCallback(
    async (props: { checked: boolean; item: GetConfig.TraderBondConfig; column: string }) => {
      const { checked, item, column } = props;
      await bcoBondRecommendEnableConfig({
        trader_id_list: [item.trader_id],
        h_enabled: column === 'h_enabled' ? checked : item.h_enabled,
        f_enabled: column === 'f_enabled' ? checked : item.f_enabled,
        im_enabled: column === 'im_enabled' ? checked : item.im_enabled,
        qm_enabled: column === 'qm_enabled' ? checked : item.qm_enabled,
        issuer_enabled: column === 'issuer_enabled' ? checked : item.issuer_enabled
      });
      refreshTrader();
    },
    [refreshTrader]
  );

  const displayTraders = useMemo(() => {
    if (traderSearch === '') return traders;
    return traders
      .map((t, i) => {
        return {
          ...t,
          isTraderNameSinplePinYinMatched: t.trader_pinyin.includes(traderSearch),
          isTraderNamePinYinMatched: t.trader_pinyin_full.includes(traderSearch),
          isTraderNameMatched: t.trader_name.includes(traderSearch),
          isInstNameSinplePinYinMatched: t.inst_pinyin.includes(traderSearch),
          isInstNamePinYinMatched: t.inst_pinyin_full.includes(traderSearch),
          isInstNameMatched: t.inst_name.includes(traderSearch),
          originIndex: i
        };
      })
      .filter(
        t =>
          t.isTraderNameMatched ||
          t.isTraderNamePinYinMatched ||
          t.isTraderNameSinplePinYinMatched ||
          t.isInstNameMatched ||
          t.isInstNamePinYinMatched ||
          t.isInstNameSinplePinYinMatched
      )
      .sort((a, b) => {
        let result = compareBoolean(a.isTraderNameSinplePinYinMatched, b.isTraderNameSinplePinYinMatched);
        if (result !== 0) return result;
        result = compareBoolean(a.isTraderNamePinYinMatched, b.isTraderNamePinYinMatched);
        if (result !== 0) return result;
        result = compareBoolean(a.isTraderNameMatched, b.isTraderNameMatched);
        if (result !== 0) return result;
        result = compareBoolean(a.isInstNameSinplePinYinMatched, b.isInstNameSinplePinYinMatched);
        if (result !== 0) return result;
        result = compareBoolean(a.isInstNamePinYinMatched, b.isInstNamePinYinMatched);
        if (result !== 0) return result;
        result = compareBoolean(a.isInstNameMatched, b.isInstNameMatched);
        if (result !== 0) return result;

        return a.originIndex - b.originIndex;
      });
  }, [traderSearch, traders]);

  const onEditCancel = useCallback(() => {
    setCurrentConfigList(list => list.filter(i => i.id !== '0'));
  }, []);

  return (
    <div className="flex px-6 pt-3 pb-4 bg-gray-700 h-full flex-1 overflow-hidden overflow-x-overlay">
      <BCORecommendTableBondTraderManagementeProvider initialState={{ onCheck, onOpenParsingModal }}>
        {displayTraders.length === 0 ? (
          <div className="border-gray-400 border border-solid rounded w-[50%] flex items-center">
            <Placeholder type="no-data" />
          </div>
        ) : (
          <BcoRecommendTable<GetConfig.TraderBondConfig>
            bordered
            showHeader
            columns={bcoBondRecommendTraderManagementColumns}
            onSelectRow={i => {
              setSelectedRowID(i[0]);
              setCurrentConfigList(traders.find(t => t.trader_id === i[0])?.list ?? []);
            }}
            selectedRowIDs={selectedRowID == null ? [] : [selectedRowID]}
            list={displayTraders}
            getItemID={i => i.trader_id}
            refMap={refMap}
          />
        )}
      </BCORecommendTableBondTraderManagementeProvider>
      <ParsingModal<GetInstByName.InstInfo>
        clearSelectionOnClear
        placeholder="粘贴/输入文本至框内，多个主体请换行拆分"
        visible={editingIssureTraderID != null}
        onParse={async text => {
          const res = await getInstByName({ name_list: text.split(/\s+/) });

          return res.inst_list ?? [];
        }}
        getItemID={item => item.inst_code}
        getItemName={item => item.full_name_zh}
        onConfirm={async val => {
          if (editingIssureTraderID == null) return;

          await uploadIssureList({
            trader_id: editingIssureTraderID,
            issuer_code_list: val.checkedItems.map(i => i.inst_code)
          });
        }}
        onClose={() => setEditingIssureTraderID(undefined)}
      />
      <div className="flex-1 min-w-[845px] ml-4 border-solid border border-gray-400 rounded flex flex-col overflow-hidden">
        {displayTraders.length !== 0 && (
          <>
            <div className="px-4 pt-2 bg-gray-800 flex">
              <Tabs
                activeKey={activeTab}
                onChange={v => checkUnsaved(() => setActiveTab(v as TabType))}
              >
                <Tabs.TabPane
                  tab="H规则"
                  key="HRule"
                />
                <Tabs.TabPane
                  tab="F规则"
                  key="FRule"
                />
              </Tabs>
            </div>
            <div className="px-t pt-2 flex flex-col overflow-hidden">
              <div className="border-dashed border-0 border-b border-gray-400 pb-2 px-4 flex">
                {displayConfigList.length !== 0 && (
                  <div className="flex border-solid border border-primary-200 rounded-sm h-8 overflow-hidden">
                    {displayConfigList.map((config, i) => (
                      <div
                        key={config.id}
                        className={`flex min-w-[100px] max-w-[144px] items-center pl-4 pr-2 text-xs text-white cursor-pointer justify-between ${
                          selectedConfigID === config.id
                            ? 'bg-primary-200 hover:bg-primary-100'
                            : 'hover:text-primary-200'
                        } ${i === 0 ? '' : 'border-0 border-l border-solid border-primary-200'}`}
                        onClick={() => checkUnsaved(() => setSelectedConfigID(config.id))}
                        onDoubleClick={() => {
                          // setModifyTabNameModalVisible(true);
                          setIsEditingConfigNewConfig(false);
                          // setModifyingTab({
                          //   id: config.id,
                          //   virtualId: 0,
                          //   name: config.name ?? '',
                          //   type: 0
                          // });
                        }}
                      >
                        <TextWithTooltip
                          text={config.name}
                          maxWidth={144}
                        />
                        <i
                          className="icon-close1 w-4 h-4 hover:bg-gray-300 ml-2 flex-shrink-0"
                          onClick={e => {
                            e.stopPropagation();
                            ModalUtils.warning({
                              title: '确认删除当前方案？',
                              onOk: async () => {
                                if (config.id === '0') {
                                  setSelectedConfigID(undefined);
                                  setCurrentConfigList([...(selectedTrader?.list ?? [])]);
                                } else {
                                  await bcoBondRecommendDeleteConfig({ config_id: config.id });
                                  refreshTrader();
                                }
                              }
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  type="primary"
                  className="ml-auto"
                  disabled={currentConfigList.length >= 3 || selectedConfig?.id === '0'}
                  onClick={() => {
                    if (getIsUnsaved()) {
                      message.warn('请先保存方案');
                      return;
                    }
                    // setModifyTabNameModalVisible(true);
                    setIsEditingConfigNewConfig(true);
                    // setModifyingTab({
                    //   id: '0',
                    //   virtualId: 0,
                    //   name: `方案${['一', '二', '三'][currentConfigList.length]}`,
                    //   type: 0
                    // });
                  }}
                >
                  {' '}
                  + 添加方案
                </Button>
              </div>
            </div>
            <TraderManagementConfig
              savedConfig={selectedConfig}
              traderID={selectedTrader?.trader_id}
              onSaved={refreshTrader}
              onCancel={onEditCancel}
            />

            {/* <ModifyTabNameModal<ITab<number>>
              modalTitle={isEditingConfigNewConfig ? '添加方案' : '修改名称'}
              inputLabel="方案名称"
              tabAtom={modifyingTabAtom}
              visibleAtom={modifyTabNameModalVisibleAtom}
              onSubmit={async result => {
                const current = currentConfigList.find(c => c.id === result.id);

                if (result.name === '') {
                  message.error('方案名不能为空');
                  return false;
                }

                if (isEditingConfigNewConfig) {
                  const emptyTraderConfig = getEmptyTraderConfig(
                    activeTab === 'HRule' ? RecommendRuleType.H : RecommendRuleType.F
                  );
                  setCurrentConfigList(cur => [...cur, { ...emptyTraderConfig, name: result.name }]);
                  setSelectedConfigID(emptyTraderConfig.id);
                } else if (current != null && selectedRowID != null) {
                  current.name = result.name;
                  setCurrentConfigList([...currentConfigList]);
                  await bcoBondRecommendUpdateConfig({
                    config: current,
                    trader_id: selectedRowID
                  });
                }

                return true;
              }}
              allowNameUnchanged
            /> */}
          </>
        )}
      </div>
    </div>
  );
};
