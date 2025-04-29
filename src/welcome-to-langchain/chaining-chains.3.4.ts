import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { BaseOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import { RunnableMap } from "@langchain/core/runnables";

dotenv.config(); // .env에서 OPENAI_API_KEY 읽어옴


async function main() {
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.1,
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(output) {
          process.stdout.write(output);
        },
      },
    ],
  });

  const chefTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "당신은 세계 최고 수준의 국제 셰프입니다. 누구나 따라 하기 쉬운 요리법을 만들며, 쉽게 구할 수 있는 재료로 어떤 종류의 요리든 만들 수 있습니다."
    ),
    HumanMessagePromptTemplate.fromTemplate("나는 {cuisine} 요리를 만들고 싶어"),
  ]);

  const chefChain = chefTemplate.pipe(model);
  
  const vegChefTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "당신은 채식주의자 요리사입니다. 전통적인 채식주의자용 레시피에 특화되어 있습니다. 당신은 대체 재료를 찾고, 준비하는 방법에 대해 설명합니다. 기존 레시피를 너무 많이 변경해서는 안됩니다. 만약 다른 대체품이 없다면, 그냥 레시피를 모른다고 말하세요"
    ),
    HumanMessagePromptTemplate.fromTemplate("{recipe}"),
  ]);

  const vegChefChain = vegChefTemplate.pipe(model);
  
  
  const finalChain = RunnableMap.from({
    recipe: chefChain,
  }).pipe(vegChefChain)

  const result = await finalChain.invoke({
    cuisine: "인도 요리"
  })

  console.log(result);
  
  
}

main().then().catch(console.error);