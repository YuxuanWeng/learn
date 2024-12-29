import { useMemo } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Input } from '@fepkg/components/Input';
import { FloatProvider, useFloat } from '@fepkg/components/Search/FloatProvider';
import { IconSearch } from '@fepkg/icon-park-react';
import { useGlobalSearchKey } from '@/pages/ProductPanel/atoms/global-search';
import { FloatOptions } from './FloatOptions';
import { InputProvider, useInput } from './InputProvider';
import { SearchPropsProvider, useSearchProps } from './SearchPropsProvider';
import { GlobalSearchProps } from './types';
import { useHotkey } from './useHotkey';

const Inner = () => {
  const { floating, interactions } = useFloat();
  const { className, inputRef: outerInputRef, placeholder } = useSearchProps();
  const {
    inputRef,
    searchValue,
    inputValue,
    setInputValue,
    handleChange,
    handleInputChange,
    handleClear,
    ...restInputState
  } = useInput();
  const { searchRef } = useHotkey(setInputValue);

  const mergedRef = useMemo(
    () => mergeRefs([searchRef, inputRef, outerInputRef ?? null]),
    [searchRef, inputRef, outerInputRef]
  );

  return (
    <div {...interactions.getReferenceProps({ ref: floating.refs.setReference, className })}>
      <Input
        ref={mergedRef}
        placeholder={placeholder || '代码/拼音/简称'}
        suffixIcon={<IconSearch />}
        value={inputValue}
        onChange={handleInputChange}
        {...restInputState}
      />

      <FloatOptions />
    </div>
  );
};

export const GlobalSearch = (props: GlobalSearchProps) => {
  const key = useGlobalSearchKey();

  return (
    <FloatProvider
      key={key}
      initialState={{ placement: 'bottom-end' }}
    >
      <SearchPropsProvider initialState={{ ...props }}>
        <InputProvider>
          <Inner />
        </InputProvider>
      </SearchPropsProvider>
    </FloatProvider>
  );
};
