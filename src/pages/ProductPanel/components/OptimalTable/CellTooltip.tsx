import { useEffect, useState } from 'react';
import cx from 'classnames';
import { UserSettingFunction } from '@fepkg/services/types/enum';
import { useAtom, useSetAtom } from 'jotai';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { DeepQuote, deepQuoteIsCheckedAtom } from '@/components/DeepQuote';
import { SubSingleQuoteDialog } from '@/components/Quote/types';
import { optimalTableSelectedRowKeysAtom } from '@/pages/ProductPanel/atoms/table';
import { OptimalTableColumn } from './types';

type SideCellProps = {
  unquoted: boolean;
  /** 原始数据 */
  column: OptimalTableColumn;
  updateVisible: (v: boolean, type?: string) => void;
  visible?: boolean;
  position: [number, number, number, number];
  clearDeepQuoteTimer?: () => void;
  close?: () => void;
  shortcutDisabled?: boolean;
} & SubSingleQuoteDialog;

export const CellTooltip = ({
  unquoted,
  column,
  visible,
  position,
  updateVisible,
  clearDeepQuoteTimer,
  close,
  singleQuoteProductType,
  shortcutDisabled
}: SideCellProps) => {
  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingDisplaySetting]) ?? false;
  const unitSto = getSetting<boolean>(UserSettingFunction.UserSettingDisplaySetting) ?? false;

  const [selectedBidRowKeys, setSelectedBidRowKeys] = useState(new Set<string>());
  const [selectedOfrRowKeys, setSelectedOfrRowKeys] = useState(new Set<string>());

  const [hasChecked, setHasChecked] = useAtom(deepQuoteIsCheckedAtom);

  const setSelectedRowKeys = useSetAtom(optimalTableSelectedRowKeysAtom);

  useEffect(() => {
    if (selectedBidRowKeys.size > 0 || selectedOfrRowKeys.size > 0) {
      setSelectedRowKeys(new Set<string>());
      setHasChecked(true);
    }
  }, [selectedBidRowKeys, selectedOfrRowKeys, setHasChecked, setSelectedRowKeys]);

  useEffect(() => {
    updateVisible(hasChecked || selectedBidRowKeys.size > 0 || selectedOfrRowKeys.size > 0, 'CellTooltip');
  }, [selectedBidRowKeys, selectedOfrRowKeys, hasChecked, updateVisible]);

  return (
    <div className={cx(visible && unitSto ? 'visible' : 'invisible', 'z-hightest')}>
      <DeepQuote
        unquoted={unquoted}
        clearDeepQuoteTimer={clearDeepQuoteTimer}
        position={position}
        column={column}
        close={close}
        hasCheckedModal={hasChecked}
        onChange={setHasChecked}
        selectedBidRowKeys={selectedBidRowKeys}
        setSelectedBidRowKeys={setSelectedBidRowKeys}
        selectedOfrRowKeys={selectedOfrRowKeys}
        setSelectedOfrRowKeys={setSelectedOfrRowKeys}
        singleQuoteProductType={singleQuoteProductType}
        shortcutDisabled={shortcutDisabled}
      />
    </div>
  );
};
