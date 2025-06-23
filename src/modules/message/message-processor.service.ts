import {Injectable} from "@nestjs/common";
import {AiAgent} from "@src/modules/ai-agent/ai-agent.service";
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions"

@Injectable()
export class MessageProcessorService {
    constructor(
        private readonly conversationManager: ConversationManager,
        private readonly aiAgent: AiAgent,
        private readonly toolRunnerService: ToolRunnerService
    ) {
    }

    async processMessage(agent: string, userMessage: string): Promise<string | undefined> {
        const history: ChatCompletionMessageParam[] = await this.conversationManager.getMessages()

        history.push({role: 'user', content: userMessage});

        const response = await this.aiAgent.sendChat(history);
        const message = response.choices[0].message;
        const toolCalls = message.tool_calls;

        if (toolCalls) {
            for (const toolCall of toolCalls) {
                const {name, arguments: argStr} = toolCall.function;
                const args = JSON.parse(argStr);

                const result = await this.toolRunnerService.runTool(name, args)

                history.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(result)
                })
            }

            // recursive call in case a tool is called, so context is not lost
            const followup = await this.aiAgent.sendChat(history);
            const finalMessage = followup.choices[0].message;
            if (finalMessage.role === 'assistant' && finalMessage.content) {
                await this.conversationManager.appendMessage(finalMessage.content);
            }
            return finalMessage.content;
        }

        await this.conversationManager.appendMessage(message.content);
        return message.content;
    }
}