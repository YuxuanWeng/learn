import chalk from 'chalk';
import consola from 'consola';
import { build } from 'esbuild';
import { replace } from 'esbuild-plugin-replace';
import { builtinModules } from 'module';
import path from 'path';
import { getAppConfig } from '../../get-app-config';

const pathElectron = path.resolve(__dirname, '../../electron');
const pathOutput = path.resolve(__dirname, '../../main');

const isBuildForProd = process.env.BUILD_FOR_PROD === 'true';

const buildPackages = async () => {
  const appConfig = getAppConfig();

  let sourcemap = false;
  let minify = false;

  if (process.argv.some(argv => argv.startsWith('--sourcemap')) || isBuildForProd) {
    sourcemap = true;
    minify = true;
  }

  const plugins = [replace({ 'process.env.APP_CONFIG': JSON.stringify(appConfig) })];

  // if (sourcemap) {
  //   plugins = [
  //     sentryEsbuildPlugin({
  //       url: 'https://shihetech-gp.sentry.io/',
  //       authToken: 'a4ffaa56ffd04d4faf0b8a4f7d2dc605cd84e51b960a4d558250a1ecd4e45de2',
  //       org: 'shihetech-gp',
  //       project: 'oms-electron',
  //       telemetry: false,
  //       debug: true
  //     }),
  //     ...plugins
  //   ];
  // }

  await build({
    entryPoints: [
      { out: 'index', in: path.resolve(pathElectron, 'main.ts') },
      { out: 'preload', in: path.resolve(pathElectron, 'preload.ts') },
      { out: 'network-worker', in: path.resolve(pathElectron, 'workers/network-worker.ts') },
      { out: 'spot-pricing-hint-worker', in: path.resolve(pathElectron, 'workers/spot-pricing-hint-worker.ts') },
      { out: 'utility-process', in: path.resolve(pathElectron, 'utility-process/data-localization/index.ts') }
    ],
    target: 'ESNext',
    platform: 'node',
    bundle: true,
    format: 'cjs',
    minifySyntax: true,
    external: ['electron', 'web-worker', 'better-sqlite3', 'antd', ...builtinModules],
    outdir: pathOutput,
    metafile: true,
    // sourcemap,
    // 代码压缩（简单混淆）
    minify,
    plugins
  });
};

(async () => {
  consola.info(chalk.magenta('Start building electron...'));

  const time = performance.now();
  await buildPackages();

  consola.info(chalk.magenta(`Done in ${((performance.now() - time) / 1000).toFixed(2)}s!`));
})();
