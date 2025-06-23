import {ToolDefinitionService} from "@src/modules/tools/tool-definition.service";
import {AiAgent} from "@src/modules/ai-agent/ai-agent.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AiAgentFactory {
    constructor(private readonly toolDefinitionService: ToolDefinitionService) {
    }

    create(): AiAgent {
        return new AiAgent(this.toolDefinitionService)
    }
}