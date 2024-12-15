import { consola } from 'consola';
import dayjs from 'dayjs';
import { readJSONSync, writeJSONSync } from 'fs-extra';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import pMap from 'p-map';

import { SYNC_URL, plugins, pluginsDir } from './const';

interface OpenaiMainifest {
  api: {
    url: string;
  };
  description_for_human: string;
  logo_url: string;
  name_for_human: string;
  name_for_model: string;
}

interface PluginMainifest {
  author: string;
  createdAt: string;
  homepage: string;
  identifier: string;
  manifest: string;
  meta: {
    avatar: string;
    description: string;
    tags: string[];
    title: string;
  };
  schemaVersion: number;
  systemRole: string;
}
const syncCollections = async () => {
  const res = await fetch(SYNC_URL);
  const {
    plugins,
    expires,
  }: {
    expires: string[];
    plugins: PluginMainifest[];
  } = await res.json();

  for (const plugin of plugins) {
    const filePath = resolve(pluginsDir, `${plugin.identifier}.json`);
    const isExist = existsSync(filePath);

    plugin.createdAt = isExist ? readJSONSync(filePath).createdAt : dayjs().format('YYYY-MM-DD');

    writeJSONSync(filePath, plugin);
    consola.success(`Synced ${plugin.identifier}`);
  }

  for (const identifier of expires) {
    try {
      rmSync(resolve(pluginsDir, `${identifier}.json`));
      consola.warn(`Remove expire plugin ${identifier}`);
    } catch {}
  }
};

const syncExistPlugins = async () => {
  await pMap(
    plugins,
    async (plugin) => {
      const filePath = resolve(pluginsDir, plugin.name);

      try {
        const pluginManifest: PluginMainifest = readJSONSync(filePath);
        const res = await fetch(pluginManifest.manifest);
        const json: OpenaiMainifest | PluginMainifest | any = await res.json();
        pluginManifest.identifier = json?.name_for_model || json?.identifier;
        pluginManifest.meta.avatar = json.logo_url || json?.meta?.avatar;
        if (!pluginManifest.identifier) return consola.warn(`Failed to sync ${plugin.name}`);
        writeJSONSync(filePath, pluginManifest);
        consola.success(`Synced ${pluginManifest.identifier}`);
      } catch (error) {
        consola.error(`Failed to sync ${plugin}`, error);
      }
    },
    { concurrency: 5 },
  );
};

const sync = async () => {
  consola.start('Start sync collections...');
  await syncCollections();
  consola.start('Start sync exist plugins...');
  await syncExistPlugins();
};

sync();
