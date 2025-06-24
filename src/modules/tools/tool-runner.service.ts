import {Injectable} from "@nestjs/common";
import {ConversationManagerFactory} from "@src/modules/conversation-manager/factories/conversation-manager.factory";

type ToolHandler = (args: any, sessionId: string) => Promise<{ status: string, agentHasChanged: boolean }>;

@Injectable()
export class ToolRunnerService {
    private readonly handlers: Record<string, ToolHandler>;

    constructor(private readonly conversationManagerFactory: ConversationManagerFactory) {
        this.handlers = {
            edit_markdown_file: this.handleEditMarkdownFile,
            select_macro_prompt_category: this.handleSelectMacroPromptCategory,
        };
    }

    async runTool(name: string, args: any, sessionId: string): Promise<{ status: string, agentHasChanged: boolean }> {
        const handler = this.handlers[name];
        if (!handler) {
            throw new Error(`Tool "${name}" not implemented.`);
        }
        return handler(args, sessionId);
    }

    private handleEditMarkdownFile: ToolHandler = async (args: { content: string }, sessionId: string) => {
        const conversationManager = await this.conversationManagerFactory.create(sessionId)
        await conversationManager.saveGeneratedPrompt(args.content);
        await conversationManager.saveFinalPrompt();
        return {status: 'Arquivo salvo com sucesso', agentHasChanged: false};
    }

    private handleSelectMacroPromptCategory: ToolHandler = async (args: { fileName: string }, sessionId: string) => {
        const conversationManager = await this.conversationManagerFactory.create(sessionId)
        await conversationManager.updateAgent(args.fileName);
        return {status: 'Categoria selecionada e pronta para ser utilizada', agentHasChanged: true};
    }
}