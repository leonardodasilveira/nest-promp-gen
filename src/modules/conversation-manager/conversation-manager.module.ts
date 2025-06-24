import { Module } from '@nestjs/common';
import {ConversationManagerFactory} from "@src/modules/conversation-manager/factories/conversation-manager.factory";
import {PromptModule} from "@src/modules/prompt/prompt.module";

@Module({
    imports: [PromptModule],
    providers: [ConversationManagerFactory],
    exports: [ConversationManagerFactory]
})
export class ConversationManagerModule {}