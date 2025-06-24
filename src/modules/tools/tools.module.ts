import { Module } from '@nestjs/common';
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {ConversationManagerModule} from "@src/modules/conversation-manager/conversation-manager.module";
import {PromptModule} from "@src/modules/prompt/prompt.module";

@Module({
    imports: [PromptModule, ConversationManagerModule],
    providers: [
        ToolRunnerService,
        ToolDefinitionService
    ],
    exports: [
        ToolRunnerService,
        ToolDefinitionService
    ]
})
export class ToolsModule {}