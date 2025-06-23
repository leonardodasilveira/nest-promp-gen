import { Injectable } from "@nestjs/common";
import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {RedisConversationStore} from "@src/modules/conversation-manager/redis-conversation.store";

@Injectable()
export class ConversationManagerFactory {
    async create(sessionId: string): Promise<ConversationManager> {
        const store = new RedisConversationStore(sessionId);
        const manager = new ConversationManager(sessionId, store);
        await manager.start();
        return manager;
    }
}