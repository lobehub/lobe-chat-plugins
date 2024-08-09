import { consola } from 'consola';
import { get, kebabCase, merge, set } from 'lodash-es';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import pMap from 'p-map';

import { addCategory } from './category';
import { formatAndCheckSchema } from './check';
import { config, localesDir, metaPath, plugins, pluginsDir, templatePath } from './const';
import { formatFilenames } from './formatFilename';
import { translateJSON } from './i18n';
import { checkJSON, readJSON, split, writeJSON } from './utils';

class Formatter {
  formatJSON = async (fileName: string, checkType?: boolean) => {
    consola.start(fileName);

    const filePath = resolve(pluginsDir, fileName);

    let plugin = readJSON(filePath);

    if (checkType) {
      plugin = formatAndCheckSchema(plugin);

      if (!plugin.meta.category) {
        plugin = await addCategory(plugin);
        consola.info(plugin.meta.category);
        writeJSON(resolve(pluginsDir, fileName), plugin);
      }

      if (plugin?.meta?.tags?.length > 0) {
        plugin.meta.tags = plugin.meta.tags.map((tag) => kebabCase(tag));
      }

      // i18n workflow
      let rawData = {};

      for (const key of config.selectors) {
        const rawValue = get(plugin, key);
        if (rawValue) set(rawData, key, rawValue);
      }

      if (rawData) {
        if (plugin.locale && plugin.locale !== config.entryLocale) {
          if (config.outputLocales.includes(plugin.locale)) {
            writeJSON(
              resolve(localesDir, fileName.replace('.json', `.${plugin.locale}.json`)),
              rawData,
            );
          }
          rawData = await translateJSON(rawData, config.entryLocale, plugin.locale);
          plugin = merge(plugin, rawData);
          delete plugin.locale;
        }

        for (const locale of config.outputLocales) {
          const localeFilePath = resolve(localesDir, fileName.replace('.json', `.${locale}.json`));
          if (existsSync(localeFilePath)) continue;
          const translateResult = await translateJSON(rawData, locale);
          if (translateResult) {
            writeJSON(localeFilePath, translateResult);
            consola.success(`${locale} generated`);
          }
        }
      }
    }

    writeJSON(filePath, plugin);
    consola.success(`format success`);
  };
  run = async () => {
    consola.start('Start format json content...');
    await this.formatJSON(metaPath);
    await this.formatJSON(templatePath);
    await pMap(
      plugins,
      async (file) => {
        if (checkJSON(file)) {
          await this.formatJSON(file.name, true);
        }
      },
      { concurrency: 5 },
    );
  };
}

split('FORMAT JSON CONTENT');
await new Formatter().run();
split('FORMAT FILENAME');
formatFilenames();
