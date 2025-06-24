import { Injectable } from '@nestjs/common';
import { ChatCompletionTool } from 'openai/resources/chat/completions'
@Injectable()
export class ToolDefinitionService {
    getTools(): ChatCompletionTool[] {
        return [
            {
                type: 'function',
                function: {
                    name: 'edit_markdown_file',
                    description: 'Cria ou edita um arquivo markdown com base no conteúdo e no caminho fornecido.',
                    parameters: {
                        type: 'object',
                        properties: {
                            filePath: { type: 'string' },
                            content: { type: 'string' },
                        },
                        required: ['content'],
                    },
                },
            },
            {
                type: 'function',
                function: {
                    name: 'select_macro_prompt_category',
                    description: 'Seleciona um grupo de blocos de prompt baseado em um arquivo markdown.',
                    parameters: {
                        type: 'object',
                        properties: {
                            fileName: { type: 'string' },
                            name: {type: 'string'}
                        },
                        required: ['fileName', 'name'],
                    },
                },
            },
        ];
    }
}
