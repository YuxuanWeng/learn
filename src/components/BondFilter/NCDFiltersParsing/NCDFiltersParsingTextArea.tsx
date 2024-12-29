import { KeyboardEvent } from 'react';
import cx from 'classnames';
import { KeyboardKeys } from '@fepkg/common/utils/index';
import { Parsing } from '@fepkg/components/Parsing';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { NCDFiltersParsingProps } from '@/components/BondFilter/NCDFiltersParsing/types';
import { useNCDFiltersParsing } from '@/components/BondFilter/NCDFiltersParsing/useNCDFiltersParsing';
import { useProductParams } from '@/layouts/Home/hooks';

export const NCDFiltersParsingTextArea = ({ onChange }: NCDFiltersParsingProps) => {
  const { text, setText, loading, parsingDisabled, handleReset, handleParsing } = useNCDFiltersParsing(onChange);
  const { productType } = useProductParams();

  return (
    <div className="border border-solid border-gray-600 rounded-lg">
      <Parsing.Horizontal
        style={{ resize: 'none' }}
        controllerCls={cx(productType === ProductType.BCO ? 'flex !flex-row !gap-2' : '')}
        containerCls="!h-12 text-gray-000"
        className="rounded-r-none"
        placeholder="粘贴或输入剩余期限/到期日/发行人/主体评级识别"
        primaryBtnProps={{ label: '识别', loading, disabled: parsingDisabled, className: 'w-[60px]' }}
        secondaryBtnProps={{ label: '清空', className: 'w-[60px]' }}
        value={text}
        onChange={setText}
        onKeyDown={(evt: KeyboardEvent<HTMLTextAreaElement>) => {
          if (evt.key === KeyboardKeys.Escape) handleReset();
        }}
        onEnterPress={(_, evt, composing) => {
          // 如果按下 shift 键，仅换行，不进行其他操作
          if (evt.shiftKey) return;

          // 如果不是同时按下 shift 键，阻止默认事件
          evt.preventDefault();
          // 如果不是正在输入中文，进行识别
          if (!composing) handleParsing();
        }}
        onPrimaryClick={handleParsing}
        onSecondaryClick={handleReset}
        autoFocus
      />
    </div>
  );
};
