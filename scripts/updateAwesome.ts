import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { indexCnPath, indexPath, publicDir, readmeCnPath, readmePath } from './const';
import { readJSON, updateAwesomeReadme } from './utils';

const updateAwesome = (filePath: string, md: string, plugins, locale?: string) => {
  const data: string[] = [];

  plugins.forEach(({ identifier, author, createdAt, homepage, meta }, i) => {
    const pluginConfigPath = resolve(
      publicDir,
      [identifier, locale, 'json'].filter(Boolean).join('.'),
    );
    const header = `### ${meta.title}`;
    const subHeader = `<sup>By **[@${author}](${homepage})** on **${createdAt}**</sup>`;
    const desc = [
      `${meta.description}`,
      `${meta.tags
        .filter(Boolean)
        .map((tag) => `\`${tag}\``)
        .join(' ')}`,
    ].join('\n\n');

    const body: string = [
      i !== 0 ? '---' : false,
      header,
      subHeader,
      desc,
      `<div align="right">\n\n[![][back-to-top]](#readme-top)\n\n</div>`,
    ]
      .filter(Boolean)
      .join('\n\n');
    data.push(body);
  });

  const newMd = updateAwesomeReadme(md, data.join('\n\n'));

  writeFileSync(filePath, newMd, 'utf-8');
};

const runUpdateAwesome = () => {
  const readmeCn = readFileSync(readmeCnPath, 'utf-8');
  const readme = readFileSync(readmePath, 'utf-8');
  const index = readJSON(indexPath);
  const indexCn = readJSON(indexCnPath);
  updateAwesome(readmePath, readme, index.plugins);
  updateAwesome(readmeCnPath, readmeCn, indexCn.plugins, 'zh-CN');
};

runUpdateAwesome();
