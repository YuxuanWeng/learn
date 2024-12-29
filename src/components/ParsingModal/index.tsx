import { useEffect, useRef, useState } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import { Button } from '@fepkg/components/Button';
import { Checkbox } from '@fepkg/components/Checkbox';
import { InputChangeEvent, TextArea } from '@fepkg/components/Input';
import { message } from '@fepkg/components/Message';
import { ModalProps } from '@fepkg/components/Modal';
import { Placeholder } from '@fepkg/components/Placeholder';
import { Modal } from '../Modal';

/** 单行行高 */
const LINE_HEIGHT = 22;
/** 限制行数 */
const LIMIT_ROWS = 200;
/** 限制高度 = 单行行高 * 限制行数 */
const LIMIT_HEIGHT = LINE_HEIGHT * LIMIT_ROWS;
const OPTION_CLS = 'h-8 text-gray-000 px-3 justify-start hover:bg-gray-500 rounded-lg';

export type ParsingModalProps<T> = Omit<ModalProps, 'onConfirm'> & {
  parseButtonText?: string;
  clearButtonText?: string;
  placeholder?: string;
  onFilter?: (value: T[]) => T[];
  // 输入textArea的文本，输出识别列表
  onParse: (str: string) => Promise<T[]>;
  onConfirm: (props: { allItems: T[]; checkedItems: T[] }) => void;
  getItemID: (item: T) => string;
  getItemName: (item: T) => string;
  waitForConfirm?: boolean;
  clearSelectionOnClear?: boolean;
  value?: string;
  onChange?: ((val: string) => void) | undefined;
  defaultValue?: string;
};

export function ParsingModal<T>({
  title = '主体识别',
  parseButtonText = '开始识别',
  clearButtonText = '清空',
  onParse,
  onConfirm,
  getItemID,
  getItemName,
  onFilter,
  waitForConfirm = true,
  visible,
  footerProps,
  onClose,
  width = 360,
  placeholder,
  clearSelectionOnClear = false,
  keyboard,
  value,
  onChange,
  defaultValue
}: ParsingModalProps<T> & { onClose: VoidFunction }) {
  const [loading, setLoading] = useState(false);
  const [parsedList, setParsedList] = useState<T[]>([]);
  const [checkedList, setCheckedList] = useState<T[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const [error, setError] = useState(false);
  const toasted = useRef(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [inputValue, setInputValue] = usePropsValue<string>({
    defaultValue: defaultValue ?? '',
    value,
    onChange
  });

  const btnDisabled = !inputValue.trim();

  useEffect(() => {
    setListOpen(false);
    setCheckedList([]);
    setParsedList([]);
    setInputValue('');
    setIsConfirmLoading(false);
    setError(false);
    toasted.current = false;
  }, [visible]);

  const handleChange = (val: string, evt: InputChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(val);

    const target = evt.currentTarget;
    // 如果高度超过了行高
    if (target.scrollHeight > LIMIT_HEIGHT) {
      setError(true);

      // 如果没有 toast 过，需要 toast
      if (!toasted.current) {
        message.warning('仅支持200行文本识别！');
        toasted.current = true;
      }
    } else {
      setError(false);
      toasted.current = false;
    }
  };

  const handleParse = async () => {
    if (error) return;

    setLoading(true);

    try {
      const result = await onParse(inputValue);
      setListOpen(true);
      const parseResult = onFilter?.(result) ?? result;
      setParsedList(parseResult);
      setCheckedList([...parseResult]);
      setInputValue('');
    } finally {
      setError(false);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setError(false);

    if (clearSelectionOnClear) {
      setCheckedList([]);
      setParsedList([]);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      title={title}
      width={width}
      visible={visible}
      onConfirm={() => {
        if (waitForConfirm) {
          setIsConfirmLoading(true);
          try {
            onConfirm?.({
              allItems: parsedList,
              checkedItems: checkedList
            });

            onClose();
          } finally {
            setIsConfirmLoading(false);
          }
        } else {
          onConfirm?.({
            allItems: parsedList,
            checkedItems: checkedList
          });
          onClose();
        }
      }}
      keyboard={keyboard}
      onCancel={onClose}
      footer={listOpen ? undefined : null}
      footerProps={{
        confirmBtnProps: {
          loading: isConfirmLoading,
          disabled: checkedList.length < 1,
          ...footerProps?.confirmBtnProps
        },
        centered: true,
        ...footerProps
      }}
    >
      <div className="p-3">
        <TextArea
          className="bg-gray-800"
          autoFocus
          composition
          rows={4}
          error={error}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          onEnterPress={(_, evt, composing) => {
            // 如果按下 shift 键，仅换行，不进行其他操作
            if (evt.shiftKey) return;

            // 如果不是同时按下 shift 键，阻止默认事件
            evt.preventDefault();
            // 如果不是正在输入中文，进行识别
            if (!composing) handleParse();
          }}
        />

        <div className="flex justify-end gap-3 mt-2">
          <Button
            className="w-22"
            type="gray"
            ghost
            disabled={btnDisabled}
            onClick={handleClear}
          >
            {clearButtonText}
          </Button>

          <Button
            className="w-22 px-0"
            ghost
            loading={loading}
            disabled={btnDisabled || error}
            onClick={handleParse}
          >
            {parseButtonText}
          </Button>
        </div>

        <div className={listOpen ? '' : 'hidden'}>
          <div className="flex text-xs text-gray-300 mt-4">
            <div className="flex items-center gap-1">
              识别结果
              <span className="font-bold text-sm text-primary-100">{parsedList.length}</span>条
            </div>

            <div className="flex items-center gap-1 ml-4">
              已选<span className="font-bold text-sm text-gray-000">{checkedList.length}</span>条
            </div>
          </div>

          <div className="component-dashed-x-600 h-px my-2" />

          <div className="h-[272px] w-full overflow-y-overlay">
            {parsedList.length === 0 ? (
              <div className="h-[100%] flex justify-center items-center">
                <Placeholder
                  size="md"
                  type="no-search-result"
                  label="无识别结果"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Checkbox
                  className={OPTION_CLS}
                  indeterminate={checkedList.length !== 0 && parsedList.length !== checkedList.length}
                  checked={parsedList.length === checkedList.length}
                  onChange={() => {
                    if (checkedList.length === parsedList.length) {
                      setCheckedList([]);
                    } else {
                      setCheckedList([...parsedList]);
                    }
                  }}
                >
                  全部
                </Checkbox>
                {/* <ParsingList
                getItemID={getItemID as any}
                getItemName={getItemName as any}
                parsedList={parsedList}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
              /> */}

                {parsedList.map(i => {
                  const checked = checkedList.some(c => getItemID(c) === getItemID(i));
                  return (
                    <Checkbox
                      className={OPTION_CLS}
                      key={getItemID(i)}
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setCheckedList(checkedList.filter(cur => getItemID(cur) !== getItemID(i)));
                        } else {
                          setCheckedList([...checkedList, i]);
                        }
                      }}
                    >
                      <span title={getItemName(i)}>{getItemName(i)}</span>
                    </Checkbox>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
