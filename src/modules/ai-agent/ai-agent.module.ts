import { Module } from '@nestjs/common';
import {AiAgent} from "@src/modules/ai-agent/ai-agent.service";
import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";
import {AiAgentFactory} from "@src/modules/ai-agent/ai-agent.factory";

@Module({
    providers: [ToolDefinitionService, AiAgentFactory],
    exports: [AiAgentFactory],
})
export class AiAgentModule {}
