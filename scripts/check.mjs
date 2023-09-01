import { pluginMetaSchema } from '@lobehub/chat-plugin-sdk';
import { consola } from 'consola';
import dayjs from 'dayjs';

import { meta } from './const.mjs';

export const formatAndCheckSchema = (plugin) => {
  if (!plugin.schemaVersion) plugin.schemaVersion = meta.schemaVersion;
  if (!plugin.createAt) plugin.createAt = dayjs().format('YYYY-MM-DD');

  const result = pluginMetaSchema.safeParse(plugin);

  if (result.success) {
    consola.success(`schema check pass`);
  } else {
    consola.error(`schema check fail`);
  }
  return plugin;
};
