import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readJSON } from './utils';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const root = resolve(__dirname, '..');

export const pluginsDir = resolve(root, './plugins');
export const localesDir = resolve(root, './locales');
export const publicDir = resolve(root, 'public');

export const plugins = readdirSync(pluginsDir, { withFileTypes: true });
export const pluginLocales = readdirSync(localesDir, { withFileTypes: true });

export const templatePath = resolve(root, 'plugin-template.json');

export const indexPath = resolve(publicDir, 'index.json');
export const indexCnPath = resolve(publicDir, 'index.zh-CN.json');

export const readmePath = resolve(root, 'README.md');
export const readmeCnPath = resolve(root, 'README.zh-CN.md');

export const metaPath = resolve(root, 'meta.json');
export const meta = readJSON(metaPath);

export const readmeSplit = '<!-- AWESOME PLUGINS -->';

export { default as config } from '../.i18nrc.js';
