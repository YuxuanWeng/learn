import { createContext, useContext, useMemo } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import { useMemoizedFn } from 'ahooks';
import { uniqBy } from 'lodash-es';
import { useFloat } from '../Search/FloatProvider';
import { SelectOption, SelectProps, SelectValue } from './types';

/** 获取合并后 options 的 cache */
const getOptionCache = ({ search, options, selectedOptions }: SelectProps) => {
  let mergedOpts = options ?? [];

  // 如果是搜索模式，并且有已选项提供，需要合并选项
  if (search && selectedOptions?.length) mergedOpts = uniqBy([...mergedOpts, ...selectedOptions], 'value');

  const optCache = new Map<SelectValue, SelectOption>();
  for (const item of mergedOpts) {
    optCache.set(item.value, item);
  }

  return optCache;
};

// 当 input value 没有值时，展示已选项，反之展示输入的内容
// 失焦时清空 input value（但要小心再次点击 label 时的重新聚焦，此时会有 聚焦 -> 失焦 -> 聚焦 的过程，此时不许要清空）
// 退格不会取消选中，仅会改变 input value
// 当传入 defaultOptions 且为 search 模式时，如果 input value 没有，就展示 的 defaultOptions

export const useSelectProvider = ({
  selectedOptions,
  options,
  optionFilter = true,
  defaultValue,
  inputValue: outerInputValue,
  value,
  onInputChange,
  onChange,
  children,
  ...restProps
}: SelectProps) => {
  const { multiple, tags = multiple, search, disabled, showOptions = true } = restProps;

  const { open } = useFloat();

  const [innerValue, setInnerValue] = usePropsValue<SelectValue>({
    defaultValue: defaultValue ?? null,
    value
  });
  const [inputValue, setInputValue] = usePropsValue({
    defaultValue: '',
    value: outerInputValue,
    onChange: onInputChange
  });

  const change = useMemoizedFn((opt: SelectOption) => {
    // 如果不是多选的，需要清空 input value
    if (!multiple) setInputValue('');

    let newVal: SelectValue = opt.value;
    let selected = true;
    let newSelectedOpts = [opt];

    const optCache = getOptionCache({ search, options, selectedOptions });

    if (multiple) {
      // 清空新的已选项
      newSelectedOpts = [];

      if (Array.isArray(innerValue)) {
        const filtered = innerValue.filter((item => item !== opt.value) as BooleanConstructor);

        // 如果过滤后的选项与现有选项长度相等，说明需要新增选项
        if (filtered.length === innerValue.length) {
          newVal = [...innerValue, opt.value] as SelectValue;
          selected = true;
        } else {
          // 否则直接使用过滤后的选项即可
          newVal = filtered;
          // 说明取消选中
          selected = false;
        }

        if (Array.isArray(newVal)) {
          for (const val of newVal) {
            const item = optCache.get(val);
            if (item) newSelectedOpts.push(item);
          }
        }
      } else {
        newVal = [opt.value] as SelectValue;
      }
    }

    setInnerValue(newVal);
    onChange?.(newVal, opt, selected, newSelectedOpts);
  });

  const clear = useMemoizedFn(() => {
    setInnerValue(null);

    let res: SelectValue = null;
    if (multiple || Array.isArray(innerValue)) res = [];

    onChange?.(res, undefined, false, []);
  });

  const display = useMemo(() => {
    const res = {
      options: options ?? [],
      selected: [] as SelectOption[],
      value: ''
    };

    const isArrayValue = Array.isArray(innerValue);

    const optCache = getOptionCache({ search, options, selectedOptions });

    // 如果为 search 模式，并且开启 optionFilter 且 input value 有值
    if (search && optionFilter && inputValue) {
      const filterFn = (opt: SelectOption) => {
        if (typeof optionFilter === 'function') return optionFilter(opt, inputValue);

        return opt?.label?.includes(inputValue);
      };

      res.options = res.options.filter(filterFn);
    }

    if (multiple) {
      if (!isArrayValue) return res;

      for (const val of innerValue) {
        const opt = optCache.get(val);
        if (opt) res.selected.push(opt);
      }

      res.value = res.selected.map(item => item.label).join(' , ');
    } else if (!isArrayValue) {
      // 不是多选模式且值不为数组，说明为单选
      const opt = optCache.get(innerValue);
      if (opt) {
        res.selected.push(opt);
        res.value = opt.label;
      }
    }

    return res;
  }, [inputValue, innerValue, multiple, optionFilter, options, search, selectedOptions]);

  const visible = Boolean(!disabled && open && showOptions);

  return useMemo(
    () => ({
      ...restProps,
      tags,
      display,
      visible,
      inputValue,
      setInputValue,
      innerValue,
      setInnerValue,
      change,
      clear
    }),
    [change, clear, display, innerValue, inputValue, restProps, setInnerValue, setInputValue, tags, visible]
  );
};

type SelectContextType = ReturnType<typeof useSelectProvider> | null;

const SelectContext = createContext<SelectContextType>(null);

export const SelectProvider = ({ children, ...props }: SelectProps) => {
  const value = useSelectProvider(props);
  return <SelectContext.Provider value={value}>{children}</SelectContext.Provider>;
};

export const useSelect = () => {
  const context = useContext<SelectContextType>(SelectContext);

  if (!context) throw new Error('No value provided for select context');
  return context;
};
