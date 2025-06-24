import {Injectable} from "@nestjs/common";
import {AiAgent} from "@src/modules/ai-agent/ai-agent.service";
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions"
import {ConversationManagerFactory} from "@src/modules/conversation-manager/factories/conversation-manager.factory";

@Injectable()
export class MessageProcessorService {
    constructor(
        private conversationManager: ConversationManager,
        private readonly aiAgent: AiAgent,
        private readonly toolRunnerService: ToolRunnerService,
        private readonly conversationManagerFactory: ConversationManagerFactory
    ) {
    }

    async processMessage(userMessage: string): Promise<string | undefined> {
        const history: ChatCompletionMessageParam[] = await this.conversationManager.getMessages()

        const userMessageObj: ChatCompletionMessageParam = {role: 'user', content: userMessage};
        history.push(userMessageObj);


        const response = await this.aiAgent.sendChat(history);
        const message = response.choices[0].message;
        const toolCalls = message.tool_calls;

        if (toolCalls?.length > 0) {
            for (const toolCall of toolCalls) {
                const {name, arguments: argStr} = toolCall.function;
                const args = JSON.parse(argStr);

                const result = await this.toolRunnerService.runTool(name, args, this.conversationManager.getSessionId())

                if(result?.agentHasChanged) {
                    this.conversationManager = await this.conversationManagerFactory.create(
                        this.conversationManager.getSessionId(),
                        args.name)
                }

                history.push(message)
                history.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(result)
                })
            }

            // recursive call in case a tool is called, so context is not lost
            const followup = await this.aiAgent.sendChat(history);
            const finalMessage = followup.choices[0].message;

            await this.conversationManager.appendMultipleMessages([
                userMessageObj,
                message,
                ...history.filter(m => m.role === "tool"),
                finalMessage

            ])

            return finalMessage.content;
        } else {
            await this.conversationManager.appendMultipleMessages([userMessageObj, message])
            return message.content;
        }

    }

    async getAgentName(): Promise<string> {
        return await this.conversationManager.getCurrentAgent()
    }
}