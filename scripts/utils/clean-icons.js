const fs = require('fs');
const path = require('path');
const walk = require('klaw-sync');
const rimraf = require('rimraf');

walk(path.resolve(__dirname, '../../src/assets/icons'), {
  traverseAll: false,
  nodir: false
})
  .filter(f => {
    return !f.stats.size || f.stats.isDirectory() || /\/(\d+?|Frame\s.+?)\..*?$/.test(f.path);
  })
  .forEach(f => {
    rimraf.sync(f.path);
  });
