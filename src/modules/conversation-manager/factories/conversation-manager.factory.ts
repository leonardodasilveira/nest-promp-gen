import {Injectable} from "@nestjs/common";
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {RedisConversationStore} from "@src/modules/conversation-manager/redis-conversation.store";
import {PromptContextBuilderService} from "@src/modules/prompt/prompt-context-builder.service";
import {IConversationStore} from "@src/modules/conversation-manager/interfaces/conversation-store.interface";
import {BASE_AGENT} from "@src/shared/constants/paths";

@Injectable()
export class ConversationManagerFactory {
    constructor(
        private readonly promptContextBuilder: PromptContextBuilderService
    ) {
    }

    async create(sessionId: string, agent: string = BASE_AGENT): Promise<ConversationManager> {
        const store: IConversationStore = new RedisConversationStore(sessionId);

        return new ConversationManager(sessionId, store, this.promptContextBuilder);
        // const manager = new ConversationManager(sessionId, store, this.promptContextBuilder);
        // await manager.start();
        // return manager;
    }
}