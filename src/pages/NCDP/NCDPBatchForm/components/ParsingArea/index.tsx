import { KeyboardEvent, useState } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { Parsing } from '@fepkg/components/Parsing';
import { NCDPInfo } from '@fepkg/services/types/common';
import { FRType } from '@fepkg/services/types/enum';
import { v4 } from 'uuid';
import { parsingNCDPInfo } from '@/common/services/api/parsing/ncdp-info';
import { useNCDPBatchForm } from '../../providers/FormProvider';
import { requiredFields } from '../../utils/check';

export const ParsingArea = () => {
  const { updateFormList } = useNCDPBatchForm();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const disabled = !text.replaceAll('\n', '').trim();

  const transformParsingResult = (list: NCDPInfo[]) => {
    // 见缝插针
    updateFormList(draft => {
      /** 空数据索引列表 */
      const emptyRowIdxList: number[] = [];

      for (let i = 0, len = draft.length; i < len; i++) {
        const item = draft[i];
        let empty = true;
        for (const key of requiredFields) {
          if (item[key]) {
            empty = false;
            break;
          }
        }

        if (empty) emptyRowIdxList.push(i);
      }

      // 如果没有空数据行索引了，那就不插入
      if (!emptyRowIdxList.length) return;

      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];
        draft[emptyRowIdxList[i]] = {
          key: v4(),
          ...item,
          fr_type: item?.fr_type || FRType.FRD,
          price: item?.price === SERVER_NIL || item?.price === 0 ? undefined : item?.price,
          volume: item?.volume ? item.volume / 10000 : undefined
        };
      }
    });
  };

  const handleReset = () => {
    setLoading(false);
    setText('');
  };

  const handleParsing = async () => {
    if (loading || disabled) return;

    setLoading(true);

    parsingNCDPInfo({ user_input: text })
      .then(({ ncdp_list }) => {
        transformParsingResult(ncdp_list ?? []);
        handleReset();
      })
      .catch(() => setLoading(false));
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === KeyboardKeys.Escape) handleReset();
  };

  return (
    <Parsing.Horizontal
      style={{ resize: 'none' }}
      className="rounded-r-none"
      placeholder="粘贴、输入报价文本进行识别"
      primaryBtnProps={{ label: '识别', loading }}
      secondaryBtnProps={{ label: '清空', className: 'w-[136px]' }}
      composition
      autoFocus
      value={text}
      onChange={setText}
      onKeyDown={handleKeyDown}
      onEnterPress={(_, evt, composing) => {
        evt.stopPropagation();

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
  );
};
