import { FC, useRef, useState } from 'react';
import cx from 'classnames';
import { ContextMenu } from '@fepkg/components/ContextMenu';
import { Input } from '@fepkg/components/Input';
import { Placeholder } from '@fepkg/components/Placeholder';
import { IconSearch } from '@fepkg/icon-park-react';
import { BridgeInstInfo } from '@fepkg/services/types/common';
import { useChangeBridgeModalArrowSelect } from '@/components/IDCBridge/BridgeModal/useChangeBridgeModalArrowSelect';
import useBridgeSearch, { BridgeOption } from '@/pages/Deal/Bridge/hooks/useBridgeSearch';

type Props = {
  /** 桥机构变更的回调 */
  onChange: (val?: BridgeInstInfo) => void;
  /** 桥机构下拉选中需要排除的桥机构 */
  invalidBridgeIdList?: string[];
  /** 关闭窗口 */
  onCancel: () => void;
  /** 弹窗的相关位置信息 */
  position: [number, number];
  /**  弹窗开关 */
  visible?: boolean;
};

const BridgeModalInner: FC<Props> = ({ onChange, invalidBridgeIdList = [], onCancel, position, visible }) => {
  const containerRef = useRef(null);
  const isFocusingFinished = useRef(false);

  const [searchContent, setSearchContent] = useState<string | undefined>();
  const { setKwd, options, refetch } = useBridgeSearch({ invalidBridgeIdList });
  const onEnter = (bridgeOption: BridgeOption) => {
    onChange(bridgeOption.original);
    onCancel();
  };

  const { bridgeOption, setBridgeOption, handleKeyDown } = useChangeBridgeModalArrowSelect({
    optionList: options,
    onEnter
  });

  return (
    <ContextMenu
      className="bg-gray-700 !p-0"
      open
      position={{ x: position[0], y: position[1] }}
      onOpenChange={onCancel}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-[240px] h-[280px] rounded-lg drop-shadow-dropdown overflow-hidden bg-gray-700"
        ref={containerRef}
      >
        <div className="px-3 py-2">
          <Input
            ref={node => {
              if (node && !isFocusingFinished.current) {
                node.focus();
                isFocusingFinished.current = true;
              }
            }}
            className="!bg-gray-800 focus-within:!bg-primary-700"
            placeholder="搜索桥机构"
            value={searchContent || ''}
            padding={[3, 11]}
            suffixIcon={<IconSearch />}
            onChange={text => {
              // 清除非法字符
              let nowKwd = text;
              nowKwd = nowKwd.trim();
              nowKwd = nowKwd.replaceAll('\\', '');
              nowKwd = nowKwd.replaceAll("'", '');
              nowKwd = nowKwd.replaceAll(' ', '');
              setKwd(nowKwd);
              setSearchContent(text);
            }}
            onEnterPress={() => refetch()}
          />
        </div>

        <div
          className={cx('overflow-y-overlay overflow-x-hidden h-[calc(100%_-_46px)]')}
          onKeyDown={evt => {
            if (evt.code === 'Escape') {
              onCancel();
              evt.stopPropagation();
            }
          }}
        >
          {options?.length ? (
            options?.map(inst => {
              return (
                <div
                  key={inst.key}
                  className={cx(
                    'flex items-center h-9 px-3 mx-3 mt-1 hover:bg-gray-600 text-gray-100 hover:text-primary-000 rounded-lg',
                    bridgeOption?.key === inst.key ? 'bg-gray-600' : 'bg-gray-700'
                  )}
                  onClick={() => {
                    setBridgeOption(inst);
                    onChange(inst.original);
                    onCancel();
                  }}
                >
                  <div className="flex items-center cursor-pointer overflow-hidden">
                    <span className="truncate text-sm">{inst.label}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center h-full">
              <Placeholder
                className="-mt-5 !gap-0"
                type="no-search-result"
                label="没有搜索到桥机构"
              />
            </div>
          )}
        </div>
      </div>
    </ContextMenu>
  );
};

export const BridgeModal: FC<Props> = ({ visible, ...props }) => {
  return !visible ? null : <BridgeModalInner {...props} />;
};
