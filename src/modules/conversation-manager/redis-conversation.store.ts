import Redis from 'ioredis'
import {IConversationStore} from './interfaces/conversation-store.interface';


export class RedisConversationStore implements IConversationStore {
    private readonly sessionId: string;
    private readonly redis: Redis

    constructor(sessionId: string) {
        this.sessionId = sessionId;
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379
        })
    }

    private getRedisKey(agent: string): string {
        return `convo:${this.sessionId}:${agent}`;
    }

    async load(): Promise<any[]> {
        const keys = await this.redis.keys(`convo:${this.sessionId}:*`);
        const data = await Promise.all(keys.map((k) => this.redis.get(k)));
        return data.map((d) => (d ? JSON.parse(d) : null));
    }

    async save(data: Record<string, any>): Promise<void> {
        const entries = Object.entries(data);
        await Promise.all(
            entries.map(([agent, value]) =>
                this.redis.set(this.getRedisKey(agent), JSON.stringify(value))
            )
        );
    }

    async getMessages(agent: string = 'default'): Promise<any[]> {
        const raw = await this.redis.get(this.getRedisKey(agent));
        if (!raw) return [];

        try {
            const json = JSON.parse(raw);
            return Array.isArray(json?.messages) ? json.messages : [];
        } catch (e) {
            console.warn(`Failed to parse Redis data for ${agent}`, e);
            return [];
        }
    }

    async appendMessage(message: string, agent: string = 'default'): Promise<void> {
        const key = this.getRedisKey(agent);
        const raw = await this.redis.get(key);

        let data: { messages: any[] };

        try {
            data = raw ? JSON.parse(raw) : { messages: [] };

            if (!Array.isArray(data.messages)) {
                data.messages = [];
            }

        } catch (e) {
            data = { messages: [] };
        }

        data.messages.push(message);
        await this.redis.set(key, JSON.stringify(data));
    }
}