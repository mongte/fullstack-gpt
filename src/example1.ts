import { Calculator } from "@langchain/community/tools/calculator";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { DynamicTool } from "@langchain/core/tools";

dotenv.config();

async function main() {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo-0125",  // 최신 GPT-3.5-Turbo 모델 사용
    temperature: 0.7,
    maxTokens: 500,  // 토큰 제한
  });

  const tools = [
    new Calculator(),
    new DynamicTool({
      name: "get_weather",
      description: "현재 날씨 정보를 가져옵니다. 입력으로 도시 이름을 받습니다.",
      func: async (city: string) => {
        // 실제로는 여기에 날씨 API를 연동해야 합니다
        return `${city}의 현재 날씨는 맑고 기온은 18도입니다.`;
      },
    }),
  ];
  
  const prompt = await pull<ChatPromptTemplate>("hwchase17/openai-functions-agent");
  const agent = await createOpenAIFunctionsAgent({
    llm: chatModel,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const result = await executor.invoke({
    input: "10 + 5는 얼마고, 오늘 서울 날씨 알려줘.",
  });

  console.log(result);
    
}

main();