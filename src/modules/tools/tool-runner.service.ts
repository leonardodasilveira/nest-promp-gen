import {ConversationManager} from "@src/modules/conversation-manager/conversation-manager.service";
import {Injectable} from "@nestjs/common";

type ToolHandler = (args: any) => Promise<{ status: string }>;

@Injectable()
export class ToolRunnerService {
    private readonly handlers: Record<string, ToolHandler>;

    constructor(private readonly conversationManager: ConversationManager) {
        this.handlers = {
            edit_markdown_file: this.handleEditMarkdownFile,
            select_macro_prompt_category: this.handleSelectMacroPromptCategory,
        };
    }

    async runTool(name: string, args: any): Promise<{ status: string }> {
        const handler = this.handlers[name];
        if (!handler) {
            throw new Error(`Tool "${name}" not implemented.`);
        }
        return handler(args);
    }

    private handleEditMarkdownFile: ToolHandler = async (args: { content: string }) => {
        await this.conversationManager.saveGeneratedPrompt(args.content);
        await this.conversationManager.saveFinalPrompt();
        return { status: 'Arquivo salvo com sucesso' };
    }

    private handleSelectMacroPromptCategory: ToolHandler = async (args: { fileName: string }) => {
        await this.conversationManager.updateAgent(args.fileName);
        return { status: 'Categoria selecionada e pronta para ser utilizada' };
    }
}