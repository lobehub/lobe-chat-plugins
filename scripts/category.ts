import { consola } from 'consola';
import 'dotenv/config';
import { getOpenAI } from "./openai";

import { category, config } from './const';

export const addCategory = async (json) => {
  consola.info(`category generating...`);
  const completion = await getOpenAI.chat.completions.create({
    messages: [
      {
        content: [
          `You are an expert proficient in categorizing plugins. Based on the catalog listing, classify the following plugin's information into one of the categories.`,
          `## Rules`,
          `- The input format is JSON, and the output format is the corresponding category like: {"category":"programming"}`,
          `- The output category string must strictly follow the provided catalog.`,
          `## Categories List`,
          category.map((m) => `- ${m}`).join('\n'),
        ].join('\n'),
        role: "system",
      },
      { content: JSON.stringify(json.meta), role: "user" },
    ],
    model: config.modelName,
    response_format: {
      type: "json_object",
    },
    stream: false,
    temperature: 0,
  });

  const addedCategory = JSON.parse(completion.choices[0].message.content as string).category;

  if (category.includes(addedCategory))
    return {
      ...json,
      meta: {
        ...json.meta,
        category: addedCategory,
      },
    };

  return json;
};
