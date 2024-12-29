import { useState } from 'react';
import { uniqueArr } from '@fepkg/common/utils';
import { Button } from '@fepkg/components/Button';
import { message } from '@fepkg/components/Message';
import { IconScan } from '@fepkg/icon-park-react';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataIssuerInstMulSearch } from '@fepkg/services/types/base-data/issuer-inst-mul-search';
import { InstInfo } from '@fepkg/services/types/common';
import request from '@/common/request';
import { ParsingModal } from '@/components/ParsingModal';
import { BondIssueInfoFilterValue } from '../../types';

// export const DEFAULT_TAB_ID = 'DEFAULT_TAB_ID';

type IssuerModalProps = {
  className?: string;
  disabled?: boolean;
  value: BondIssueInfoFilterValue;
  /** 提供过滤识别数据的函数 */
  onFilter?: (value: InstInfo[]) => InstInfo[];
  updateIssueInfoFilterValue: (val: BondIssueInfoFilterValue) => void;
};

const handleParse = async (str: string) => {
  const keyword_list = uniqueArr(
    str
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean)
  );

  if (keyword_list.length > 200) {
    message.warning('仅支持200行文本识别！');
    keyword_list.length = 200;
  }
  const result = await request.post<BaseDataIssuerInstMulSearch.Response>(APIs.baseData.issuerInstMulSearch, {
    keyword_list
  });

  return result.issuer_info_list ?? [];
};

export const IssuerModal = ({ className, disabled, value, onFilter, updateIssueInfoFilterValue }: IssuerModalProps) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const onConfirm = (val: { allItems: InstInfo[]; checkedItems: InstInfo[] }) => {
    const list = val.checkedItems;

    const issuer_id_list = uniqueArr(value?.issuer_id_list?.concat(list.map(item => item.inst_code)) ?? []);
    const issuer_list = uniqueArr(
      value?.issuer_list?.concat(list.map(item => ({ value: item.inst_code, label: item.full_name_zh }))) ?? []
    );

    updateIssueInfoFilterValue({ issuer_id_list, issuer_list });
  };

  // --- start 以下这段代码主要用于之前一个文件上传的逻辑，目前不需要了，怕后续又加回来，先注释掉 ---
  // https://shihetech.feishu.cn/wiki/RtvGwweDPi4YvTkhbPRcsYQRnOc?chunked=false#part-GujddRp04omqBQxEYqTc5htAnqb

  // const [windowDisabled] = useWindowDisabledState();

  // // 进不同div的时候会反复触发，简单节流+判断visible处理
  // const handleDragEnter = useMemo(() => {
  //   return throttle((e: DragEvent) => {
  //     e.preventDefault(); // 防止在windows下拖动会产生鼠标变成禁止图标的样式

  //     // disable时或已打开时不触发
  //     if (visible || disabled || windowDisabled) {
  //       return;
  //     }

  //     // 只处理activePanelId 台子的窗子
  //     // if (activePanelId && panelId && panelId !== activePanelId) {
  //     //   return;
  //     // }

  //     // 若已有modal则不触发
  //     const antModalWarp = document.querySelector('.ant-modal-wrap');
  //     if (antModalWarp != null && getComputedStyle(antModalWarp).display === 'block') {
  //       return;
  //     }

  //     const { items } = e.dataTransfer ?? {};
  //     const item = items?.[0];
  //     // 第一个文件是txt文件才唤起
  //     if (item?.kind === 'file' && item?.type === 'text/plain') {
  //       setVisible(true);
  //     }
  //   }, 1000);
  // }, [visible, disabled, windowDisabled]);

  // const handleDrop = useMemo(() => {
  //   return async (e: DragEvent) => {
  //     e.preventDefault(); // 防止浏览器默认打开文件操作
  //     if (e.type === 'drop') {
  //       const { files = [] } = e.dataTransfer ?? {};
  //       for await (const file of files) {
  //         const str = await parseTxtFile(file);
  //         setText(str);
  //       }
  //     }
  //   };
  // }, []);

  // useEventListener('dragenter', handleDragEnter);
  // useEventListener('drop', handleDrop);

  // --- end 以下这段代码主要用于之前一个文件上传的逻辑，目前不需要了，怕后续又加回来，先注释掉 ---

  return (
    <>
      <Button.Icon
        className={className}
        tooltip={{ content: '识别发行人' }}
        disabled={disabled}
        icon={<IconScan />}
        onClick={() => setVisible(true)}
      />

      {!disabled && (
        <ParsingModal<InstInfo>
          title="发行人识别"
          visible={visible}
          onFilter={onFilter}
          width={420 + 1}
          onParse={handleParse}
          getItemID={i => i.inst_id}
          getItemName={i => i.full_name_zh}
          onConfirm={onConfirm}
          keyboard
          onClose={() => {
            setVisible(false);
          }}
          placeholder="输入或复制黏贴文本"
          value={text}
          onChange={setText}
        />
      )}
    </>
  );
};
