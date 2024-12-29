import { KeyboardEvent, useState } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Parsing } from '@fepkg/components/Parsing';
import { OperationSource, UserSettingFunction } from '@fepkg/services/types/enum';
import { addBondQuoteDraft } from '@/common/services/api/bond-quote-draft/add';
import { useUserSetting } from '@/common/services/hooks/useSettings/useUserSetting';
import { useProductParams } from '@/layouts/Home/hooks';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';
import { DropArea } from './DropArea';
import { UploadButton } from './UploadButton';

export const ParsingArea = () => {
  const { productType } = useProductParams();
  const { updateKeepingTimestamp } = useTableState();

  const { getSetting } = useUserSetting([UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar]);
  const autoStar = getSetting<boolean>(UserSettingFunction.UserSettingQuoteParsingDefaultFlagStar);

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const disabled = !text.replaceAll('\n', '').trim();

  const handleReset = () => {
    setLoading(false);
    setText('');
  };

  const handleParsing = async () => {
    if (loading || disabled) return;

    setLoading(true);

    addBondQuoteDraft({
      product_type: productType,
      text,
      source: OperationSource.OperationSourceQuoteDraft,
      flag_star: autoStar ? 1 : undefined
    })
      .then(() => {
        handleReset();
        updateKeepingTimestamp({ reset: true });
      })
      .catch(() => setLoading(false));
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === KeyboardKeys.Escape) handleReset();
  };

  return (
    <>
      <section className="px-3 pb-3 bg-gray-700">
        <Parsing.Horizontal
          style={{ resize: 'none' }}
          className="rounded-r-none"
          placeholder="粘贴或输入文本进行识别"
          controllersExtra={{ secondary: <UploadButton /> }}
          primaryBtnProps={{ label: '识别', loading }}
          secondaryBtnProps={{ label: '清空', className: 'w-[78px]' }}
          composition
          autoFocus
          value={text}
          onChange={setText}
          onKeyDown={handleKeyDown}
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
        />
      </section>

      <DropArea />
    </>
  );
};
