import { pluginMetaSchema } from '@lobehub/chat-plugin-sdk';
import { consola } from 'consola';
import dayjs from 'dayjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { meta, metaPath, plugins, pluginsDir, root, templatePath } from './const.mjs';

const formatJSON = async (filePath, checkType) => {
  consola.start(filePath.replace(root, ''));

  const data = readFileSync(filePath, {
    encoding: 'utf8',
  });

  const plugin = JSON.parse(data);

  if (checkType) {
    if (!plugin.schemaVersion) plugin.schemaVersion = meta.schemaVersion;
    if (!plugin.createAt) plugin.createAt = dayjs().format('YYYY-MM-DD');

    const result = pluginMetaSchema.safeParse(plugin);

    if (result.success) {
      consola.success(`schema check pass`);
    } else {
      consola.error(`schema check fail`);
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
      const filePath = resolve(pluginsDir, file.name);
      await formatJSON(filePath, true);
    }
  }
};

await runFormat();