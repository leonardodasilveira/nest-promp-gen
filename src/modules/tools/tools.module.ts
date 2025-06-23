import { Module } from '@nestjs/common';
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";
import {ToolRunnerService} from "@src/modules/tools/tool-runner.service";
import {PromptContextBuilderService} from "@src/modules/prompt/prompt-context-builder.service";
import {ChatModule} from "@src/modules/conversation-manager/conversation-manager.module";

@Module({
    providers: [ToolRunnerService, ToolDefinitionService],
    imports: [ChatModule],
    exports: [ToolRunnerService, ToolDefinitionService]
})
export class ToolsModule {}