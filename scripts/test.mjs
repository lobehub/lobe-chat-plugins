import { consola } from 'consola';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { formatAndCheckSchema } from './check.mjs';
import { plugins, pluginsDir, root } from './const.mjs';

const runTest = () => {
  for (const file of plugins) {
    if (file.isFile()) {
      const filePath = resolve(pluginsDir, file.name);
      consola.start(filePath.replace(root, ''));
      const data = readFileSync(filePath, {
        encoding: 'utf8',
      });
      const plugin = JSON.parse(data);
      formatAndCheckSchema(plugin);
    }
  }
};

runTest();
