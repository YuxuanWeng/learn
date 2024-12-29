import { useMemo } from 'react';
import { MarketNotifyMsgTypeMap } from '@fepkg/business/constants/map';
import { Footer } from '@fepkg/components/Dialog/Footer';
import { Highlight } from '@fepkg/components/Highlight';
import { ModalUtils } from '@fepkg/components/Modal';
import { Select } from '@fepkg/components/Select';
import { IconEdit, IconSave } from '@fepkg/icon-park-react';
import { AccessCode } from '@fepkg/services/access-code';
import { MarketNotifyMsgType } from '@fepkg/services/types/enum';
import { useAuth } from '@/providers/AuthProvider';
import { useHomeLayout } from '@/providers/LayoutProvider';
import { useBondConfig } from '@/providers/OutBoundConfigProvider';
import { isEqual } from 'lodash-es';
import {
  MarketNotifyBasicTags,
  MarketNotifyBondTags,
  MarketNotifyDealTags,
  MarketNotifyQuoteTags,
  PrimaryMarketNotifyTags
} from '@/common/constants/out-bound-fields';
import { OutBoundMap } from '@/layouts/constant';
import { ProductOption, primaryMarket, secondaryMarket } from '../constants';
import { ConfigAside } from './components/ConfigAside';
import { FieldsGroup } from './components/FieldsGroup/FieldsGroup';
import { AnchorType } from './components/FieldsGroup/types';
import { ANCHOR_ID, DEFAULT_CONF, primaryOptions, secondaryOptions } from './constants';

export const OutBoundConfig = () => {
  const { current, confOpen, setConfOpen } = useHomeLayout();
  const { configState, setConfigState, productType, setProductType, mutateConfig, handleAction, configStateQuery } =
    useBondConfig();
  const { access } = useAuth();

  const originalData = configStateQuery.data ?? DEFAULT_CONF;

  /** 点击编辑/保存按钮 */
  function handleClick() {
    if (confOpen) {
      setConfOpen(false);
      if (!isEqual(configStateQuery.data?.[productType], configState?.[productType])) {
        mutateConfig({ [productType]: configState[productType] });
      }
    } else setConfOpen(true);
  }

  /** 切换行情推送开关 */
  function handleSwitch(val: boolean, type: MarketNotifyMsgType) {
    const modalType = val ? 'confirm' : 'warn';
    const onOffText = val ? '开启' : '关闭';

    ModalUtils[modalType]({
      title: `${onOffText}${MarketNotifyMsgTypeMap[type]}`,
      content: (
        <Highlight keyword={OutBoundMap[current].name}>
          {`确定${onOffText}${OutBoundMap[current].name}的${MarketNotifyMsgTypeMap[type]}吗？`}
        </Highlight>
      ),

      onOk() {
        // const typeList = originalData.msgTypeList;
        const typeList = originalData?.[productType]?.msgTypeList;
        const res = val ? [...typeList, type] : typeList.filter(i => i !== type);
        // 请求修改行情推送配置
        const result = { [productType]: { ...originalData?.[productType], msgTypeList: res } };

        mutateConfig(result);
      }
    });
  }

  const onFieldChange = (val: boolean, id: number) =>
    setConfigState(draft => {
      draft[productType].fieldList = val
        ? // 勾选就加上id
          [...(draft?.[productType]?.fieldList ?? []), id]
        : // 取消勾选就过滤id
          draft?.[productType]?.fieldList.filter(i => i !== id);
    });

  const noEditAccess = !access?.has(AccessCode.CodeOdmUpdate);

  const options = useMemo(() => {
    if (primaryMarket.has(productType)) return primaryOptions;
    if (secondaryMarket.has(productType)) return secondaryOptions;
    return [];
  }, [productType]);

  return (
    <div className="flex mt-4 pb-4 px-4 h-[calc(100%_-_77px)]">
      <ConfigAside
        anchorId={ANCHOR_ID}
        options={options}
      />
      <div className="h-full w-full bg-gray-800 rounded-r-lg">
        <Footer
          className="bg-transparent border-none h-14"
          showBtn
          cancelBtnProps={{ className: confOpen ? '' : 'hidden' }}
          onCancel={() => handleAction(() => setConfOpen(false))}
          onConfirm={() => handleClick()}
          confirmBtnProps={{
            label: confOpen ? '保存' : '编辑',
            icon: confOpen ? <IconSave /> : <IconEdit />,
            disabled: noEditAccess
          }}
        >
          <Select
            className="w-[158px]"
            placeholder="不限"
            disabled={confOpen}
            value={productType}
            clearIcon={null}
            options={ProductOption}
            onChange={val => {
              setProductType(val);
            }}
          />
        </Footer>

        <div className="component-dashed-x mb-4" />
        <div
          // 使用负的右边距，将滚动条搬到内容外面，使分割线能够抵达最右侧，hover后边距减掉滚动条的8px，视觉上看起来容器宽度没有发生变化
          className="flex-1 h-[calc(100%_-_84px)] overflow-hidden hover:overflow-y-scroll pr-2 hover:pr-0"
          id={ANCHOR_ID}
        >
          <FieldsGroup
            anchorId={AnchorType.Base}
            title="默认字段"
            data={MarketNotifyBasicTags}
          />

          {secondaryMarket.has(productType) && (
            <FieldsGroup
              anchorId={AnchorType.Bond}
              title="债券基础信息"
              data={MarketNotifyBondTags}
              enabledFields={configState?.[productType]?.fieldList}
              onFieldChange={onFieldChange}
              configEnabled
              disabled={!confOpen}
            />
          )}

          {secondaryMarket.has(productType) && (
            <FieldsGroup
              anchorId={AnchorType.BestQuote}
              title="最优报价信息"
              data={MarketNotifyQuoteTags}
              enabledFields={configState?.[productType]?.fieldList}
              onFieldChange={onFieldChange}
              captionProps={{ type: 'orange' }}
              switchProps={{
                checked:
                  originalData?.[productType]?.msgTypeList?.includes(MarketNotifyMsgType.MarketNotifyMsgBondHandicap) ??
                  false,
                disabled: noEditAccess,
                onChange: val => handleSwitch(val, MarketNotifyMsgType.MarketNotifyMsgBondHandicap)
              }}
              // 配置外发字段时，不可切换推送开关
              switchEnabled={!confOpen}
              configEnabled
              disabled={!confOpen}
            />
          )}

          {secondaryMarket.has(productType) && (
            <FieldsGroup
              anchorId={AnchorType.Deal}
              title="成交信息"
              data={MarketNotifyDealTags}
              enabledFields={configState?.[productType]?.fieldList}
              onFieldChange={onFieldChange}
              captionProps={{ type: 'secondary' }}
              switchProps={{
                checked:
                  originalData?.[productType]?.msgTypeList?.includes(MarketNotifyMsgType.MarketNotifyMsgDeal) ?? false,
                disabled: noEditAccess,
                onChange: val => handleSwitch(val, MarketNotifyMsgType.MarketNotifyMsgDeal)
              }}
              switchEnabled={!confOpen}
              configEnabled
              disabled={!confOpen}
            />
          )}

          {primaryMarket.has(productType) && (
            <FieldsGroup
              title="报价信息"
              anchorId={AnchorType.Quote}
              data={PrimaryMarketNotifyTags}
              enabledFields={configState?.[productType]?.fieldList}
              onFieldChange={onFieldChange}
              captionProps={{ type: 'secondary' }}
              switchProps={{
                checked:
                  originalData?.[productType]?.msgTypeList?.includes(MarketNotifyMsgType.MarketNotifyMsgNCDP) ?? false,
                disabled: noEditAccess,
                onChange: val => handleSwitch(val, MarketNotifyMsgType.MarketNotifyMsgNCDP)
              }}
              switchEnabled={!confOpen}
              configEnabled
              disabled={!confOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};
