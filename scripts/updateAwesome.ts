import { readJSONSync } from 'fs-extra';
import { readFileSync, writeFileSync } from 'node:fs';

import { indexCnPath, indexPath, readmeCnPath, readmePath } from './const';
import { updateAwesomeReadme } from './utils';

const updateAwesome = (filePath: string, md: string, plugins) => {
  const data: string[] = [];

  for (const [i, { identifier, author, createdAt, homepage, meta }] of plugins.entries()) {
    const header = `### [${meta.title.replaceAll('[', '').replaceAll(']', '')}](https://lobechat.com/discover/plugin/${identifier})`;
    const subHeader = `<sup>By **[@${author}](${homepage})** on **${createdAt}**</sup>`;
    const desc = [
      `${meta.description}`,
      `${meta.tags
        .filter(Boolean)
        .map((tag) => `\`${tag}\``)
        .join(' ')}`,
    ].join('\n\n');

    const body: string = [i === 0 ? false : '---', header, subHeader, desc]
      .filter(Boolean)
      .join('\n\n');
    data.push(body);
  }

  const newMd = updateAwesomeReadme(md, data.join('\n\n'));

  writeFileSync(filePath, newMd, 'utf8');
};

const runUpdateAwesome = () => {
  const readmeCn = readFileSync(readmeCnPath, 'utf8');
  const readme = readFileSync(readmePath, 'utf8');
  const index = readJSONSync(indexPath);
  const indexCn = readJSONSync(indexCnPath);
  updateAwesome(readmePath, readme, index.plugins);
  updateAwesome(readmeCnPath, readmeCn, indexCn.plugins);
};

runUpdateAwesome();
