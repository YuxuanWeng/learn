import { describe, expect, it, vi } from 'vitest';
import { data2vars } from './tailwind.vars';

const fakeData = `
@tailwind utilities;

/* define colors */
@layer base {
  :root {
    --hello: no-wrap;
    --color-white: #ffffff;
    --color-primary-body: #232e37;
--color-primary-700: rgba(255, 255, 255, 0.8);
    --color-trd-500: #3c4055;
    --foo-bar-123: 12px;
  }
}
.draggable {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

`;

const fakeValids = { hello: 'hello', color: 'colorsss' };

describe('test tailwind vars', () => {
  it('默认渲染', () => {
    expect(data2vars(fakeData, fakeValids)).toEqual({
      hello: 'no-wrap',
      colorsss: {
        white: '#ffffff',
        primary: {
          body: '#232e37',
          700: 'rgba(255, 255, 255, 0.8)'
        },
        trd: {
          500: '#3c4055'
        }
      }
    });
  });
});
