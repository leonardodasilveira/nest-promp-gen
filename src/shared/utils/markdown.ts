import { existsSync, readFileSync } from 'fs'

export function getBlockContent(markdown: string, blockName: string): string {
    const regex = new RegExp(`\\[${blockName}\\]\\s*([\\s\\S]*?)(?=\\n\\[|$)`, 'i');
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
}

export function getMarkdownFileContent(filePath: string): string {
    if (!existsSync(filePath)) return '';
    return readFileSync(filePath, 'utf-8');
}
