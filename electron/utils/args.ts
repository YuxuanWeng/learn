import assert from 'assert';
import path from 'path';
import url from 'url';
import { isMac } from './utools';

function encode(args: unknown) {
  args = args || null;
  assert.strictEqual(typeof args, 'object', 'args must be an object');
  args = args ? encodeURIComponent(JSON.stringify(args)) : '';
  return args;
}

function urlWithArgs(urlOrFile: string, args: any) {
  args = encode(args);

  let u: string;
  if (urlOrFile.startsWith('http') || urlOrFile.startsWith('data')) {
    const urlData = url.parse(urlOrFile);
    const hash = urlData.hash || args ? args : undefined;
    u = url.format(Object.assign(urlData, { hash }));
  } else {
    u = url.format({
      protocol: 'file',
      pathname: path.resolve(urlOrFile),
      slashes: true,
      hash: args || undefined
    });
  }

  return u;
}

export const getOnTopLevel = () => {
  if (isMac) {
    return 'floating';
  }
  // 在部分测试机上（Win11系统/华为），默认的onTop级别会不起作用，因此设置成最高等级
  return 'screen-saver';
};

export default {
  encode,
  urlWithArgs
};
