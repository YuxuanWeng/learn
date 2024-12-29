import { useCallback, useEffect, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { ModalUtils } from '@fepkg/components/Modal';
import { BondRecommendConfig } from '@fepkg/services/types/algo-common';
import { RecommendRuleType, TimeToMaturityUnit } from '@fepkg/services/types/algo-enum';
import { isEqual, omitBy } from 'lodash-es';
import { bcoBondRecommendUpdateConfig } from '@/common/services/api/algo/bond-recommend-api/update-config';
import type { TraderManagementConfigProp } from './TraderManagementConfig';
import { getEmptyTraderConfig } from './TraderManagementOptions';
import styles from './style.module.less';

type TraderConfigUnsavedProp = {
  editingConfig?: BondRecommendConfig;
  originConfig?: BondRecommendConfig;
  traderID?: string;
  onSave?: VoidFunction;
  onCancel?: VoidFunction;
};

const savedRef: TraderConfigUnsavedProp = {};

export const getConfigForCheck = (config?: BondRecommendConfig) => {
  if (config == null) return config;

  if (config.rule_type === RecommendRuleType.F) {
    const {
      min_price,
      max_price,
      deviate_price,
      min_period,
      max_period,
      time_to_maturity_unit,
      period_type,
      bond_financial_category_type
    } = config;

    const result = {
      min_price,
      max_price,
      deviate_price,
      min_period,
      max_period,
      time_to_maturity_unit,
      period_type: period_type ?? [],
      bond_financial_category_type: bond_financial_category_type ?? []
    };

    if ((min_period == null || min_period === 0) && (max_period == null || max_period === 0)) {
      result.time_to_maturity_unit = TimeToMaturityUnit.TimeToMaturityUnitYear;
    }

    return result;
  }

  const result = { ...config };

  if (
    (config.min_period == null || config.min_period === 0) &&
    (config.max_period == null || config.max_period === 0)
  ) {
    result.time_to_maturity_unit = TimeToMaturityUnit.TimeToMaturityUnitYear;
  }

  return omitBy(
    {
      ...result,
      id: '0',
      name: '',
      is_gn: result.is_gn === true,
      is_mortgage: result.is_mortgage === true,
      is_not_option: result.is_not_option === true,
      config_desc: '',
      bond_financial_category_type: result.bond_financial_category_type ?? []
    },
    v => v == null
  );
};

export const useTraderEditingConfig = ({
  savedConfig: originConfig,
  traderID,
  onSaved,
  onCancel
}: TraderManagementConfigProp) => {
  const [innerConfig, setInnerConfig] = useState(originConfig);

  const onSave = useCallback(async () => {
    if (innerConfig == null || traderID == null) return;
    if (
      innerConfig.rule_type === RecommendRuleType.H &&
      ((innerConfig.bond_market_type ?? []).length === 0 || (innerConfig.bond_goods_type ?? []).length === 0)
    ) {
      message.error('当前方案不完整，请检查后保存');
      return;
    }

    await bcoBondRecommendUpdateConfig({
      config: {
        ...innerConfig,
        min_price: innerConfig.min_price ?? 0,
        max_price: innerConfig.max_price ?? 0,
        min_period: innerConfig.min_period ?? 0,
        max_period: innerConfig.max_period ?? 0
      },
      trader_id: traderID
    });

    message.success('保存成功！');

    onSaved();
  }, [innerConfig, traderID, onSaved]);

  useEffect(() => {
    savedRef.editingConfig = innerConfig;
    savedRef.originConfig = originConfig;
    savedRef.traderID = traderID;
    savedRef.onSave = onSave;
    savedRef.onCancel = onCancel;
  }, [innerConfig, originConfig, traderID, onSave, onCancel]);

  return { innerConfig, setInnerConfig, onSave };
};

export const getIsUnsaved = () => {
  const { originConfig, editingConfig } = savedRef;

  return (
    editingConfig != null &&
    (editingConfig.id === '0' || !isEqual(getConfigForCheck(editingConfig), getConfigForCheck(originConfig)))
  );
};

export const checkUnsaved = (callback: VoidFunction) => {
  const { traderID, onSave, editingConfig, onCancel } = savedRef;
  const isUnsaved = getIsUnsaved();

  const isDefault = isEqual(
    getConfigForCheck(editingConfig),
    getConfigForCheck(getEmptyTraderConfig(editingConfig?.rule_type ?? RecommendRuleType.H))
  );

  if (isDefault) {
    onCancel?.();
    callback();
    return;
  }

  if (isUnsaved) {
    ModalUtils.warning({
      closable: true,
      closeIcon: <i className="icon-close1 w-5 h-5" />,
      className: styles['unsave-modal'],
      title: '您还有未保存的更改，要保存吗？',
      onOk: () => {
        if (traderID == null) return;
        onSave?.();
        callback();
      },
      cancelButtonProps: {
        onClick: () => {
          onCancel?.();
          callback();
        }
      }
    });
  } else {
    callback();
  }
};
