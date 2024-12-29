import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext, useMemo, useRef } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import { useMemoizedFn } from 'ahooks';
import { useFloat } from './FloatProvider';
import { SearchOption, SearchProps } from './types';

type SearchContextType =
  | (SearchProps & {
      visible: boolean;
      displayValue: string;
      inputValue: string;
      setInputValue: Dispatch<SetStateAction<string>>;
      innerValue: SearchOption | null;
      setInnerValue: Dispatch<SetStateAction<SearchOption | null>>;
      change: (opt: SearchOption | null) => void;
      displayValueChangedByInput: MutableRefObject<boolean>;
    })
  | null;

const SearchContext = createContext<SearchContextType>(null);

export const SearchProvider = ({
  theme = 'dark',
  defaultValue,
  inputValueRender = opt => opt?.label?.toString() ?? '',
  inputValue: outerInputValue,
  value,
  onInputChange,
  onChange,
  children,
  ...restProps
}: SearchProps) => {
  const { disabled, showOptions = true, options } = restProps;

  const { open } = useFloat();

  const [innerValue, setInnerValue] = usePropsValue({
    defaultValue: defaultValue ?? null,
    value,
    onChange
  });
  const [inputValue, setInputValue] = usePropsValue({
    defaultValue: inputValueRender(innerValue),
    value: outerInputValue || inputValueRender(innerValue),
    onChange: onInputChange
  });

  /** 输入框展示内容是否由 input 输入而改变 */
  const displayValueChangedByInput = useRef(false);

  const change = useMemoizedFn((opt: SearchOption | null) => {
    setInnerValue(opt);
    setInputValue(inputValueRender(opt));
    displayValueChangedByInput.current = false;
  });

  let displayValue = inputValue;
  if (innerValue) displayValue = inputValueRender(innerValue);
  else if (!displayValueChangedByInput.current) displayValue = '';

  const visible = Boolean(!disabled && open && showOptions && options && options?.length > 0);

  const context = useMemo(
    () => ({
      ...restProps,
      theme,
      visible,
      displayValue,
      inputValueRender,
      inputValue,
      setInputValue,
      innerValue,
      setInnerValue,
      change,
      displayValueChangedByInput
    }),
    [
      theme,
      visible,
      displayValue,
      innerValue,
      inputValue,
      inputValueRender,
      restProps,
      setInnerValue,
      setInputValue,
      change
    ]
  );

  return <SearchContext.Provider value={context}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext<SearchContextType>(SearchContext);

  if (!context) throw new Error('No value provided for search context');
  return context;
};
