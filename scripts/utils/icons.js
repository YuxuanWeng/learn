const path = require('path');
const plugin = require('tailwindcss/plugin');
const walk = require('klaw-sync');
const sizeOf = require('image-size');

function IconsReader(dir = '/assets/icons/') {
  this.iconsDir = dir;
  Object.defineProperty(this, 'walk', {
    enumerable: false,
    configurable: false,
    writable: true,
    value: walk
  });
  Object.defineProperty(this, 'sizeOf', {
    enumerable: false,
    configurable: false,
    writable: true,
    value: sizeOf
  });
}
IconsReader.prototype = {
  constructor: IconsReader,
  setEnv(env = {}) {
    if (env.walk) this.walk = env.walk;
    if (env.sizeOf) this.sizeOf = env.sizeOf;
  },
  _readIcons() {
    return this.walk(path.resolve(__dirname, `../../src${this.iconsDir}`), {
      traverseAll: false,
      nodir: true
    })
      .filter(p => /\.(png|jpe?g|gif|svg)$/i.test(p.path))
      .map(file => {
        const p = file.path;
        const { name } = path.parse(p);
        const ext = path.extname(p);
        let width = 0,
          height = 0;
        try {
          const s = this.sizeOf(p);
          width = s.width;
          height = s.height;
        } catch (ex) {
          console.error(ex, p);
        }
        return {
          name,
          ext,
          width,
          height
        };
      });
  },
  // v1
  getIcons() {
    return this._readIcons().map(({ name, ext, width, height }) => ({
      [`.icon-${name.replace(/\s+/g, '-')}`]: {
        display: 'inline-block',
        maskImage: `url('@${this.iconsDir}${name}${ext}')`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'var(--color-white)',
        maskSize: 'contain',
        maskPosition: '0 0',
        maskRepeat: 'no-repeat'
      }
    }));
  },
  // v2
  getBgIcons() {
    return this._readIcons().map(({ name, ext, width, height }) => ({
      [`.bgicon-${name.replace(/\s+/g, '-')}`]: {
        '--w': `${width}px`,
        '--h': `${height}px`,
        '--color': `var(--color-white)`,
        '--hover-color': `var(--color-white)`,
        '--bg': 'transparent',
        display: 'inline-flex',
        justifyContent: 'flex-start',
        width: 'var(--w)',
        height: 'var(--h)',
        background: 'var(--bg)',

        '&::after': {
          display: 'inline-block',
          content: "''",
          width: 'var(--w)',
          height: 'var(--h)',
          backgroundColor: 'var(--color)',
          maskImage: `url('@${this.iconsDir}${name}${ext}')`,
          maskSize: 'contain',
          maskPosition: '0 0',
          maskRepeat: 'no-repeat'
        },

        '&:hover::after': {
          backgroundColor: 'var(--hover-color)'
        }
      }
    }));
  },
  getBgIconsStr() {
    return this.getBgIcons()
      .map(obj => {
        const keys = Object.keys(obj);
        const name = keys.filter(k => /^\.bgicon-/.test(k))[0];
        return `${name} ${obj[name]}`;
      })
      .join('\n');
  },
  getNames() {
    return [...this.getIcons(), ...this.getBgIcons()].map(obj => {
      const keys = Object.keys(obj);
      const name = keys.filter(k => /^\.(bg)?icon-/.test(k))[0];
      return name;
    });
  },
  /* c8 ignore start */
  getTWPlugin() {
    return plugin(({ addComponents }) => {
      addComponents(this.getIcons());
      addComponents(this.getBgIcons());
    });
  }
  /* c8 ignore stop */
};

module.exports = new IconsReader();
