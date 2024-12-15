import { consola } from 'consola';
import { readJSONSync } from 'fs-extra';
import { renameSync } from 'node:fs';
import { resolve } from 'node:path';

import { localesDir, pluginLocales, plugins, pluginsDir } from './const';
import { checkJSON } from './utils';

const formatFilenameById = (fileName) => {
  const filePath = resolve(pluginsDir, fileName);
  const plugin = readJSONSync(filePath);
  const newFilename = plugin.identifier + '.json';
  if (fileName !== newFilename) {
    const newFilepath = resolve(pluginsDir, newFilename);
    renameSync(filePath, newFilepath);
    consola.success(`rename [${fileName}] >> [${newFilename}]`);
    for (const file of pluginLocales) {
      if (checkJSON(file)) {
        const localeFilename = file.name;
        const localeFilepath = resolve(localesDir, localeFilename);
        const localeFilenameArray = file.name.split('.');

        if (localeFilenameArray[0] === String(fileName).split('.')[0]) {
          const newLocaleFilename = [
            plugin.identifier,
            localeFilenameArray[1],
            localeFilenameArray[2],
          ].join('.');
          const newLocaleFilepath = resolve(localesDir, newLocaleFilename);
          renameSync(localeFilepath, newLocaleFilepath);
          consola.success(`rename [${localeFilename}] >> [${newLocaleFilename}]`);
        }
      }
    }
  }
};

export const formatFilenames = () => {
  consola.start('Start format filenames...');
  for (const file of plugins) {
    if (checkJSON(file)) {
      try {
        formatFilenameById(file.name);
      } catch (error) {
        consola.error(file.name, error);
      }
    }
  }
  consola.success('clean');
};
