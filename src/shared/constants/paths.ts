import * as path from 'path';

const ROOT = process.cwd(); // apps/prompt-generator

export const PROMPT_DB_FOLDER = path.join(ROOT, 'src', 'prompt-db');
export const CONVERSATIONS_FOLDER = path.join(ROOT, 'src', 'conversations');
export const BASE_AGENT = '00_base_system_prompt';
