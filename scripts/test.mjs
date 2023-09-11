import { consola } from 'consola';
import { resolve } from 'node:path';

import { checkUniqueIdentifier, formatAndCheckSchema } from './check.mjs';
import { plugins, pluginsDir, root } from './const.mjs';
import { readJSON } from './utils.mjs';

const runTest = () => {
  const identifiers = [];
  for (const file of plugins) {
    if (file.isFile()) {
      const filePath = resolve(pluginsDir, file.name);
      consola.start(filePath.replace(root, ''));
      const plugin = readJSON(filePath);
      formatAndCheckSchema(plugin);
      identifiers.push(plugin.identifier);
    }
  }
  checkUniqueIdentifier(identifiers);
};

runTest();
