import {Injectable} from "@nestjs/common";
import { ConversationManagerFactory } from "@src/modules/conversation-manager/factories/conversation-manager.factory";
import {AiAgent} from "@src/modules/ai-agent/ai-agent.service";
import { MessageProcessorService } from "../message-processor.service";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";

@Injectable()
export class MessageProcessorFactory {
    constructor(
        private readonly conversationManagerFactory: ConversationManagerFactory,
        private readonly toolRunnerService: ToolRunnerService,
        private readonly toolDefinitionService: ToolDefinitionService
    ) {}

    async create(sessionId: string): Promise<MessageProcessorService> {
        const conversationManager = await this.conversationManagerFactory.create(sessionId);
        const aiAgent = new AiAgent(this.toolDefinitionService);

        return new MessageProcessorService(conversationManager, aiAgent, this.toolRunnerService);
    }
}