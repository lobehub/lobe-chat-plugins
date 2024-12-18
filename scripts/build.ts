import { consola } from 'consola';
import { readJSONSync, writeJSONSync } from 'fs-extra';
import { cloneDeep, merge, uniqBy } from 'lodash-es';
import { resolve } from 'node:path';

import { formatAndCheckSchema } from './check';
import { config, localesDir, meta, plugins, pluginsDir, publicDir } from './const';
import { checkDir, findDuplicates } from './utils';

const build = async () => {
  checkDir(publicDir);

  const pluginsIndex = {
    ...meta,
    plugins: [],
  };

  const list = {};

  for (const file of plugins) {
    if (file.isFile()) {
      const data = readJSONSync(resolve(pluginsDir, file.name));
      const plugin = formatAndCheckSchema(data);
      if (!list[config.entryLocale]) list[config.entryLocale] = [];
      list[config.entryLocale].push(plugin);
      for (const locale of config.outputLocales) {
        if (!list[locale]) list[locale] = [];
        const localeFilePath = resolve(localesDir, file.name.replace('.json', `.${locale}.json`));
        const localeData = readJSONSync(localeFilePath);
        list[locale].push(merge(cloneDeep(plugin), localeData));
      }
    }
  }

  for (const locale of [config.entryLocale, ...config.outputLocales]) {
    pluginsIndex.plugins = list[locale].sort(
      // @ts-ignore
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    let tags: string[] = [];

    for (const plugin of pluginsIndex.plugins) {
      tags = [...tags, ...plugin.meta.tags];
    }

    tags = findDuplicates(tags);

    pluginsIndex.tags = tags;

    const name = `index.${locale}.json`;

    pluginsIndex.plugins = uniqBy(pluginsIndex.plugins, 'identifier');

    if (locale === config.entryLocale) {
      writeJSONSync(resolve(publicDir, `index.json`), pluginsIndex);
    }
    writeJSONSync(resolve(publicDir, name), pluginsIndex);

    consola.success(`build ${name}`);
  }
};

await build();
