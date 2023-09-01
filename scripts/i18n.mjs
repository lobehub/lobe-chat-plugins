import { consola } from 'consola';
import 'dotenv/config';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

if (!process.env.OPENAI_TOKEN) {
  consola.error('cannot find OPENAI_TOKEN in env');
}

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_TOKEN,
  temperature: 0,
});

const input = { description: 'Get realtime weather information', title: 'Realtime Weather' };
const ouput = {
  description: { 'en-US': 'Get realtime weather information', 'zh-CN': '获取当前天气情况' },
  title: { 'en-US': 'Realtime Weather', 'zh-CN': '实时天气' },
};
const prompt = [
  'i18n expert, automatically determine the language of the provided JSON and convert it to i18n format.',
  'User input',
  JSON.stringify(input),
  'Output',
  JSON.stringify(ouput),
].join('\n');

export const translateJSON = async (json) => {
  consola.info('i18n generating...');
  const res = await model.call([new SystemMessage(prompt), new HumanMessage(JSON.stringify(json))]);
  const result = JSON.parse(res.content);
  if (
    result.title['zh-CN'] &&
    result.title['en-US'] &&
    result.description['en-US'] &&
    result.description['en-US']
  ) {
    return result;
  }
};
