import path = require('path');

export const SRC_ROOT = path.resolve(__dirname, '../../../');
export const PROMPT_DB_FOLDER = path.join(SRC_ROOT, 'prompt-db');
export const CONVERSATIONS_FOLDER = path.join(SRC_ROOT, 'conversations');
export const BASE_AGENT = "00_base_system_prompt";
