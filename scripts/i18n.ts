import { consola } from 'consola';
import 'dotenv/config';
import { getOpenAI } from "./openai";

import { config } from './const';

export const translateJSON = async (json, outputLocale, entryLocale = config.entryLocale) => {
  consola.info('i18n generating...');
  const completion = await getOpenAI.chat.completions.create({
    messages: [
      {
        content: [
          `Translate the i18n JSON file from ${entryLocale} to ${outputLocale} according to the BCP 47 standard`,
          `Keep the keys the same as the original file and make sure the output remains a valid i18n JSON file.`,
        ].join("\n"),
        role: "system",
      },
      { content: JSON.stringify(json), role: "user" },
    ],
    model: config.modelName,
    response_format: {
      type: "json_object",
    },
    stream: false,
    temperature: 0,
  });
  return JSON.parse(completion.choices[0].message.content);
};
