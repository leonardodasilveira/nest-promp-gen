import {Injectable} from '@nestjs/common';
import {IConversationStore} from "@src/modules/conversation-manager/interfaces/conversation-store.interface";
import {promises as fs} from "fs";
import path from "path"
import {BASE_AGENT} from "@src/shared/constants/paths";
import {PromptContextBuilderService} from "@src/modules/prompt/prompt-context-builder.service";

@Injectable()
export class ConversationManager {
    private readonly store: IConversationStore
    private readonly sessionId: string
    private readonly promptContextBuilder: PromptContextBuilderService
    private agent: string

    constructor(sessionId: string, store: IConversationStore) {
        this.sessionId = sessionId
        this.store = store
        this.agent = 'default'
    }


    async start() {
        const loaded = await this.store.load();
        if (!loaded || loaded.length === 0) {
            const systemPrompt = await this.promptContextBuilder.getPromptByAgent(this.sessionId, this.agent)
            await this.store.save({[this.agent]: {messages: systemPrompt}});
        }
    }

    getSessionId(): string {
        return this.sessionId
    }

    async getCurrentAgent(): Promise<string> {
        return this.agent
    }

    async getMessages(): Promise<any> {
        return await this.store.getMessages(this.agent)
    }

    async appendMessage(message: string): Promise<void> {
        await this.store.appendMessage(message, this.agent);
    }

    async updateAgent(newAgent: string): Promise<void> {
        this.agent = newAgent;
        // Opcional: garantir que o novo agente tenha estrutura
        const msgs = await this.store.getMessages(newAgent);
        if (!msgs) {
            await this.store.save({ [newAgent]: { messages: [] } });
        }
    }

    async saveGeneratedPrompt(content: string): Promise<void> {
        const agent = this.agent ?? 'default';
        const fileName = `${agent}.md`;

        const folderPath = path.resolve(
            'src/conversations',
            this.sessionId,
            'generated-prompts'
        );

        await fs.mkdir(folderPath, { recursive: true });

        const filePath = path.join(folderPath, fileName);
        await fs.writeFile(filePath, content, 'utf-8');
    }

    async saveFinalPrompt(): Promise<void> {
        const folderPath = path.resolve(
            'src/conversations',
            this.sessionId,
            'generated-prompts'
        );

        const files = await fs.readdir(folderPath);
        const markdownFiles = files.filter(f => f.endsWith('.md') && f !== 'final_prompt.md');

        const contents = await Promise.all(
            markdownFiles.map(file =>
                fs.readFile(path.join(folderPath, file), 'utf-8')
            )
        );

        const finalPath = path.join(folderPath, 'final_prompt.md');
        await fs.writeFile(finalPath, contents.join('\n\n'), 'utf-8');
    }

}
