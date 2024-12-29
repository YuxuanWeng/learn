type ThemeCls = {
  [k in 'container' | 'indicator']: {
    [s in 'disabled' | 'default']: {
      checked: string;
      unchecked: string;
      indeterminate: string;
    };
  };
};

export const themeCls: ThemeCls = {
  container: {
    disabled: { checked: 'text-gray-300', unchecked: 'text-gray-300', indeterminate: ' indeterminate text-gray-300' },
    default: { checked: 'text-gray-000', unchecked: 'text-gray-200', indeterminate: 'indeterminate text-gray-000' }
  },
  indicator: {
    disabled: {
      checked: 'bg-primary-400 border-primary-400',
      unchecked: 'bg-gray-600 border-gray-500',
      indeterminate: 'bg-primary-400 border-primary-400'
    },
    default: {
      checked:
        'bg-primary-100 border-primary-100 group-hover/checkbox:bg-primary-000 group-hover/checkbox:border-primary-000',
      unchecked: 'border-gray-200 group-hover/checkbox:border-primary-000',
      indeterminate:
        'bg-primary-100 border-primary-100 group-hover/checkbox:bg-primary-000 group-hover/checkbox:border-primary-000'
    }
  }
};
