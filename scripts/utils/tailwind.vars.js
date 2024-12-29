const fs = require('fs');
const path = require('path');

const ValidProps = {
  color: 'colors'
};
const VarRE = /^\s*\-{2}(.*?)(\-.*){0,}\:\s?(.*?)\;\s*$/i;

const _globarCss = path.resolve(__dirname, '../../src/assets/styles/global.less');

function _put(obj, suffix, value) {
  // if (!suffix) {
  //   obj = value;
  //   return;
  // }
  const subProps = suffix.replace(/^\-/, '').split('-');
  const first = subProps.shift();
  if (!subProps.length) {
    obj[first] = value;
    return;
  }
  if (!obj[first]) obj[first] = {};
  _put(obj[first], subProps.join('-'), value);
}

function data2vars(fileData, validPropsMap) {
  const lines = fileData.split(/\r?\n/);
  const varsLines = lines
    .filter(line => VarRE.test(line))
    .filter(line => {
      const [_, prop] = line.match(VarRE);
      return Object.keys(validPropsMap).some(p => prop === p);
    });
  const twObj = Object.create(null);
  varsLines.forEach(line => {
    const [_, prop, suffix, value] = line.match(VarRE);
    const vp = validPropsMap[prop];
    _put(twObj, suffix ? `${vp}-${suffix}` : vp, value);
  });
  return twObj;
}

/* c8 ignore start */
module.exports = {
  data2vars,
  getCssVars: () => {
    try {
      const data = fs.readFileSync(_globarCss, 'UTF-8');
      return data2vars(data, ValidProps);
    } catch (err) {
      console.error(err);
    }
  }
};
/* c8 ignore stop */
