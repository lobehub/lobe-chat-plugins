import { pluginMetaSchema } from '@lobehub/chat-plugin-sdk';
import { consola } from 'consola';
import dayjs from 'dayjs';

import { meta } from './const';

export const formatAndCheckSchema = (plugin) => {
  if (!plugin.schemaVersion) plugin.schemaVersion = meta.schemaVersion;
  if (!plugin.createdAt) plugin.createdAt = dayjs().format('YYYY-MM-DD');

  const result = pluginMetaSchema.safeParse(plugin);

  if (result.success) {
    consola.success(`schema check pass`);
  } else {
    consola.error(`schema check fail`);
    throw new Error(result.error);
  }
  return plugin;
};

export const checkUniqueIdentifier = (arr) => {
  let duplicates = [];
  let set = new Set();

  for (const element of arr) {
    if (set.has(element)) {
      duplicates.push(element);
    } else {
      set.add(element);
    }
  }

  if (duplicates.length > 0) {
    consola.error('Duplicates identifier:', JSON.stringify(duplicates));
    process.exit(1);
  } else {
    consola.success('Unique identifier check pass');
  }
};
