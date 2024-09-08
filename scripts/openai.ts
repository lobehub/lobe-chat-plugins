import "dotenv/config";
import OpenAI from "openai";

export const getOpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_PROXY_URL,
  })
