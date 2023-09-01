import { pluginMetaSchema } from '@lobehub/chat-plugin-sdk';
import { consola } from 'consola';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { meta, plugins, pluginsDir, root } from './const.mjs';

const build = async () => {
  const pluginsIndex = {
    ...meta,
    plugins: [],
  };

  const list = [];
  for (const file of plugins) {
    if (file.isFile()) {
      const data = readFileSync(resolve(pluginsDir, file.name), {
        encoding: 'utf8',
      });
      const plugin = JSON.parse(data);

      const result = pluginMetaSchema.safeParse(plugin);

      if (result.success) {
        list.push(plugin);
      } else {
        consola.error(`schema check fail`);
      }
    }
  }

  pluginsIndex.plugins = list.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

  const publicPath = resolve(root, 'public');

  if (!existsSync(publicPath)) mkdirSync(publicPath);

  writeFileSync(resolve(root, './public/index.json'), JSON.stringify(pluginsIndex, null, 2), {
    encoding: 'utf8',
  });

  consola.success('build index.json');
};

await build();
