import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { BaseOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";

dotenv.config(); // .env에서 OPENAI_API_KEY 읽어옴

class CommaOutputParser extends BaseOutputParser<string[]> {
    lc_namespace = [];

    async parse(text: string): Promise<string[]> {
        return text.trim().split(',').map((item: string) => item.trim());
    }

    getFormatInstructions(): string {
        return "";
    }
}

async function main() {
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.1
    });
    
    const template = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate("당신은 list 생성 머신 입니다. 입력받은 질문들은 모두 ,로만 구분뒨 list로 답해질 것입니다. 최대 {max_length}개 만큼이요"),
        HumanMessagePromptTemplate.fromTemplate("{question}"),
    ]);


    new CommaOutputParser();
    
    const chain = template.pipe(model).pipe(new CommaOutputParser());

    const result = await chain.invoke({
        question: "포켓몬이 뭐야",
        max_length: 10
    });

    console.log("결과:", result);  // ['김치', '비빔밥', '불고기'] 같은 형식으로 출력됨
}

main().then().catch(console.error);

