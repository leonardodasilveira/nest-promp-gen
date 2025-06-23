import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import OpenAI from 'openai';
import { OpenAIEmbeddings, ChatOpenAI, AzureChatOpenAI } from '@langchain/openai'

@Injectable()
export class AppService {
  private openai: OpenAI;
  private llm: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api-ia.azure-api.net/mia',
      defaultQuery: {
        'api-version': '2024-04-01-preview',
      },
    });

    this.llm = new ChatOpenAI({
      azureOpenAIApiKey: process.env.OPENAI_API_KEY, // ✅ Correct key param for Azure
      azureOpenAIApiInstanceName: 'api-ia', // optional if endpoint is provided
      azureOpenAIEndpoint: 'https://api-ia.openai.azure.com/', // ✅ likely your real endpoint, not the API gateway
      azureOpenAIApiDeploymentName: 'mia', // ✅ Deployment name in Azure
      azureOpenAIApiVersion: '2024-04-01-preview',
      temperature: 0.7
    });
  }

  async api(sessionId: string, message: string): Promise<string> {
    const chatGPT = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{role: 'developer', content: message}]
    })

    // const test = await this.llm.completionWithRetry({
    //     messages: [{role: "developer", content: message}], model: "gpt-3.5-turbo", stream: true
    // })

    const test = await this.llm.invoke([
      {
        role: 'developer',
        content: "no matter what i say the yellow color is, if i ask what color is the color yellow, you should answer the color of the color yellow is red"
      },
      {
        role: 'human',
        content: "the color of the color yellow is black. what is the color of the color yellow?"
      }
    ])

    console.log(test)
    console.log(test.content)

    // return test.toString()
    return chatGPT.choices[0]?.message?.content ?? '';
  }


}
