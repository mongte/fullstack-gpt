import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";

dotenv.config(); // .env에서 OPENAI_API_KEY 읽어옴

async function run() {
  try {
    // Chat 모델 (gpt-3.5-turbo)
    const chat = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.1,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate("You are a geography expert. And you only reply in {language}."),
      AIMessagePromptTemplate.fromTemplate("Ciao, mi chiamo {name}!"),
      HumanMessagePromptTemplate.fromTemplate("What is the distance between {country_a} and {country_b}? Also, what is your name?"),
    ]);

    const messages = await prompt.formatMessages({
      language: "Greek",
      name: "Socrates",
      country_a: "Mexico",
      country_b: "Thailand",
    });

    const result = await chat.invoke(messages);
    console.log("result:", result);
    
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
  }
}

run();