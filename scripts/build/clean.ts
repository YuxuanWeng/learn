import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import { rimrafSync } from 'rimraf';

const cleanPath = ['dist', 'main', 'src/out', 'src/coverage', 'apps/dtm-fe/dist', 'apps/odm-fe/dist'];

// 清理打包的产物
(async () => {
  return new Promise((_, reject) => {
    consola.info(chalk.magenta(`目标：清理目录 ${cleanPath}`));
    const noneList: string[] = [];
    const exitList: string[] = [];
    let res = false;

    for (const path of cleanPath) {
      const a = fs.existsSync(path);
      if (!a) noneList.push(path);
      else exitList.push(path);
    }

    if (noneList.length) {
      consola.info(chalk.red(`目录${noneList}不存在`));
    }

    if (exitList.length) {
      res = rimrafSync(exitList);
    }

    if (res) {
      const msg = `成功清理 ${exitList} 目录`;
      consola.success(chalk.magenta(msg));
    } else if (exitList.length) {
      const msg = `目录 ${exitList} 清理失败`;
      consola.error(chalk.red(msg));
      reject(msg);
    } else {
      consola.info(chalk.magenta('没有指定目录需要清理'));
    }
  });
})();
