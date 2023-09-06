import { consola } from 'consola';
import { get, kebabCase, merge, set } from 'lodash-es';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import config from '../.i18nrc.js';
import { formatAndCheckSchema } from './check.mjs';
import { localesDir, metaPath, plugins, pluginsDir, templatePath } from './const.mjs';
import { translateJSON } from './i18n.mjs';

const formatJSON = async (fileName, checkType) => {
  consola.start(fileName);

  const filePath = resolve(pluginsDir, fileName);

  const data = readFileSync(filePath, {
    encoding: 'utf8',
  });

  let plugin = JSON.parse(data);

  if (checkType) {
    plugin = formatAndCheckSchema(plugin);
    plugin.identifier = kebabCase(plugin.identifier);
    if (plugin?.meta?.tags?.length > 0) {
      plugin.meta.tags = plugin.meta.tags.map((tag) => tag.toLowerCase().replaceAll(' ', '-'));
    }

    // i18n workflow
    if (typeof plugin.meta.title === 'string' && typeof plugin.meta.description === 'string') {
      let rawData = {};

      for (const key of config.selectors) {
        set(rawData, key, get(plugin, key));
      }

      if (plugin.locale && plugin.locale !== config.entryLocale) {
        if (config.outputLocales.includes(plugin.locale)) {
          writeFileSync(
            resolve(localesDir, fileName.replace('.json', `.${plugin.locale}.json`)),
            JSON.stringify(rawData, null, 2),
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
          writeFileSync(localeFilePath, JSON.stringify(translateResult, null, 2));
          consola.success(`${locale} generated`);
        }
      }
    }
  }

  writeFileSync(filePath, JSON.stringify(plugin, null, 2), {
    encoding: 'utf8',
  });
  consola.success(`format success`);
};

const runFormat = async () => {
  await formatJSON(metaPath);
  await formatJSON(templatePath);
  for (const file of plugins) {
    if (file.isFile()) {
      await formatJSON(file.name, true);
    }
  }
};

await runFormat();
