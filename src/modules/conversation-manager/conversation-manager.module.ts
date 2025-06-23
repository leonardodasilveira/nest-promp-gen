import { Module } from '@nestjs/common';
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {ConversationManagerFactory} from "@src/modules/conversation-manager/factories/conversation-manager.factory";
import {PromptContextBuilderService} from "@src/modules/prompt/prompt-context-builder.service";

@Module({
    providers: [ConversationManager, ConversationManagerFactory, PromptContextBuilderService],
    exports: [ConversationManager]
})
export class ChatModule {}