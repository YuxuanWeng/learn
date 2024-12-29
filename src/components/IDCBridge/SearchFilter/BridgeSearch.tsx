import { HTMLProps, KeyboardEvent, MutableRefObject, RefObject, forwardRef, useEffect, useState } from 'react';
import cx from 'classnames';
import { CP_NONE, getCP } from '@fepkg/business/utils/get-name';
import { HighlightOption } from '@fepkg/components/BaseOptionsRender/HighlightOption';
import { Search, SearchOption } from '@fepkg/components/Search';
import { IconPrecise } from '@fepkg/icon-park-react';
import { BridgeInstInfo } from '@fepkg/services/types/common';
import { useProductParams } from '@/layouts/Home/hooks';
import useBridgeSearch from '@/pages/Deal/Bridge/hooks/useBridgeSearch';

interface IProps {
  onEnterPress?: (evt: KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (inst: BridgeInstInfo | undefined) => void;
  invalidBridgeIdList?: string[];
  placeholder?: string;
  openShowOptions?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onKeyDown?: (evt: KeyboardEvent<HTMLInputElement>) => void;
}

type IDom = Omit<HTMLProps<HTMLDivElement>, keyof IProps>;

const BridgeSearch = forwardRef<HTMLInputElement, IProps & IDom>(
  (
    {
      selected,
      onSelect,
      onEnterPress,
      disabled,
      placeholder = '桥机构',
      openShowOptions = false,
      inputRef,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const { kwd, setKwd, options } = useBridgeSearch({ disabledWhenEmpty: true });
    const [isFocused, setIsFocused] = useState(false);
    const [itemValue, setItemValue] = useState<SearchOption<BridgeInstInfo> | null>(null);

    const { productType } = useProductParams();

    const handleChange = (opt?: SearchOption<BridgeInstInfo> | null) => {
      if (opt != null) {
        onSelect(opt?.original);
      }
      // 桥列表定位选中后立即清空输入框
      setItemValue(null);
      setKwd('');
    };

    const [showOptions, setShowOptions] = useState(openShowOptions);
    useEffect(() => {
      if (showOptions && kwd === '' && isFocused) {
        (ref as MutableRefObject<HTMLInputElement | null>)?.current?.click();
      }
    }, [isFocused, kwd, ref, showOptions]);

    return (
      <div {...rest}>
        <Search<BridgeInstInfo>
          ref={ref}
          className={cx('w-full', rest.className)}
          limitWidth
          dropdownCls="!max-h-[160px] whitespace-nowrap overflow-x-hidden"
          placeholder={placeholder}
          disabled={disabled}
          suffixIcon={<IconPrecise />}
          options={kwd ? options : []}
          value={itemValue}
          inputValue={kwd}
          onInputChange={val => {
            setKwd(val);
            if (!showOptions) {
              setShowOptions(true);
            }
          }}
          onChange={handleChange}
          showOptions
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          changeByTab={false}
          onKeyDown={onKeyDown}
          optionRender={(original, keyword) => (
            <HighlightOption
              keyword={keyword}
              label={getCP({
                inst: original.contact_inst,
                productType,
                trader: original.contact_trader,
                placeholder: CP_NONE
              })}
            />
          )}
        />
      </div>
    );
  }
);
export default BridgeSearch;
