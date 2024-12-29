import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';
import { pathTypes } from './constants';
import { apiTypesTransformer, cleanTypesDir, getIdlPath, getProtoPaths, readFile } from './utils';

(async () => {
  const pathBdmIdl = getIdlPath();

  const filePaths = [
    ...(await getProtoPaths(pathBdmIdl, 'bdm_bds_bds_api_*.proto')),
    ...(await getProtoPaths(pathBdmIdl, 'bdm_base_auth_api_*.proto')),
    ...(await getProtoPaths(pathBdmIdl, 'crm/bdm_crm_api_access_user_access_info.proto')),
    ...(await getProtoPaths(pathBdmIdl, 'crm/bdm_crm_api_access_user_mul_get.proto')),
    ...(await getProtoPaths(pathBdmIdl, 'crm/bdm_crm_api_inst_list.proto'))
  ] // 排除以下路径
    .filter(
      p => !p.includes('base_id_mapping') && !p.includes('bds_api_fuzzy_search_get') && !p.includes('ws_proxy_connect')
    );

  consola.info(chalk.magenta('Start generating api types...'));

  await cleanTypesDir(pathTypes);

  for await (const filePath of filePaths) {
    consola.info(chalk.magenta(`Start parsing ${filePath}...`));

    const data = readFile(filePath);

    if (data) {
      const { code, apiModule, exportFileName } = await apiTypesTransformer(data);
      if (code) {
        const pathApiModule = path.resolve(pathTypes, apiModule.replaceAll('_', '-'));
        if (!fs.existsSync(pathApiModule)) {
          fs.mkdirSync(pathApiModule);
        }
        fs.writeFileSync(path.resolve(pathApiModule, `${exportFileName.replaceAll('_', '-')}.d.ts`), code, 'utf8');
      }
    }
  }

  consola.info(chalk.magenta('Done!'));
})();
