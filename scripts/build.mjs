import { consola } from 'consola';
import { cloneDeep, merge } from 'lodash-es';
import { resolve } from 'node:path';

import { formatAndCheckSchema } from './check.mjs';
import { config, localesDir, meta, plugins, pluginsDir, publicDir } from './const.mjs';
import { checkDir, readJSON, writeJSON } from './utils.mjs';

const build = async () => {
  checkDir(publicDir);

  const pluginsIndex = {
    ...meta,
    plugins: [],
  };

  const list = {};

  for (const file of plugins) {
    if (file.isFile()) {
      const data = readJSON(resolve(pluginsDir, file.name));
      const plugin = formatAndCheckSchema(data);
      if (!list[config.entryLocale]) list[config.entryLocale] = [];
      list[config.entryLocale].push(plugin);
      for (const locale of config.outputLocales) {
        if (!list[locale]) list[locale] = [];
        const localeFilePath = resolve(localesDir, file.name.replace('.json', `.${locale}.json`));
        const localeData = readJSON(localeFilePath);
        list[locale].push(merge(cloneDeep(plugin), localeData));
      }
    }
  }

  for (const locale of [config.entryLocale, ...config.outputLocales]) {
    pluginsIndex.plugins = list[locale].sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    const name = locale === config.entryLocale ? `index.json` : `index.${locale}.json`;
    writeJSON(resolve(publicDir, name), pluginsIndex, false);
    consola.success(`build ${name}`);
  }
};

await build();
