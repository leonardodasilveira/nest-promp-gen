import {Injectable} from '@nestjs/common';
import {RedisConversationStore} from "@src/modules/conversation-manager/redis-conversation.store";
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {MessageProcessorService} from "@src/modules/message/message-processor.service";
import {ChatDto} from "@src/modules/chat/chat.dto";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {AiAgentFactory} from "@src/modules/ai-agent/ai-agent.factory";

@Injectable()
export class ChatService {
    constructor(
        private readonly toolRunnerService: ToolRunnerService,
        private readonly aiAgentFactory: AiAgentFactory
    ) {
    }

    async processMessage(body: ChatDto): Promise<any> {
        const {sessionId, message} = body
        const conversationStore = new RedisConversationStore(sessionId)

        const conversationManager = new ConversationManager(sessionId, conversationStore)
        await conversationManager.start()

        const agentName = await conversationManager.getCurrentAgent()

        const aiAgent = this.aiAgentFactory.create()

        const messageProcessor = new MessageProcessorService(
            conversationManager,
            aiAgent,
            this.toolRunnerService
        )
        return await messageProcessor.processMessage(agentName, message)
    }
}
