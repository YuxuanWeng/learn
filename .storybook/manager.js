import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    default: true,
    appBg: '#3D464E',
    textColor: '#fff',
    barTextColor: 'rgba(255,255,255,0.8)',
    barSelectedColor: '#fff',
    barBg: '#3D464E',
    brandTitle: 'OMS frontend'
  })
});
