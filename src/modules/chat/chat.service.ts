import {Injectable} from '@nestjs/common';
import {ChatDto} from "@src/modules/chat/chat.dto";
import {MessageProcessorFactory} from "@src/modules/message/factories/message-processor.factory";

@Injectable()
export class ChatService {
    constructor(
        private readonly messageProcessorFactory: MessageProcessorFactory
    ) {
    }

    async processMessage(body: ChatDto): Promise<any> {
        const {sessionId, message} = body

        const messageProcessor = await this.messageProcessorFactory.create(sessionId);
        // const agentName = await messageProcessor.getAgentName()

        return await messageProcessor.processMessage(message)
    }
}
