import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';
import pbjs from 'protobufjs-cli/pbjs';
import { pathProto } from './constants';
import { formatCode, getIdlPath, getProtoPaths } from './utils';

(async () => {
  const pathBdmIdl = getIdlPath();

  const [bdmCommonTypesPath] = await getProtoPaths(pathBdmIdl, 'common.proto');
  const [bdmEnumPath] = await getProtoPaths(pathBdmIdl, 'enum_type.proto');

  const [bdsCommonTypesPath] = await getProtoPaths(pathBdmIdl, 'bdm_bds_common.proto');
  const [bdsEnumPath] = await getProtoPaths(pathBdmIdl, 'bdm_bds_enum_type.proto');

  const [baseDataBaseSyncPaths] = await getProtoPaths(pathBdmIdl, '*_base_data_base_sync_data_scan.proto');
  const [baseDataBusinessSyncPaths] = await getProtoPaths(pathBdmIdl, '*_base_data_sync_data_scan.proto');
  consola.info(chalk.magenta('Start generating combine proto json...'));

  const protoFilePaths = [
    bdmCommonTypesPath,
    bdmEnumPath,
    bdsCommonTypesPath,
    bdsEnumPath,
    baseDataBaseSyncPaths,
    baseDataBusinessSyncPaths
  ];

  pbjs.main(['-t', 'json', '--keep-case', ...protoFilePaths], async (err, output) => {
    if (err) {
      consola.error(chalk.redBright('Generate proto json error...', err));
    }

    if (output) {
      const protoRootJSON = 'export const protoRootJSON = '.concat(output);

      const code = await formatCode(protoRootJSON);
      fs.writeFileSync(path.resolve(pathProto, 'index.ts'), code, 'utf8');

      consola.info(chalk.magenta('Done!'));
    }
  });
})();
