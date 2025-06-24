import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {AiAgentModule} from "@src/modules/ai-agent/ai-agent.module";
import {MessageProcessorModule} from "@src/modules/message/message-processor.module";
import {ToolsModule} from "@src/modules/tools/tools.module";
import {ConversationManagerModule} from "@src/modules/conversation-manager/conversation-manager.module";

@Module({
    imports: [AiAgentModule, MessageProcessorModule, ToolsModule, ConversationManagerModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}