const plugin = require('tailwindcss/plugin');
const iconsReader = require('./scripts/utils/icons');
const { getCssVars } = require('./scripts/utils/tailwind.vars');
const components = require('./scripts/utils/tailwind.components');

module.exports = {
  content: [
    './src/*.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './packages-mono/components/**/*.{js,ts,jsx,tsx}',
    './packages-mono/business/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.8125rem', '1.375rem'],
      md: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.625rem'],
      xl: ['1.25rem', '2rem'],
      '2xl': ['1.5rem', '2.25rem']
    },
    extend: {
      zIndex: {
        modal: '1000', // 模态框
        dropdown: '1050', // 下拉
        floating: '1070', // 浮动框(右键菜单、tooltip、popconfirm)
        hightest: '999999' // 始终置顶-不建议
      },
      width: {
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        45: '11.25rem',
        50: '12.5rem',
        55: '13.75rem'
      },
      height: {
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        45: '11.25rem',
        50: '12.5rem',
        55: '13.75rem',
        'screen/2': '50vh',
        'screen/3': 'calc(100vh / 3)',
        'screen/4': 'calc(100vh / 4)',
        'screen/5': 'calc(100vh / 5)'
      },
      margin: {
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        45: '11.25rem',
        50: '12.5rem',
        55: '13.75rem'
      },
      padding: {
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        45: '11.25rem',
        50: '12.5rem',
        55: '13.75rem'
      },
      fontWeight: {
        heavy: 900
      },
      lineHeight: {
        0: '0rem',
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        25: '6.25rem',
        30: '7.5rem',
        45: '11.25rem',
        50: '12.5rem',
        55: '13.75rem'
      },
      dropShadow: {
        dropdown: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        system: '0px 8px 40px rgba(0, 0, 0, 0.5)',
        modal: '0px 8px 40px rgba(0, 0, 0, 0.8)'
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundSize: {
        'size-dashed': '1px 100%, 100% 1px, 1px 100%, 100% 1px'
      },
      backgroundPosition: {
        'position-dashed': '0 0, 0 0, 100% 0, 0 100%'
      },
      backgroundImage: {
        'system-status-bar': "url('/assets/image/bg-system-status-bar.svg')",
        'dashed-gray-500': `
        repeating-linear-gradient(-60deg, var(--color-gray-500), var(--color-gray-500) 2px,
          transparent 2px, transparent 5px, var(--color-gray-500) 5px),
        repeating-linear-gradient(30deg, var(--color-gray-500), var(--color-gray-500) 2px,
          transparent 2px, transparent 5px, var(--color-gray-500) 5px),
        repeating-linear-gradient(120deg, var(--color-gray-500), var(--color-gray-500) 2px,
          transparent 2px, transparent 5px, var(--color-gray-500) 5px),
        repeating-linear-gradient(210deg, var(--color-gray-500), var(--color-gray-500) 2px,
          transparent 2px, transparent 5px, var(--color-gray-500) 5px)`,

        'dashed-primary-000': `
        repeating-linear-gradient(-60deg, var(--color-primary-000), var(--color-primary-000) 2px,
          transparent 2px, transparent 5px, var(--color-primary-000) 5px),
        repeating-linear-gradient(30deg, var(--color-primary-000), var(--color-primary-000) 2px,
          transparent 2px, transparent 5px, var(--color-primary-000) 5px),
        repeating-linear-gradient(120deg, var(--color-primary-000), var(--color-primary-000) 2px,
          transparent 2px, transparent 5px, var(--color-primary-000) 5px),
        repeating-linear-gradient(210deg, var(--color-primary-000), var(--color-primary-000) 2px,
          transparent 2px, transparent 5px, var(--color-primary-000) 5px)`
      },
      opacity: {
        4: '.04',
        6: '.06',
        24: '.24',
        45: '.45'
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        margin: 'margin',
        padding: 'padding'
      },
      aria: {
        invalid: 'invalid="true"'
      },
      keyframes: {
        progressbar: {
          '0%': { backgroundPosition: '200%' },
          '50%': { backgroundPosition: '100%' },
          '100%': { backgroundPosition: '0%' }
        }
      },
      animation: {
        process: 'progressbar 2s linear infinite'
      },
      ...getCssVars()
    }
  },
  variants: {
    extend: {}
  },
  corePlugins: {
    preflight: false
  },
  plugins: [
    require('tailwind-children'),
    iconsReader.getTWPlugin(),
    plugin(function ({ addComponents, addVariant }) {
      addComponents({
        ...components
      });
      addVariant('child', '& > *');
      // 为通用组件提供优先级更低的样式
      addVariant('def', ':where(&)');
    })
  ],
  safelist: [...iconsReader.getNames()]
};
