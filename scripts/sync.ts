import {SYNC_URL, pluginsDir, plugins} from "./const";
import {existsSync, rmSync} from 'fs'
import {resolve} from "path"
import {readJSON, writeJSON} from "./utils";
import dayjs from "dayjs";
import {consola} from "consola";
import pMap from 'p-map';
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
        tags: string[];
        title: string;
        description: string;
    }
    schemaVersion: number;
}
const syncCollections = async () => {
    const res = await fetch(SYNC_URL)
    const {plugins,expires}: {
        plugins:PluginMainifest[],
        expires: string[]
    } = await res.json()

    plugins.forEach(plugin => {
        const filePath = resolve(pluginsDir, `${plugin.identifier}.json`)
        const isExist = existsSync(filePath)

        plugin.createdAt = isExist ? readJSON(filePath).createdAt : dayjs().format('YYYY-MM-DD');

        writeJSON(filePath, plugin)
        consola.success(`Synced ${plugin.identifier}`)
    })

    expires.forEach(identifier => {
        rmSync(resolve(pluginsDir, `${identifier}.json`))
        consola.warn(`Remove expire plugin ${identifier}`)
    })

}

const syncExistPlugins = async () => {
await pMap(plugins, async (plugin) => {
    const filePath = resolve(pluginsDir, plugin.name)

    const pluginManifest:PluginMainifest = readJSON(filePath);
    try {
        const res = await fetch(pluginManifest.manifest)
        const json:OpenaiMainifest | PluginMainifest | any = await res.json()
        pluginManifest.identifier = json?.name_for_model || json?.identifier
        pluginManifest.meta.avatar = json.logo_url || json?.meta?.avatar
        if (!pluginManifest.identifier) return consola.warn(`Failed to sync ${plugin.name}`)
        writeJSON(filePath, pluginManifest)
        consola.success(`Synced ${pluginManifest.identifier}`)
    } catch (error) {
        consola.error(`Failed to sync ${pluginManifest.identifier}`, error)
    }
}, {concurrency: 5})

}


const sync = async () => {
    consola.start('Start sync collections...');
    await syncCollections()
    consola.start('Start sync exist plugins...');
    await syncExistPlugins()
}

sync()
