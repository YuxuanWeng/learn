import { createContext, useContext, useMemo } from 'react';
import { usePropsValue } from '@fepkg/common/hooks';
import { useFloat } from '@fepkg/components/Search/FloatProvider';
import { useMemoizedFn } from 'ahooks';
import { CascaderOption, CascaderV2Props, CascaderValue } from './types';
import { formatCascader, getFlatOptions, onCheckedResult } from './utils';

// 当 input value 没有值时，展示已选项，反之展示输入的内容
// 失焦时清空 input value（但要小心再次点击 label 时的重新聚焦，此时会有 聚焦 -> 失焦 -> 聚焦 的过程，此时不许要清空）
// 退格不会取消选中，仅会改变 input value
// 当传入 defaultOptions 且为 search 模式时，如果 input value 没有，就展示 的 defaultOptions

export const useCascaderProvider = ({
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
}: CascaderV2Props) => {
  const { disabled, showOptions = true } = restProps;

  const { open } = useFloat();

  const [innerValue, setInnerValue] = usePropsValue<CascaderValue>({
    defaultValue: defaultValue ?? null,
    value
  });
  const [inputValue, setInputValue] = usePropsValue({
    defaultValue: '',
    value: outerInputValue,
    onChange: onInputChange
  });

  const clear = useMemoizedFn(() => {
    setInnerValue(null);

    let res: CascaderValue = null;
    if (Array.isArray(innerValue)) res = [];

    onChange?.(res, undefined, false, []);
  });

  const display = useMemo(() => {
    const goodOptions = (options ?? [])
      .map(item =>
        formatCascader({
          option: item,
          keyword: inputValue.trim(),
          values: Array.isArray(innerValue) ? innerValue : []
        })
      )
      .filter(Boolean);

    const res = {
      options: goodOptions,
      selected: [] as CascaderOption[],
      value: '',
      flatOption: [] as CascaderOption[]
    };

    const isArrayValue = Array.isArray(innerValue);

    if (optionFilter && inputValue) {
      const filterFn = (opt: CascaderOption) => {
        if (typeof optionFilter === 'function') return optionFilter(opt, inputValue);

        return opt?.label?.includes(inputValue);
      };
      res.options = res.options.filter(filterFn);
    }

    // value是null就返回默认的
    if (!isArrayValue) {
      return res;
    }

    res.flatOption = res.options.flatMap(getFlatOptions) ?? [];
    res.selected = res.flatOption.filter(i => innerValue.includes(i.value));
    res.value = res.selected.map(item => item.label).join(' , ');

    return res;
  }, [inputValue, innerValue, optionFilter, options]);

  /** 点击选项 */
  const change = useMemoizedFn((checked: boolean, opt: CascaderOption) => {
    let newVal: CascaderValue = [opt.value];
    let newSelectedOpts = [opt];

    // const optCache = getOptionCache({ options, selectedOptions });

    // 清空新的已选项
    newSelectedOpts = [];

    // 如果过滤后的选项与现有选项长度相等，说明需要新增选项
    if (checked) {
      newVal = [...(innerValue ?? []), opt.value] as CascaderValue;
    } else {
      // 否则直接使用过滤后的选项即可
      newVal = innerValue?.filter((item => item !== opt.value) as BooleanConstructor) ?? [];
    }

    // for (const val of newVal) {
    //   const item = optCache.get(val);
    //   if (item) newSelectedOpts.push(item);
    // }

    const { resultValues, resultOptions } = onCheckedResult({
      emitTopData: !inputValue,
      flatOptions: display.flatOption,
      // values: display.selected.map(i => i.value),
      values: innerValue as string[],
      checked,
      option: opt
    });
    setInnerValue(resultValues);

    // onChange?.(newVal, opt, selected, newSelectedOpts);
    // onChange?.(newVal, newSelectedOpts, checked, resultOptions);
    onChange?.(resultValues, resultOptions);
  });

  /** 全选 */
  const handleCheckAll = useMemoizedFn((val: boolean) => {
    const emitTopData = !inputValue;
    if (val) {
      if (emitTopData) {
        onChange?.(
          display.options.map(o => o.value),
          display.options
        );
        setInnerValue(display.options.map(o => o.value));
        return;
      }
      onChange?.(
        display.flatOption.map(o => o.value),
        display.flatOption
      );
      setInnerValue(display.flatOption.map(o => o.value));
    }
    onChange?.([], []);
    setInnerValue([]);
  });

  const visible = Boolean(!disabled && open && showOptions);

  return useMemo(
    () => ({
      ...restProps,
      display,
      visible,
      inputValue,
      setInputValue,
      innerValue,
      setInnerValue,
      change,
      handleCheckAll,
      clear
    }),
    [change, clear, display, innerValue, inputValue, handleCheckAll, restProps, setInnerValue, setInputValue, visible]
  );
};

type CascaderContextType = ReturnType<typeof useCascaderProvider> | null;

const CascaderContext = createContext<CascaderContextType>(null);

export const CascaderProvider = ({ children, ...props }: CascaderV2Props) => {
  const value = useCascaderProvider(props);
  return <CascaderContext.Provider value={value}>{children}</CascaderContext.Provider>;
};

export const useCascader = () => {
  const context = useContext<CascaderContextType>(CascaderContext);

  if (!context) throw new Error('No value provided for select context');
  return context;
};
