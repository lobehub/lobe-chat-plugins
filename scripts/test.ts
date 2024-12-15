import { consola } from 'consola';
import { readJSONSync } from 'fs-extra';
import { resolve } from 'node:path';

import { checkUniqueIdentifier, formatAndCheckSchema } from './check';
import { plugins, pluginsDir, root } from './const';

const runTest = () => {
  const identifiers = [];
  for (const file of plugins) {
    if (file.isFile()) {
      const filePath = resolve(pluginsDir, file.name);
      consola.start(filePath.replace(root, ''));
      const plugin = readJSONSync(filePath);
      formatAndCheckSchema(plugin);
      identifiers.push(plugin.identifier);
    }
  }
  checkUniqueIdentifier(identifiers);
};

runTest();
