import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const root = resolve(__dirname, '..');
export const pluginsDir = resolve(root, './plugins');
export const plugins = readdirSync(pluginsDir, { withFileTypes: true });
export const templatePath = resolve(root, 'plugin_template.json');
export const metaPath = resolve(root, 'meta.json');
export const meta = JSON.parse(readFileSync(metaPath, { encoding: 'utf8' }));