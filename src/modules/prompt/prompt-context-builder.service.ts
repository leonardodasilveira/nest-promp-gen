import {Injectable} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import {getBlockContent, getMarkdownFileContent} from '@src/shared/utils/markdown';
import {PROMPT_DB_FOLDER, CONVERSATIONS_FOLDER, BASE_AGENT} from '@src/shared/constants/paths';

const CONFIG_PROMPT = 'config_prompt.md';

@Injectable()
export class PromptContextBuilderService {
    private conversationsFolder = CONVERSATIONS_FOLDER

    private async getPromptList(): Promise<string> {
        const files = await fs.readdir(PROMPT_DB_FOLDER);
        const promptList: Array<{ name: string; file: string; description: string }> = [];

        for (const file of files) {
            if (!file.endsWith('.md') || file.startsWith('00')) continue;

            const filePath = path.join(PROMPT_DB_FOLDER, file);
            const rawContent = (await fs.readFile(filePath, 'utf-8')).trim();

            if (!rawContent || rawContent.startsWith('# TODO')) continue;

            const description = getBlockContent(rawContent, 'DESCRIPTION');
            promptList.push({
                file,
                description,
                name: file.replace('.md', '')
            });
        }

        return JSON.stringify(promptList);
    }

    async getPromptByAgent(sessionId: string, agent: string): Promise<string> {
        const basePath = path.join(PROMPT_DB_FOLDER, BASE_AGENT);
        let basePrompt = getMarkdownFileContent(basePath);
        basePrompt += await this.getPromptList();

        const configPath = path.join(this.conversationsFolder, sessionId, CONFIG_PROMPT);
        basePrompt += getMarkdownFileContent(configPath);

        if (agent !== BASE_AGENT) {
            const agentPromptPath = path.join(PROMPT_DB_FOLDER, `${agent}.md`);
            basePrompt += getMarkdownFileContent(agentPromptPath);
        }

        return basePrompt;
    }
}
