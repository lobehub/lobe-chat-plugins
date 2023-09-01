import { consola } from 'consola';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { formatAndCheckSchema } from './check.mjs';
import { metaPath, plugins, pluginsDir, root, templatePath } from './const.mjs';
import { translateJSON } from './i18n.mjs';

const formatJSON = async (filePath, checkType) => {
  consola.start(filePath.replace(root, ''));

  const data = readFileSync(filePath, {
    encoding: 'utf8',
  });

  let plugin = JSON.parse(data);

  if (checkType) {
    plugin = formatAndCheckSchema(plugin);

    // i18n workflow
    if (typeof plugin.meta.title === 'string' && typeof plugin.meta.description === 'string') {
      const { title, description } = plugin.meta;
      const translateResult = await translateJSON({ description, title });
      if (translateResult) {
        plugin.meta.title = translateResult.title;
        plugin.meta.description = translateResult.description;
        consola.success(`i18n generated`);
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
      const filePath = resolve(pluginsDir, file.name);
      await formatJSON(filePath, true);
    }
  }
};

await runFormat();
