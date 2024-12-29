import { KeyboardEvent } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/index';
import { Button } from '@fepkg/components/Button';
import { Input } from '@fepkg/components/Input';
import { NCDFiltersParsingProps } from '@/components/BondFilter/NCDFiltersParsing/types';
import { useNCDFiltersParsing } from '@/components/BondFilter/NCDFiltersParsing/useNCDFiltersParsing';

export const NCDFiltersParsingInput = ({ onChange }: NCDFiltersParsingProps) => {
  const { text, setText, loading, parsingDisabled, handleReset, handleParsing } = useNCDFiltersParsing(onChange);

  return (
    <div className="flex gap-3">
      <Input
        className="w-[958px] h-7"
        placeholder="粘贴或输入剩余期限/到期日/发行人/主体评级识别"
        value={text}
        onChange={setText}
        onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => {
          if (evt.key === KeyboardKeys.Escape) handleReset();
        }}
        onEnterPress={(_, evt, composing) => {
          // 阻止默认事件
          evt.preventDefault();
          // 如果不是正在输入中文，进行识别
          if (!composing) handleParsing();
        }}
      />
      <Button
        className="h-7 w-[76px] !p-0"
        disabled={parsingDisabled}
        loading={loading}
        onClick={handleParsing}
      >
        识别
      </Button>
    </div>
  );
};
