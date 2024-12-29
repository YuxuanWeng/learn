type ThemeCls = {
  [k in 'container' | 'indicator']: {
    [s in 'disabled' | 'default']: {
      checked: string;
      unchecked: string;
    };
  };
};

export const themeCls: ThemeCls = {
  container: {
    disabled: { checked: 'bg-primary-400', unchecked: 'bg-gray-500' },
    default: {
      checked: 'bg-primary-100 hover:bg-primary-000',
      unchecked: 'bg-gray-300 hover:bg-gray-200'
    }
  },
  indicator: {
    disabled: { checked: 'bg-gray-700', unchecked: 'bg-gray-300' },
    default: { checked: 'bg-gray-700', unchecked: 'bg-gray-100' }
  }
};
