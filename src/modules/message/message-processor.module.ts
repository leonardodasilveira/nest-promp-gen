import {Module} from '@nestjs/common';
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {MessageProcessorService} from "@src/modules/message/message-processor.service";
import {ToolsModule} from "@src/modules/tools/tools.module";
import {MessageProcessorFactory} from "@src/modules/message/factories/message-processor.factory";
import {ConversationManagerFactory} from "@src/modules/conversation-manager/factories/conversation-manager.factory";
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";
import {ChatModule} from "@src/modules/conversation-manager/conversation-manager.module";

@Module({
    imports: [ChatModule, ToolsModule],
    providers: [MessageProcessorFactory, ToolRunnerService],
    exports: [MessageProcessorFactory]
})

export class MessageProcessorModule {
}