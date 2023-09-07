import { consola } from 'consola';
import { cloneDeep, merge } from 'lodash-es';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import config from '../.i18nrc.js';
import { formatAndCheckSchema } from './check.mjs';
import { localesDir, meta, plugins, pluginsDir, root } from './const.mjs';

const build = async () => {
  const publicPath = resolve(root, 'public');

  if (!existsSync(publicPath)) mkdirSync(publicPath);
  
  const pluginsIndex = {
    ...meta,
    plugins: [],
  };

  const list = {};

  for (const file of plugins) {
    if (file.isFile()) {
      const data = readFileSync(resolve(pluginsDir, file.name), {
        encoding: 'utf8',
      });
      const plugin = formatAndCheckSchema(JSON.parse(data));
      if (!list[config.entryLocale]) list[config.entryLocale] = [];
      list[config.entryLocale].push(plugin);
      for (const locale of config.outputLocales) {
        if (!list[locale]) list[locale] = [];
        const localeFilePath = resolve(localesDir, file.name.replace('.json', `.${locale}.json`));
        const localeData = readFileSync(localeFilePath, {
          encoding: 'utf8',
        });
        list[locale].push(merge(cloneDeep(plugin), JSON.parse(localeData)));
      }
    }
  }

  for (const locale of [config.entryLocale, ...config.outputLocales]) {
    pluginsIndex.plugins = list[locale].sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    const name = locale === config.entryLocale ? `index.json` : `index.${locale}.json`;
    writeFileSync(resolve(root, `./public`, name), JSON.stringify(pluginsIndex), {
      encoding: 'utf8',
    });
    consola.success(`build ${name}`);
  }
};

await build();
