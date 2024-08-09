import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { readJSON } from './utils';

export const root = resolve(__dirname, '..');

export const pluginsDir = resolve(root, './src');
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

export const SYNC_URL = 'https://openai-collections.chat-plugin.lobehub.com';

export const category = [
  'gaming-entertainment',
  'lifestyle',
  'media-generate',
  'science-education',
  'social',
  'stocks-finance',
  'tools',
  'web-search',
];

export const config = require('../.i18nrc.js');
