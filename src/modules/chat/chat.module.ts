import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {AiAgentModule} from "@src/modules/ai-agent/ai-agent.module";
import {MessageProcessorModule} from "@src/modules/message/message-processor.module";
import {ToolsModule} from "@src/modules/tools/tools.module";

@Module({
    controllers: [ChatController],
    imports: [AiAgentModule, MessageProcessorModule, ToolsModule],
    providers: [ChatService],
})
export class ChatModule {}