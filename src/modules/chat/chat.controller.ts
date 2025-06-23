import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async handleChat(@Body() body: ChatDto) {
        try {
            const result = await this.chatService.processMessage(body);
            return { response: result };
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Fail to call api');
        }
    }
}
