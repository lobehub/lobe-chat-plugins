import { consola } from 'consola';
import { colors } from 'consola/utils';
import { existsSync, mkdirSync } from 'node:fs';

import { readmeSplit } from './const';

export const checkDir = (dirpath) => {
  if (!existsSync(dirpath)) mkdirSync(dirpath);
};

export const checkJSON = (file) => file.isFile() && file.name?.includes('.json');

export const split = (name) => {
  consola.log('');
  consola.log(colors.gray(`========================== ${name} ==============================`));
};

export const findDuplicates = (arr: string[]): string[] => {
  const duplicates: { [key: string]: number } = {};

  // 统计每个项目出现的次数
  for (const item of arr) {
    if (duplicates[item]) {
      duplicates[item]++;
    } else {
      duplicates[item] = 1;
    }
  }

  // 挑出重复出现 3 次以上的项目
  const COUNT = arr.length > 10 ? 3 : 1;

  const result = Object.keys(duplicates).filter((item) => duplicates[item] >= COUNT);

  // 按重复次数从多到少排序
  result.sort((a, b) => duplicates[b] - duplicates[a]);

  return result;
};

export const updateAwesomeReadme = (md: string, prompts: string): string => {
  const mds = md.split(readmeSplit);
  mds[1] = [' ', prompts, ' '].join('\n\n');

  return mds.join(readmeSplit);
};
