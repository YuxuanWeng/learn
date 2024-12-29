import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@fepkg/components/Tooltip';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondSearchType } from '@fepkg/services/types/enum';
import {
  BondSearch,
  BondSearchProvider,
  transform2BondOpt,
  useBondSearch
} from '@/components/business/Search/BondSearch';
import { useProductParams } from '@/layouts/Home/hooks';
import { getShortName } from '@/pages/Spot/Panel/DealRecord/utils';
import { useComposition } from './utils/useComposition';

type BondCodeProps = {
  /** 是否可编辑的  */
  editable?: boolean;
  /** 默认债券信息 */
  defaultBond?: FiccBondBasic;
  /** 修改债券 */
  onChange?: (val: FiccBondBasic, onError: VoidFunction) => void;
};

/**
 * 第二行-债券代码
 * 双击债券代码进入到修改状态
 * 在下拉选项中选中债券后立马变成展示状态
 */

const Inner = ({ editable, defaultBond, onChange }: BondCodeProps) => {
  const { bondSearchRef, bondSearchState, updateBondSearchState } = useBondSearch();
  const [isModify, setIsModify] = useState(false);

  const bond = bondSearchState.selected?.original;

  const searchRef = useRef(null);

  const bondText = `${bond?.display_code ?? defaultBond?.display_code} ${getShortName(bond ?? defaultBond)[1]}`;

  useEffect(() => {
    if (!editable) setIsModify(false);
  }, [editable]);

  const { hasCompostionRef, elementProps } = useComposition();

  return (
    <div className="flex-1 overflow-hidden min-w-[140px]">
      {isModify ? (
        <BondSearch
          ref={searchRef}
          {...elementProps}
          className="w-[140px] h-8"
          label=""
          searchParams={{ search_type: BondSearchType.SearchDealProcess }}
          onBlur={() => {
            requestIdleCallback(() => {
              setIsModify(false);
              // 如果此时没有选中，则使用传入的默认值
              updateBondSearchState(draft => {
                if (!draft.selected) draft.selected = transform2BondOpt(defaultBond);
              });
            });
          }}
          onEnterPress={() => {
            if (hasCompostionRef.current) return;
            bondSearchRef.current?.blur();
          }}
          onChange={opt => {
            updateBondSearchState(draft => {
              draft.selected = opt ?? null;
            });

            if (!opt?.original) return;
            // 选中有效选项后立即失焦
            onChange?.(opt.original, () => {
              updateBondSearchState(d => {
                d.selected = null;
              });
            });
            bondSearchRef.current?.blur();
          }}
        />
      ) : (
        <div
          className="ml-3 h-8 text-orange-050 flex items-center"
          // 双击切换修改状态
          onDoubleClick={e => {
            if (!editable) return;
            e.stopPropagation();

            setIsModify(true);
            requestIdleCallback(() => {
              bondSearchRef.current?.focus();
              bondSearchRef.current?.select();
            });
          }}
        >
          <Tooltip
            truncate
            content={bondText}
          >
            <div className="leading-6 text-sm whitespace-nowrap truncate font-semibold">{bondText}</div>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export const BondCode = (props: BondCodeProps) => {
  const key = props?.defaultBond?.code_market;
  const { productType } = useProductParams();

  return (
    <BondSearchProvider
      key={key}
      initialState={{ productType, defaultValue: props?.defaultBond }}
    >
      <Inner {...props} />
    </BondSearchProvider>
  );
};
