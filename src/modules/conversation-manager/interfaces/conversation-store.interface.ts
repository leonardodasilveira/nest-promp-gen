export interface IConversationStore {
    load(): Promise<any>;
    save(data: any): Promise<void>;
    getMessages(agent: string): Promise<any>;
    appendMessage(message: any, agent: string): Promise<void>;
}