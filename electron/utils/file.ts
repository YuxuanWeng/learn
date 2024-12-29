import fs from 'fs';
import path from 'path';

export function deleteFile(filePath: string, fileName: string) {
  return new Promise((resolve, reject) => {
    // 判断给定的路径是否存在
    if (fs.existsSync(filePath)) {
      const files = fs.readdirSync(filePath); // 返回文件和子目录的数组

      files.forEach(file => {
        const curPath = path.join(filePath, file);

        // 是指定文件，则删除
        if (file.includes(fileName)) {
          fs.unlinkSync(curPath);
          resolve(`成功删除文件: ${curPath}`);
        }
      });
    } else {
      reject(new Error('给定的路径不存在!'));
    }
    resolve('已完成');
  });
}
export function getFileList(filePath: string) {
  return fs.readdirSync(filePath) ?? [];
}
export function getFileMTime(filePath: string, fileName: string) {
  return fs.statSync(path.join(filePath, fileName))?.mtime ?? Date.now();
}
