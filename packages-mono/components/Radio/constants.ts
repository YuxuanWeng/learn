import { RadioButtonType } from './types';

type RadioThemeCls = {
  [k in 'wrapper' | 'container' | 'indicator']: {
    [s in 'disabled' | 'default']: {
      checked: string;
      unchecked: string;
    };
  };
};

type RadioButtonThemeCls = {
  [s in 'disabled' | 'default']: {
    checked: string;
    unchecked: string;
  };
};

export const radioThemeCls: RadioThemeCls = {
  wrapper: {
    disabled: { checked: 'text-gray-300', unchecked: 'text-gray-300' },
    default: { checked: 'text-gray-100', unchecked: 'text-gray-200' }
  },
  container: {
    disabled: { checked: 'bg-primary-400 border-primary-400', unchecked: 'border-gray-300' },
    default: {
      checked: 'bg-primary-100 border-primary-100 group-hover/checkbox:bg-primary-000',
      unchecked: 'border-gray-200'
    }
  },
  indicator: {
    disabled: { checked: 'bg-gray-700', unchecked: '' },
    default: { checked: 'bg-gray-700', unchecked: '' }
  }
};

export const radioBtnThemeClsMap: Record<RadioButtonType, RadioButtonThemeCls> = {
  ghost: {
    disabled: {
      checked: 'text-primary-400',
      unchecked: 'text-gray-300 border-transparent'
    },
    default: {
      checked: 'text-primary-100',
      unchecked: 'text-gray-200 border-transparent'
    }
  },
  secondary: {
    disabled: {
      checked: 'text-secondary-400 bg-secondary-700 border-secondary-700',
      unchecked: 'text-gray-300 border-transparent'
    },
    default: {
      checked: 'text-secondary-100 bg-secondary-600 border-secondary-600',
      unchecked: 'text-gray-200 border-transparent'
    }
  },
  orange: {
    disabled: {
      checked: 'text-orange-400 bg-orange-700 border-orange-700',
      unchecked: 'text-gray-300 border-transparent'
    },
    default: {
      checked: 'text-orange-100 bg-orange-600 border-orange-600',
      unchecked: 'text-gray-200 border-transparent'
    }
  }
};
