import {Injectable} from '@nestjs/common';
import OpenAI from 'openai';
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";

@Injectable()
export class AiAgent {
    private readonly openai: OpenAI;
    private readonly toolDefinitionService: ToolDefinitionService

    constructor(toolDefinitionService: ToolDefinitionService) {
        this.toolDefinitionService = toolDefinitionService
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://api-ia.azure-api.net/mia',
            defaultQuery: {'api-version': '2024-04-01-preview'},
        });
    }


    async sendChat(messages: any) {
        return this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            tools: this.toolDefinitionService.getTools(),
            tool_choice: 'auto',
        })
    }

}