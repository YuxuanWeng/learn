import { KeyboardEventHandler, useRef, useState } from 'react';
import cx from 'classnames';
import { BondOptionRender, transform2BondOpt } from '@fepkg/business/components/Search/BondSearch';
import { FRTypeShortMap } from '@fepkg/business/constants/map';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Search, SearchOption } from '@fepkg/components/Search';
import { TextBadge } from '@fepkg/components/Tags';
import { Tooltip } from '@fepkg/components/Tooltip';
import { IconCloseCircleFilled, IconDown } from '@fepkg/icon-park-react';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondCategory } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, defer, delay } from 'lodash-es';
import { trackPoint } from '@/common/utils/logger/point';
import { useHead } from '@/components/IDCBoard/Head/HeadProvider';
import { useSearchableBond } from '@/components/IDCBoard/Head/SearchableBondProvider';
import useFuzzyData from '@/components/IDCBoard/Head/useFuzzyData';
import useInitData from '@/components/IDCBoard/Head/useInitData';
import { SpotDate } from '@/components/IDCSpot/types';
import { useProductParams } from '@/layouts/Home/hooks';
import { usePanelState } from '@/pages/Spot/Panel/Providers/PanelStateProvider';

// 防止过快输入并敲击Enter，导致无法选中，后期债券数据本地化后可以考虑去掉
const ENTER_DELAY_TIME = 200;

type PropType = {
  simplifyMode?: boolean;
};

const BASE_CLASS =
  'flex items-center justify-between bg-gray-700 rounded-lg px-3 border border-solid border-transparent';

export const SearchableBond = ({ simplifyMode }: PropType) => {
  const contentWidth = simplifyMode ? 'w-[198px]' : 'w-[294px]';
  const contentHeight = simplifyMode ? 'h-6' : 'h-8';

  const { kwd, setKwd, searchIptRef } = useSearchableBond();
  const { productType } = useProductParams();
  const [hover, setHover] = useState(false);

  /* 关于回弹逻辑
   * 搜索框已选券时，搜索无匹配项的债券信息/点击enter/焦点移除，要求恢复原来券；未选券要求置空
   */
  const { bond, setBond, idx, initKeyMarket, setQuickSpotDate } = useHead();

  const { updateCache } = usePanelState();

  // 由于search组件触发时机发生变化,增加bounceBond处理回弹
  const bounceBond = useRef<FiccBondBasic | null>();
  const currentInputValue = useRef<string>();

  const [editing, setEditing] = useState(false);

  const { options } = useFuzzyData({ kwd });
  // 根据传入的keyMarket进行初始化
  useInitData({
    initKeyMarket,
    onSuccess: data => {
      if (data?.length) {
        bounceBond.current = null;
        setBond(data.at(0)?.original ?? null);
      }
      // 当债券被其它内容顶掉时，bond有值，keyMarket为空，此时需要把债券信息清空
      else if (bond && !initKeyMarket) setBond(null);
    }
  });

  const changeEditMode = useMemoizedFn((edit: boolean) => {
    if (edit) {
      requestIdleCallback(() => {
        searchIptRef.current?.select();
      });
    }
    setEditing(edit);
    if (edit) {
      setKwd(bond?.bond_code || '');
      defer(() => searchIptRef?.current?.focus());
      trackPoint('start-edit');
    } else if (bounceBond.current) {
      setBond(bounceBond.current);
    }
  });

  const handleChange = useMemoizedFn((opt?: SearchOption<FiccBondBasic> | null) => {
    setBond(opt?.original ?? null);
    if (idx !== undefined) updateCache(idx, opt?.original.key_market);

    if (opt?.original) {
      // 选中新债券时重置它的结算方式筛选
      setQuickSpotDate(SpotDate.NonFRA);
      // 正常选中情况下，清除回弹的bond
      bounceBond.current = null;
      changeEditMode(false);
    } else if (kwd && currentInputValue.current) {
      // 否则将上次的bond记录下来
      bounceBond.current = cloneDeep(bond);
    }
  });

  const handleInputChange = useMemoizedFn((v: string) => {
    setKwd(v);
    currentInputValue.current = v;
    if (!v) {
      bounceBond.current = null;
      setBond(null);
    }
  });

  const handleBlur = () => {
    // 失焦回弹
    if (kwd && !bond && bounceBond.current) {
      setBond(bounceBond.current);
      if (idx !== undefined) updateCache(idx, bounceBond.current.key_market);
    }
    changeEditMode(false);
  };

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = evt => {
    if (evt.key === KeyboardKeys.Enter) {
      if (!options.length) evt.stopPropagation();
      delay(() => {
        requestAnimationFrame(() => {
          setKwd('');
          changeEditMode(false);
        });
      }, ENTER_DELAY_TIME ?? 0);

      trackPoint('keyboard-enter');
    }
  };

  const frType = bond?.fr_type != undefined ? FRTypeShortMap[bond?.fr_type] : '';
  const showFrTypeBadge = !!frType;

  /** 是否是地方债 */
  const isLGB = bond?.bond_category === BondCategory.LGB;

  /** 地方债先展示<简称>，后展示<代码> */
  const firstContent = isLGB ? bond?.short_name : bond?.display_code ?? bond?.bond_code;
  const secondContent = isLGB ? bond?.display_code ?? bond?.bond_code : bond?.short_name;

  const renderIcon =
    hover && ((editing && (kwd || bond)) || (!editing && bond)) ? (
      <IconCloseCircleFilled
        className="text-primary-300  cursor-pointer"
        onClick={() => {
          setKwd('');
          handleChange(null);
          handleInputChange('');
        }}
      />
    ) : (
      <IconDown className="text-gray-200" />
    );

  const optionRender = BondOptionRender(productType);

  return (
    <main className="!rounded-lg !bg-transparent">
      {editing && (
        <Search<FiccBondBasic>
          ref={searchIptRef}
          placeholder="请选择产品"
          className={cx(contentWidth, contentHeight)}
          rounded
          strategy="fixed"
          suffixIcon={renderIcon}
          focusAfterClearing
          inputValue={kwd}
          value={transform2BondOpt(bond)}
          options={options}
          optionRender={optionRender}
          onChange={handleChange}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeydown}
          autoClear={false}
          onMouseLeave={() => setHover(false)}
        />
      )}
      {!editing && bond && (
        <div
          className={cx(BASE_CLASS, 'hover:border-primary-100 select-none', contentHeight, contentWidth)}
          onClick={() => changeEditMode(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {showFrTypeBadge && (
            <TextBadge
              type="BOND"
              text={frType}
              className="mr-2"
            />
          )}

          <Tooltip
            truncate
            content={firstContent}
          >
            <span
              className={cx(
                'font-bold text-gray-000 inline-block max-w-[192px] truncate',
                simplifyMode ? 'text-sm' : 'text-md'
              )}
            >
              {firstContent}
            </span>
          </Tooltip>

          <Tooltip
            truncate
            content={
              <div className="flex gap-2">
                <span>{secondContent}</span>
                {!simplifyMode && <span>{bond?.time_to_maturity}</span>}
              </div>
            }
          >
            <span
              className={cx(
                'flex-1 ml-2 font-medium text-gray-200 inline-block truncate',
                simplifyMode ? 'text-xs' : 'text-sm'
              )}
            >
              {secondContent}
              {!simplifyMode && <span className="ml-2">{bond?.time_to_maturity}</span>}
            </span>
          </Tooltip>

          {renderIcon}
        </div>
      )}
      {!editing && !bond && (
        <div
          className={cx(BASE_CLASS, 'hover:border-primary-100', contentWidth, contentHeight)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => changeEditMode(true)}
        >
          <span className="text-sm font-medium text-gray-300">请选择产品</span>
          {renderIcon}
        </div>
      )}
    </main>
  );
};
